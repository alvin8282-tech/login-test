'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SimpleAuthLayout } from '@/components/auth';
import Input from '@/components/ui/Input';
import PasswordInput from '@/components/ui/PasswordInput';
import Button from '@/components/ui/Button';
import { validatePasswordStrength } from '@/utils/validation';
import { saveUser, findUserByEmail } from '@/utils/storage';
import { generateOtpSecret } from '@/utils/otp';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    department: '',
    employeeId: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } else if (findUserByEmail(formData.email)) {
      newErrors.email = '이미 등록된 이메일입니다.';
    }
    
    const passwordValidation = validatePasswordStrength(formData.password);
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (!passwordValidation.isValid) {
      newErrors.password = '비밀번호가 보안 요구사항을 충족하지 않습니다.';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = '성명을 입력해주세요.';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = '부서를 입력해주세요.';
    }
    
    if (!formData.employeeId.trim()) {
      newErrors.employeeId = '사번을 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // 회원가입 처리
      await new Promise(resolve => setTimeout(resolve, 2000)); // 임시 지연
      
      // OTP 시크릿 생성
      const otpSecret = generateOtpSecret();
      
      // 사용자 데이터 저장
      const newUser = {
        email: formData.email,
        password: formData.password, // 실제 환경에서는 해시화 필요
        fullName: formData.fullName,
        department: formData.department,
        employeeId: formData.employeeId,
        otpSecret,
        createdAt: new Date().toISOString()
      };
      
      saveUser(newUser);
      
      console.log('회원가입 성공:', {
        email: formData.email,
        fullName: formData.fullName,
        department: formData.department,
        employeeId: formData.employeeId
      });
      
      setIsSuccess(true);
    } catch (error) {
      console.error('회원가입 실패:', error);
      setErrors({ 
        submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <SimpleAuthLayout 
        title="회원가입 완료" 
        subtitle="성공적으로 계정이 생성되었습니다"
      >
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-[#003876] mb-4">환영합니다!</h2>
          <p className="text-slate-600 mb-6">
            <strong>{formData.fullName}</strong>님의<br />
            현대오토에버 계정이 성공적으로 생성되었습니다.
          </p>
          
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-slate-700 mb-2">계정 정보</h3>
            <div className="text-sm text-slate-600 space-y-1">
              <p>이메일: {formData.email}</p>
              <p>부서: {formData.department}</p>
              <p>사번: {formData.employeeId}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={() => router.push(`/setup-otp?email=${encodeURIComponent(formData.email)}`)}
              variant="primary"
              className="w-full"
            >
              Google OTP 설정하기
            </Button>
            
            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              className="w-full"
            >
              나중에 설정 (로그인하기)
            </Button>
            
            <button
              onClick={() => {
                setIsSuccess(false);
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  fullName: '',
                  department: '',
                  employeeId: ''
                });
                setErrors({});
              }}
              className="block w-full text-slate-500 hover:text-[#0066CC] text-sm transition-colors"
            >
              다른 계정 만들기
            </button>
          </div>
        </div>
      </SimpleAuthLayout>
    );
  }

  return (
    <SimpleAuthLayout 
      title="회원가입" 
      subtitle="현대오토에버 계정을 생성하세요"
    >
      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="이메일"
          name="email"
          type="email"
          placeholder="이메일을 입력하세요"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          autoComplete="email"
        />
        
        <Input
          label="성명"
          name="fullName"
          type="text"
          placeholder="성명을 입력하세요"
          value={formData.fullName}
          onChange={handleInputChange}
          error={errors.fullName}
          autoComplete="name"
        />
        
        <Input
          label="부서"
          name="department"
          type="text"
          placeholder="부서를 입력하세요"
          value={formData.department}
          onChange={handleInputChange}
          error={errors.department}
          autoComplete="organization"
        />
        
        <Input
          label="사번"
          name="employeeId"
          type="text"
          placeholder="사번을 입력하세요"
          value={formData.employeeId}
          onChange={handleInputChange}
          error={errors.employeeId}
        />
        
        <PasswordInput
          label="비밀번호"
          name="password"
          placeholder="비밀번호를 입력하세요"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          autoComplete="new-password"
          showStrength={true}
        />
        
        <PasswordInput
          label="비밀번호 확인"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />
        
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
        
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            회원가입
          </Button>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-slate-600 text-sm">
            이미 계정이 있으신가요?{' '}
            <Link 
              href="/login" 
              className="text-[#0066CC] hover:text-[#003876] font-medium transition-colors"
            >
              로그인
            </Link>
          </p>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            회원가입 시 개인정보 처리방침과 이용약관에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </form>
    </SimpleAuthLayout>
  );
}