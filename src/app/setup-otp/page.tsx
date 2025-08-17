'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SimpleAuthLayout } from '@/components/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { findUserByEmail, updateUserOtpSecret, User } from '@/utils/storage';
import { generateOtpAuthUrl, generateQRCode, verifyOtpToken } from '@/utils/otp';

function SetupOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [otpSecret, setOtpSecret] = useState('');

  const generateQR = async (secret: string) => {
    try {
      const otpAuthUrl = generateOtpAuthUrl(email!, secret);
      const qrCode = await generateQRCode(otpAuthUrl);
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
    }
  };

  useEffect(() => {
    if (!email) {
      router.push('/');
      return;
    }

    const foundUser = findUserByEmail(email);
    if (!foundUser) {
      router.push('/');
      return;
    }

    setUser(foundUser);
    
    if (foundUser.otpSecret) {
      generateQR(foundUser.otpSecret);
      setOtpSecret(foundUser.otpSecret);
    }
  }, [email, router]);

  const handleVerifyOTP = async () => {
    if (!otpCode.trim()) {
      setError('OTP 코드를 입력해주세요.');
      return;
    }

    if (!/^\d{6}$/.test(otpCode)) {
      setError('OTP는 6자리 숫자여야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (verifyOtpToken(otpCode, otpSecret)) {
        // OTP 검증 성공
        updateUserOtpSecret(email!, otpSecret);
        router.push('/login');
      } else {
        setError('OTP 코드가 올바르지 않습니다. Google Authenticator에서 생성된 코드를 확인해주세요.');
      }
    } catch (error) {
      console.error('OTP 검증 실패:', error);
      setError('OTP 검증 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <SimpleAuthLayout 
      title="Google OTP 설정" 
      subtitle="2단계 인증을 위한 Google OTP를 설정하세요"
    >
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="font-medium text-slate-700 mb-3">
            {user.fullName}님의 OTP 설정
          </h3>
          
          {qrCodeUrl && (
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-3">
                Google Authenticator 앱에서 아래 QR 코드를 스캔하세요:
              </p>
              <div className="flex justify-center">
                <img 
                  src={qrCodeUrl} 
                  alt="Google OTP QR Code" 
                  className="border rounded-lg"
                  style={{ width: '200px', height: '200px' }}
                />
              </div>
            </div>
          )}
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-800 mb-2">설정 단계:</h4>
            <ol className="text-sm text-blue-700 text-left space-y-1">
              <li>1. Google Authenticator 앱을 설치하세요</li>
              <li>2. 앱에서 &apos;+&apos; 버튼을 눌러 계정 추가</li>
              <li>3. &apos;QR 코드 스캔&apos;을 선택하고 위 코드를 스캔</li>
              <li>4. 앱에서 생성된 6자리 코드를 아래에 입력</li>
            </ol>
          </div>
        </div>
        
        <Input
          label="Google OTP 코드"
          name="otp"
          type="text"
          placeholder="6자리 OTP 코드를 입력하세요"
          value={otpCode}
          onChange={(e) => {
            setOtpCode(e.target.value);
            if (error) setError('');
          }}
          error={error}
          maxLength={6}
          pattern="\d{6}"
          autoComplete="one-time-code"
        />
        
        <Button
          onClick={handleVerifyOTP}
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
        >
          OTP 설정 완료
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="text-slate-500 hover:text-[#0066CC] text-sm transition-colors"
          >
            나중에 설정하기
          </button>
        </div>
      </div>
    </SimpleAuthLayout>
  );
}

export default function SetupOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SetupOTPContent />
    </Suspense>
  );
}