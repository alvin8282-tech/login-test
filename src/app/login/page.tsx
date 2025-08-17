'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FullScreenAuthLayout, BrandingSection, LoginForm, OTPForm } from '@/components/auth';
import { findUserByEmail } from '@/utils/storage';
import { verifyOtpToken, generateOtpAuthUrl, generateQRCode } from '@/utils/otp';
import { updateLastLogin } from '@/utils/database';
import { addLoginLog, initializeAccessLogs } from '@/utils/accessLog';
import { AuthStep, User, AuthFormData, FormErrors } from '@/types/auth';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>('credentials');
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    otp: ''
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // 컴포넌트 마운트 시 접속 로그 시스템 초기화
  React.useEffect(() => {
    initializeAccessLogs();
  }, []);

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

  const validateCredentials = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateOTP = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.otp.trim()) {
      newErrors.otp = 'Google OTP를 입력해주세요.';
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = 'OTP는 6자리 숫자여야 합니다.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateOTP()) return;
    
    setIsLoading(true);
    
    try {
      // 2차 인증 - Google OTP 검증
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 실제 OTP 검증
      if (currentUser && currentUser.otpSecret && verifyOtpToken(formData.otp, currentUser.otpSecret)) {
        // 로그인 성공 로그 기록
        addLoginLog(currentUser.email, currentUser.fullName, currentUser.email, true);
        
        // 현재 사용자 정보를 세션에 저장
        sessionStorage.setItem('currentUser', currentUser.email);
        // 마지막 로그인 시간 업데이트
        updateLastLogin(currentUser.email);
        // 대시보드로 리다이렉트
        router.push('/dashboard');
      } else {
        // OTP 실패 로그 기록
        if (currentUser) {
          addLoginLog(currentUser.email, currentUser.fullName, currentUser.email, false, 'OTP 인증 실패');
        }
        setErrors({ 
          otp: 'OTP 코드가 올바르지 않습니다. Google Authenticator에서 생성된 코드를 다시 확인해주세요.' 
        });
      }
    } catch (error) {
      console.error('2차 인증 실패:', error);
      setErrors({ 
        otp: '인증 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 'credentials') {
      if (!validateCredentials()) return;
      
      setIsLoading(true);
      
      try {
        // 1차 인증 - 이메일/비밀번호 검증
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 등록된 사용자 찾기
        const user = findUserByEmail(formData.email);
        if (!user) {
          // 로그인 실패 로그 기록
          addLoginLog('unknown', 'Unknown User', formData.email, false, '등록되지 않은 이메일');
          setErrors({ 
            email: '등록되지 않은 이메일입니다.' 
          });
          return;
        }
        
        // 비밀번호 검증
        if (user.password !== formData.password) {
          // 로그인 실패 로그 기록
          addLoginLog(user.email, user.fullName, user.email, false, '잘못된 비밀번호');
          setErrors({ 
            password: '비밀번호가 올바르지 않습니다.' 
          });
          return;
        }
        
        // OTP 설정 확인
        if (!user.otpSecret) {
          setErrors({ 
            submit: 'OTP가 설정되지 않은 계정입니다.' 
          });
          return;
        }
        
        // QR 코드 생성
        const otpAuthUrl = generateOtpAuthUrl(user.email, user.otpSecret);
        const qrCode = await generateQRCode(otpAuthUrl);
        
        setCurrentUser(user);
        setQrCodeUrl(qrCode);
        setStep('otp');
        setErrors({});
      } catch (error) {
        console.error('1차 인증 실패:', error);
        setErrors({ 
          password: '인증 중 오류가 발생했습니다.' 
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      await handleOTPSubmit(e);
    }
  };

  return (
    <FullScreenAuthLayout
      leftSide={
        <BrandingSection 
          variant={step === 'credentials' ? 'login' : 'otp'}
          userName={currentUser?.fullName}
        />
      }
    >
      {step === 'credentials' ? (
        <LoginForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <OTPForm
          formData={formData}
          errors={errors}
          isLoading={isLoading}
          currentUser={currentUser}
          qrCodeUrl={qrCodeUrl}
          showQRCode={showQRCode}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
          onToggleQRCode={setShowQRCode}
          onBack={() => {
            setStep('credentials');
            setFormData({ email: formData.email, password: '', otp: '' });
            setCurrentUser(null);
            setQrCodeUrl('');
            setShowQRCode(false);
            setErrors({});
          }}
        />
      )}
    </FullScreenAuthLayout>
  );
}