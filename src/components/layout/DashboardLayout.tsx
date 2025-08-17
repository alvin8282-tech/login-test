'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { initializeDatabase, getUserByEmail, updateLastLogin } from '@/utils/database';
import { updateLogoutLog } from '@/utils/accessLog';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  submenu?: {
    id: string;
    label: string;
    href: string;
    icon: string;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    label: '대시보드',
    href: '/dashboard',
    icon: '📊'
  },
  {
    id: 'users',
    label: '사용자 관리',
    href: '/dashboard/users',
    icon: '👥'
  },
  {
    id: 'monitoring',
    label: '장비 모니터링',
    href: '/dashboard/monitoring',
    icon: '🖥️'
  },
  {
    id: 'security',
    label: '보안 설정',
    href: '/dashboard/security',
    icon: '🔒'
  },
  {
    id: 'logs',
    label: '접속 로그',
    href: '/dashboard/logs',
    icon: '📋'
  },
  {
    id: 'settings',
    label: '시스템 설정',
    href: '/dashboard/settings',
    icon: '⚙️'
  }
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    fullName: string;
    role: string;
    department: string;
  } | null>(null);
  const [logoImage, setLogoImage] = useState<string>('');
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

  useEffect(() => {
    // 데이터베이스 초기화
    initializeDatabase();
    
    // 현재 로그인된 사용자 정보 가져오기 (실제로는 인증 토큰에서)
    const userEmail = sessionStorage.getItem('currentUser');
    if (userEmail) {
      const user = getUserByEmail(userEmail);
      setCurrentUser(user);
    } else {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/login');
    }

    // 저장된 로고 이미지 로드
    const savedLogo = localStorage.getItem('hyundai-logo-image');
    if (savedLogo) {
      setLogoImage(savedLogo);
    }
  }, [router]);

  const handleLogout = () => {
    // 로그아웃 로그 기록
    if (currentUser) {
      updateLogoutLog(currentUser.email);
    }
    
    sessionStorage.removeItem('currentUser');
    router.push('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  };

  // 현재 경로가 서브메뉴에 포함되어 있으면 자동으로 메뉴 확장
  useEffect(() => {
    menuItems.forEach(item => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(submenu => 
          pathname === submenu.href || pathname.startsWith(submenu.href + '/')
        );
        if (hasActiveSubmenu) {
          setExpandedMenus(prev => new Set([...prev, item.id]));
        }
      }
    });
  }, [pathname]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* 상단 헤더 */}
      <header className="bg-white shadow-sm border-b border-slate-200 fixed top-0 left-0 right-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center ml-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-lg flex items-center justify-center mr-3 p-1">
                {logoImage ? (
                  <img 
                    src={logoImage} 
                    alt="Hyundai AutoEver Logo" 
                    className="w-full h-full object-contain"
                    onError={() => setLogoImage('')}
                  />
                ) : (
                  <span className="text-white font-bold text-xs">H</span>
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#003876]">원격IP차단장비</h1>
                <p className="text-sm text-slate-600 -mt-1">Manager</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{currentUser.fullName}</p>
              <p className="text-xs text-slate-500">{currentUser.department}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser.fullName?.charAt(0) || 'U'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="ml-3 px-3 py-1 text-sm text-slate-600 hover:text-[#003876] border border-slate-300 rounded-md hover:border-[#003876] transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 사이드바 */}
      <aside className={`
        fixed top-16 left-0 z-30 w-64 h-full bg-white shadow-lg border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || 
                             (item.href !== '/dashboard' && pathname.startsWith(item.href));
              const isExpanded = expandedMenus.has(item.id);
              const hasActiveSubmenu = item.submenu?.some(submenu => 
                pathname === submenu.href || pathname.startsWith(submenu.href + '/')
              );
              
              return (
                <li key={item.id}>
                  {item.submenu ? (
                    // 서브메뉴가 있는 메뉴 아이템
                    <>
                      <button
                        onClick={() => toggleMenu(item.id)}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors
                          ${hasActiveSubmenu
                            ? 'bg-gradient-to-r from-[#003876] to-[#0066CC] text-white shadow-md' 
                            : 'text-slate-700 hover:bg-slate-100 hover:text-[#003876]'
                          }
                        `}
                      >
                        <div className="flex items-center">
                          <span className="mr-3 text-lg">{item.icon}</span>
                          {item.label}
                        </div>
                        <svg 
                          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* 서브메뉴 */}
                      {isExpanded && (
                        <ul className="mt-2 ml-6 space-y-1">
                          {item.submenu.map((submenu) => {
                            const isSubmenuActive = pathname === submenu.href || 
                                                   pathname.startsWith(submenu.href + '/');
                            
                            return (
                              <li key={submenu.id}>
                                <Link
                                  href={submenu.href}
                                  className={`
                                    flex items-center px-3 py-2 rounded-md text-sm transition-colors
                                    ${isSubmenuActive
                                      ? 'bg-[#0066CC] text-white shadow-sm' 
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#003876]'
                                    }
                                  `}
                                >
                                  <span className="mr-2 text-sm">{submenu.icon}</span>
                                  {submenu.label}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </>
                  ) : (
                    // 일반 메뉴 아이템
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors
                        ${isActive 
                          ? 'bg-gradient-to-r from-[#003876] to-[#0066CC] text-white shadow-md' 
                          : 'text-slate-700 hover:bg-slate-100 hover:text-[#003876]'
                        }
                      `}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* 모바일 오버레이 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* 메인 콘텐츠 */}
      <main className={`
        pt-16 transition-all duration-300 ease-in-out
        ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'}
      `}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}