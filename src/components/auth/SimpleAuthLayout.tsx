import React from 'react';

interface SimpleAuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function SimpleAuthLayout({ children, title, subtitle }: SimpleAuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center bg-white">
            <div className="mb-6">
              <div className="w-32 h-16 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-xl mx-auto flex items-center justify-center">
                <span className="text-white font-bold text-xs px-2 tracking-wide">HYUNDAI AutoEver</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#003876] mb-2">{title}</h1>
            {subtitle && (
              <p className="text-slate-600 text-sm">{subtitle}</p>
            )}
          </div>
          <div className="px-8 pb-8">
            {children}
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-slate-500 text-sm">
            © 2024 HYUNDAI AutoEver. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}