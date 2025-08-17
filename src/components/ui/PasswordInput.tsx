import React, { useState } from 'react';
import { validatePasswordStrength, getPasswordStrengthText } from '@/utils/validation';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

export default function PasswordInput({ 
  label, 
  error, 
  showStrength = false, 
  className = '', 
  onChange,
  ...props 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({ score: 0, feedback: [] as string[] });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrength) {
      const result = validatePasswordStrength(e.target.value);
      setStrength(result);
    }
    if (onChange) {
      onChange(e);
    }
  };

  const strengthInfo = getPasswordStrengthText(strength.score);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          className={`w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-[#0066CC] transition-colors placeholder-slate-400 ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          } ${className}`}
          onChange={handleChange}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.588 6.588m4.242 4.242L14.12 17.12m-4.242-4.242L2.588 5.588" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      
      {showStrength && props.value && (
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-600">비밀번호 강도</span>
            <span className={`text-xs font-medium ${strengthInfo.color}`}>
              {strengthInfo.text}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                strength.score >= 5 ? 'bg-green-500' :
                strength.score >= 4 ? 'bg-blue-500' :
                strength.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(10, (strength.score / 6) * 100)}%` }}
            />
          </div>
          {strength.feedback.length > 0 && (
            <div className="mt-2 text-xs text-red-600">
              <ul className="list-disc list-inside space-y-1">
                {strength.feedback.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}