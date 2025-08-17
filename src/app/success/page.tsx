'use client';

import React from 'react';
import Link from 'next/link';
import { SimpleAuthLayout } from '@/components/auth';
import Button from '@/components/ui/Button';

export default function SuccessPage() {
  return (
    <SimpleAuthLayout 
      title="로그인 성공" 
      subtitle="현대오토에버 시스템에 성공적으로 로그인했습니다"
    >
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-[#003876] mb-4">환영합니다!</h2>
        <p className="text-slate-600 mb-8">
          현대오토에버 인증 시스템에<br />
          성공적으로 로그인했습니다.
        </p>
        
        <div className="bg-slate-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-slate-700 mb-2">로그인 정보</h3>
          <div className="text-sm text-slate-600 space-y-1">
            <p>로그인 시간: {new Date().toLocaleString('ko-KR')}</p>
            <p>접속 IP: 141.164.53.132</p>
            <p>브라우저: {typeof window !== 'undefined' ? navigator.userAgent.split(' ')[0] : 'Unknown'}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button
            onClick={() => window.location.href = '/dashboard'}
            variant="primary"
            className="w-full"
          >
            대시보드로 이동
          </Button>
          
          <Link 
            href="/login" 
            className="block text-slate-500 hover:text-[#0066CC] text-sm transition-colors"
          >
            다시 로그인하기
          </Link>
        </div>
      </div>
    </SimpleAuthLayout>
  );
}