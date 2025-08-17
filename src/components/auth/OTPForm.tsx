import React from 'react';
import { User, AuthFormData, FormErrors } from '@/types/auth';

interface OTPFormProps {
  formData: AuthFormData;
  errors: FormErrors;
  isLoading: boolean;
  currentUser: User | null;
  qrCodeUrl: string;
  showQRCode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleQRCode: (show: boolean) => void;
  onBack: () => void;
}

export default function OTPForm({
  formData,
  errors,
  isLoading,
  currentUser,
  qrCodeUrl,
  showQRCode,
  onInputChange,
  onSubmit,
  onToggleQRCode,
  onBack
}: OTPFormProps) {
  return (
    <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Mobile Header */}
        <div className="lg:hidden text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">2단계 인증</h2>
        </div>

        {/* Form Header */}
        <div className="text-center mb-6">
          <h2 className="hidden lg:block text-2xl xl:text-3xl font-bold text-gray-900 mb-2">
            Google OTP 인증
          </h2>
          <p className="text-gray-600 text-sm">
            Google Authenticator에서 생성된 6자리 코드를 입력하세요
          </p>
        </div>

        {/* User Info Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {currentUser?.fullName?.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{currentUser?.fullName}</p>
              <p className="text-sm text-gray-600">{formData.email}</p>
            </div>
          </div>
        </div>

        {/* OTP Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Google OTP 코드
            </label>
            <div className="relative">
              <input
                name="otp"
                type="text"
                value={formData.otp}
                onChange={onInputChange}
                placeholder="6자리 코드"
                maxLength={6}
                pattern="\d{6}"
                autoComplete="one-time-code"
                className={`w-full px-4 py-4 text-center text-2xl font-mono tracking-widest border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 ${
                  errors.otp 
                    ? 'border-red-300 focus:border-red-500' 
                    : 'border-gray-200 focus:border-green-500 hover:border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.otp}
              </p>
            )}
          </div>

          {/* QR Code Section */}
          <div className="text-center">
            {!showQRCode ? (
              <button
                type="button"
                onClick={() => onToggleQRCode(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                QR 코드 표시
              </button>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-600 mb-3">
                  Google Authenticator에서 스캔하세요
                </p>
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="Google OTP QR Code" 
                    className="mx-auto mb-3 border rounded-lg"
                    style={{ width: '150px', height: '150px' }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onToggleQRCode(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  QR 코드 숨기기
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-100 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg disabled:shadow-none"
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
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                로그인 완료
              </div>
            )}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            ← 이전 단계로 돌아가기
          </button>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-amber-900 mb-1">
                  도움말
                </h4>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Google Authenticator 앱이 없으시나요? 
                  <br/>앱스토어에서 다운로드 후 QR 코드를 스캔해 주세요.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}