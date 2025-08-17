'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SimpleAuthLayout } from '@/components/auth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('이메일을 입력해주세요.');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 비밀번호 재설정 API 호출 로직
      await new Promise(resolve => setTimeout(resolve, 2000)); // 임시 지연
      console.log('비밀번호 재설정 요청:', email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      setError('비밀번호 재설정 요청에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <SimpleAuthLayout 
        title="이메일 전송 완료" 
        subtitle="비밀번호 재설정 링크를 전송했습니다"
      >
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-slate-600 mb-6">
            <strong>{email}</strong>로<br />
            비밀번호 재설정 링크를 전송했습니다.<br />
            이메일을 확인해주세요.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              variant="outline"
              className="w-full"
            >
              다른 이메일로 재시도
            </Button>
            <Link 
              href="/login" 
              className="block text-[#0066CC] hover:text-[#003876] text-sm font-medium transition-colors"
            >
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </SimpleAuthLayout>
    );
  }

  return (
    <SimpleAuthLayout 
      title="비밀번호 재설정" 
      subtitle="등록된 이메일로 재설정 링크를 보내드립니다"
    >
      <form onSubmit={handleSubmit} className="space-y-1">
        <Input
          label="이메일"
          name="email"
          type="email"
          placeholder="등록된 이메일을 입력하세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          error={error}
          autoComplete="email"
        />
        
        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            재설정 링크 전송
          </Button>
        </div>
        
        <div className="text-center pt-4">
          <Link 
            href="/login" 
            className="text-[#0066CC] hover:text-[#003876] text-sm font-medium transition-colors"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
        
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            계정이 없으신가요?{' '}
            <Link 
              href="/register" 
              className="text-[#0066CC] hover:text-[#003876] font-medium transition-colors"
            >
              회원가입
            </Link>
          </p>
        </div>
      </form>
    </SimpleAuthLayout>
  );
}