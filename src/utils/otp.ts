import { authenticator } from 'otplib';
import QRCode from 'qrcode';

export const generateOtpSecret = (): string => {
  return authenticator.generateSecret();
};

export const generateOtpAuthUrl = (email: string, secret: string): string => {
  return authenticator.keyuri(email, '현대오토에버', secret);
};

export const generateQRCode = async (otpAuthUrl: string): Promise<string> => {
  try {
    return await QRCode.toDataURL(otpAuthUrl);
  } catch (error) {
    console.error('QR 코드 생성 실패:', error);
    throw error;
  }
};

export const verifyOtpToken = (token: string, secret: string): boolean => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error('OTP 검증 실패:', error);
    return false;
  }
};

export const getCurrentOtpToken = (secret: string): string => {
  return authenticator.generate(secret);
};