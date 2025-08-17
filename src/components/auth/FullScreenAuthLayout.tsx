import React from 'react';

interface FullScreenAuthLayoutProps {
  children: React.ReactNode;
  leftSide: React.ReactNode;
}

export default function FullScreenAuthLayout({ children, leftSide }: FullScreenAuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex">
      {leftSide}
      {children}
    </div>
  );
}