import React from 'react';
import Link from 'next/link';
import { AuthFormData, FormErrors } from '@/types/auth';

interface LoginFormProps {
  formData: AuthFormData;
  errors: FormErrors;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({ 
  formData, 
  errors, 
  isLoading, 
  onInputChange, 
  onSubmit 
}: LoginFormProps) {
  return (
    <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <div className="text-blue-900 text-3xl font-black tracking-wide">
            HYUNDAI
          </div>
          <div className="text-blue-600 text-sm font-medium tracking-[0.2em]">
            AutoEver
          </div>
        </div>

        {/* Form Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl xl:text-3xl font-bold text-gray-900 mb-2">
            로그인
          </h2>
          <p className="text-gray-600 text-sm">
            보안 시스템에 안전하게 접속하세요
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              이메일
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="이메일을 입력하세요"
                autoComplete="email"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.email 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={onInputChange}
                placeholder="비밀번호를 입력하세요"
                autoComplete="current-password"
                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 ${
                  errors.password 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-blue-500 hover:border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg disabled:shadow-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                인증 중...
              </div>
            ) : (
              '다음 단계'
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3 text-center">
            <p className="text-gray-600 text-sm">
              계정이 없으신가요?{' '}
              <Link 
                href="/register" 
                className="font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                회원가입
              </Link>
            </p>
            <Link 
              href="/forgot-password" 
              className="block text-gray-500 hover:text-blue-600 text-sm transition-colors"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  보안 안내
                </h4>
                <p className="text-xs text-blue-700 leading-relaxed">
                  로그인 후 Google OTP 2단계 인증이 필요합니다. 
                  Google Authenticator 앱을 미리 준비해 주세요.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}