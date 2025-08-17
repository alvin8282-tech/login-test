export interface User {
  email: string;
  password: string;
  fullName: string;
  department: string;
  employeeId: string;
  otpSecret?: string;
  createdAt: string;
}

export type AuthStep = 'credentials' | 'otp';

export interface AuthFormData {
  email: string;
  password: string;
  otp: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  department: string;
  employeeId: string;
}

export interface FormErrors {
  [key: string]: string;
}