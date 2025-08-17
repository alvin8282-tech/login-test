import React from 'react';

interface BrandingSectionProps {
  variant?: 'login' | 'otp';
  userName?: string;
}

export default function BrandingSection({ variant = 'login', userName }: BrandingSectionProps) {
  if (variant === 'otp') {
    return (
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-green-900 via-emerald-800 to-green-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M20 20c0 11.046-8.954 20-20 20v20h40V20c0-11.046-8.954-20-20-20z\"/%3E%3C/g%3E%3C/svg%3E')"}}></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 w-full">
          {/* Security Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-white text-2xl font-bold tracking-wide">
              보안 인증
            </div>
          </div>
          
          {/* Progress Steps */}
          <div className="mb-8 flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-2 text-green-200 text-sm">1단계 완료</span>
            </div>
            <div className="w-8 border-t-2 border-green-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-green-900 font-bold text-sm">2</span>
              </div>
              <span className="ml-2 text-white text-sm font-semibold">OTP 인증</span>
            </div>
          </div>
          
          {/* Main Message */}
          <h1 className="text-white text-3xl xl:text-4xl font-bold leading-tight mb-4">
            2단계 인증
          </h1>
          
          <p className="text-green-100 text-lg max-w-md leading-relaxed mb-8">
            <strong className="text-white">{userName}</strong>님,<br/>
            Google Authenticator로 보안을 완성하세요
          </p>
          
          {/* Security Features */}
          <div className="space-y-3 text-left">
            <div className="flex items-center space-x-3 text-green-100">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>시간 기반 일회용 비밀번호</span>
            </div>
            <div className="flex items-center space-x-3 text-green-100">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>30초마다 자동 갱신</span>
            </div>
            <div className="flex items-center space-x-3 text-green-100">
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <span>강화된 계정 보안</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 w-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-white text-4xl font-black tracking-wide">
            HYUNDAI
          </div>
          <div className="text-blue-200 text-sm font-medium tracking-[0.2em] mt-1">
            AutoEver
          </div>
        </div>
        
        {/* Main Message */}
        <h1 className="text-white text-4xl xl:text-5xl font-bold leading-tight mb-6">
          원격IP차단장비
          <span className="block text-blue-200 text-3xl xl:text-4xl mt-2">
            Manager
          </span>
        </h1>
        
        <p className="text-blue-100 text-lg max-w-md leading-relaxed mb-8">
          첨단 보안 기술로 안전한 네트워크 환경을 구축합니다
        </p>
        
        {/* Features */}
        <div className="space-y-4 text-left">
          <div className="flex items-center space-x-3 text-blue-100">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>실시간 IP 차단 모니터링</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-100">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>다중 인증 보안 시스템</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-100">
            <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            <span>24/7 네트워크 보안 관제</span>
          </div>
        </div>
      </div>
    </div>
  );
}