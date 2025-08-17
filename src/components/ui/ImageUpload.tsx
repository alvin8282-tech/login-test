'use client';

import React, { useState, useRef } from 'react';
import Button from './Button';

interface ImageUploadProps {
  onImageUpload: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
}

export default function ImageUpload({ 
  onImageUpload, 
  currentImage, 
  label = "이미지 업로드",
  accept = "image/*",
  maxSize = 5 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // 파일 크기 체크
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기는 ${maxSize}MB 이하여야 합니다.`;
    }

    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      return '이미지 파일만 업로드 가능합니다.';
    }

    return null;
  };

  const handleFileUpload = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // 실제 환경에서는 서버에 업로드하지만, 여기서는 로컬 URL 생성
      const imageUrl = URL.createObjectURL(file);
      
      // 로컬 스토리지에 파일 정보 저장 (실제로는 서버에 저장)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        localStorage.setItem('hyundai-logo-image', base64);
        onImageUpload(imageUrl);
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      setError('이미지 업로드 중 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    localStorage.removeItem('hyundai-logo-image');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {/* 현재 이미지 미리보기 */}
      {currentImage && (
        <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
          <div className="w-12 h-12 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-lg flex items-center justify-center p-1">
            <img 
              src={currentImage} 
              alt="현재 로고" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-600">현재 로고 이미지</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={removeImage}
            className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
          >
            제거
          </Button>
        </div>
      )}

      {/* 파일 업로드 영역 */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer
          ${isDragging 
            ? 'border-[#0066CC] bg-blue-50' 
            : 'border-slate-300 hover:border-[#0066CC] hover:bg-slate-50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-[#0066CC] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-600">업로드 중...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <svg className="w-8 h-8 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div>
              <p className="text-sm text-slate-600">
                <span className="font-medium text-[#0066CC]">클릭하여 파일 선택</span> 또는 드래그 앤 드롭
              </p>
              <p className="text-xs text-slate-500 mt-1">
                PNG, JPG, GIF 파일 ({maxSize}MB 이하)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
    </div>
  );
}