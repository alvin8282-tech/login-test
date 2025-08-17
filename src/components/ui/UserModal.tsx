'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/utils/database';
import Button from './Button';
import Input from './Input';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: Omit<User, 'id' | 'createdAt'>) => void;
  user?: User | null;
  mode: 'add' | 'edit' | 'view';
}

export default function UserModal({ isOpen, onClose, onSave, user, mode }: UserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    department: '',
    role: 'user' as User['role'],
    status: 'active' as User['status'],
    lastLogin: '',
    otpSecret: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && (mode === 'edit' || mode === 'view')) {
      setFormData({
        email: user.email,
        password: user.password,
        fullName: user.fullName,
        department: user.department,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
        otpSecret: user.otpSecret || ''
      });
    } else {
      setFormData({
        email: '',
        password: '',
        fullName: '',
        department: '',
        role: 'user',
        status: 'active',
        lastLogin: '',
        otpSecret: ''
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (!formData.password.trim() && mode === 'add') {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = '사용자명을 입력해주세요.';
    }

    if (!formData.department.trim()) {
      newErrors.department = '부서를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') return;
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 시뮬레이션
      
      const userData = {
        ...formData,
        lastLogin: formData.lastLogin || new Date().toISOString()
      };
      
      onSave(userData);
      onClose();
    } catch (error) {
      console.error('사용자 저장 실패:', error);
      setErrors({ submit: '저장 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add': return '새 사용자 추가';
      case 'edit': return '사용자 정보 수정';
      case 'view': return '사용자 정보 보기';
      default: return '';
    }
  };

  const getRoleDisplayName = (role: User['role']) => {
    const roleNames = {
      admin: '관리자',
      user: '일반사용자',
      guest: '게스트'
    };
    return roleNames[role];
  };

  const getStatusDisplayName = (status: User['status']) => {
    const statusNames = {
      active: '활성',
      inactive: '비활성',
      pending: '대기'
    };
    return statusNames[status];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">{getModalTitle()}</h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 내용 */}
          <form onSubmit={handleSubmit} className="p-6">
            {mode === 'view' ? (
              // 보기 모드
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-full mx-auto flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-2xl">
                      {formData.fullName.charAt(0)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{formData.fullName}</h3>
                  <p className="text-slate-600">{formData.department}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">이메일</label>
                    <p className="text-sm text-slate-900">{formData.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">역할</label>
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {getRoleDisplayName(formData.role)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">상태</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      formData.status === 'active' ? 'bg-green-100 text-green-800' :
                      formData.status === 'inactive' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getStatusDisplayName(formData.status)}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">마지막 접속</label>
                    <p className="text-sm text-slate-900">{formatDate(formData.lastLogin)}</p>
                  </div>
                </div>

                {formData.otpSecret && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">OTP 설정</label>
                    <p className="text-sm text-green-600">✓ 설정됨</p>
                  </div>
                )}
              </div>
            ) : (
              // 추가/수정 모드
              <div className="space-y-4">
                <Input
                  label="이메일"
                  name="email"
                  type="email"
                  placeholder="user@hyundai-autoever.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={errors.email}
                  disabled={mode === 'edit'}
                />

                <Input
                  label={mode === 'add' ? '비밀번호' : '새 비밀번호 (변경 시에만)'}
                  name="password"
                  type="password"
                  placeholder={mode === 'add' ? '비밀번호를 입력하세요' : '기존 비밀번호 유지 (비워두면)'}
                  value={formData.password}
                  onChange={handleInputChange}
                  error={errors.password}
                />

                <Input
                  label="사용자명"
                  name="fullName"
                  type="text"
                  placeholder="홍길동"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={errors.fullName}
                />

                <Input
                  label="부서"
                  name="department"
                  type="text"
                  placeholder="IT부"
                  value={formData.department}
                  onChange={handleInputChange}
                  error={errors.department}
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">역할</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="user">일반사용자</option>
                    <option value="admin">관리자</option>
                    <option value="guest">게스트</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">상태</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  >
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                    <option value="pending">대기</option>
                  </select>
                </div>

                {errors.submit && (
                  <div className="text-red-600 text-sm">{errors.submit}</div>
                )}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                {mode === 'view' ? '닫기' : '취소'}
              </Button>
              {mode !== 'view' && (
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                >
                  {mode === 'add' ? '추가' : '수정'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}