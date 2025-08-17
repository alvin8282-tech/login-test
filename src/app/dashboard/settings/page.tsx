'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ImageUpload from '@/components/ui/ImageUpload';
import Button from '@/components/ui/Button';

export default function SettingsPage() {
  const [logoImage, setLogoImage] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string>('');

  useEffect(() => {
    // 저장된 로고 이미지 로드
    const savedImage = localStorage.getItem('hyundai-logo-image');
    if (savedImage) {
      setLogoImage(savedImage);
    }
  }, []);

  const handleLogoUpload = (imageUrl: string) => {
    setLogoImage(imageUrl);
    setSaveMessage('');
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // 실제로는 서버에 저장하지만, 여기서는 로컬 스토리지 사용
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      
      setSaveMessage('설정이 성공적으로 저장되었습니다.');
      
      // 3초 후 메시지 제거
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('설정 저장 실패:', error);
      setSaveMessage('설정 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem('hyundai-logo-image');
    setLogoImage('');
    setSaveMessage('기본 설정으로 복원되었습니다.');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-[#003876]">시스템 설정</h1>
          <p className="text-slate-600 mt-1">시스템 외관 및 기본 설정을 관리합니다</p>
        </div>

        {/* 설정 섹션들 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 로고 설정 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">로고 설정</h2>
                <p className="text-sm text-slate-600 mt-1">시스템 로고를 사용자 정의할 수 있습니다</p>
              </div>
              <div className="p-6">
                <ImageUpload
                  currentImage={logoImage}
                  onImageUpload={handleLogoUpload}
                  label="시스템 로고"
                  maxSize={2}
                />
                
                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <div className="text-sm text-slate-600">
                    <p>• 권장 크기: 32x32px 또는 64x64px</p>
                    <p>• 투명 배경 PNG 파일 권장</p>
                    <p>• 파일 크기: 2MB 이하</p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={resetToDefault}
                    className="w-full sm:w-auto"
                  >
                    기본값으로 복원
                  </Button>
                </div>
              </div>
            </div>

            {/* 기타 설정 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">시스템 정보</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">시스템 이름</label>
                    <p className="text-sm text-slate-900">원격IP차단장비 Manager</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">버전</label>
                    <p className="text-sm text-slate-900">v1.0.0</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">마지막 업데이트</label>
                    <p className="text-sm text-slate-900">2024-08-16</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">개발사</label>
                    <p className="text-sm text-slate-900">HYUNDAI AutoEver</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 미리보기 패널 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">미리보기</h2>
                <p className="text-sm text-slate-600 mt-1">변경된 로고가 어떻게 표시되는지 확인하세요</p>
              </div>
              <div className="p-6">
                {/* 헤더 미리보기 */}
                <div className="bg-slate-50 rounded-lg p-4 mb-4">
                  <p className="text-xs text-slate-500 mb-2">대시보드 헤더</p>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-lg flex items-center justify-center mr-3 p-1">
                      {logoImage ? (
                        <img 
                          src={logoImage} 
                          alt="로고 미리보기" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white font-bold text-xs">H</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#003876]">원격IP차단장비</h3>
                      <p className="text-xs text-slate-600 -mt-1">Manager</p>
                    </div>
                  </div>
                </div>

                {/* 사이드바 미리보기 */}
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs text-slate-500 mb-2">사이드바 (작은 크기)</p>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-md flex items-center justify-center mr-2 p-0.5">
                      {logoImage ? (
                        <img 
                          src={logoImage} 
                          alt="로고 미리보기" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-white font-bold text-xs">H</span>
                      )}
                    </div>
                    <span className="text-xs text-slate-700">HYUNDAI AutoEver</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6">
                <Button
                  variant="primary"
                  onClick={handleSaveSettings}
                  isLoading={isSaving}
                  className="w-full"
                >
                  {isSaving ? '저장 중...' : '설정 저장'}
                </Button>
                
                {saveMessage && (
                  <div className={`mt-3 text-sm text-center ${
                    saveMessage.includes('성공') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {saveMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}