'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AccessLogTable from '@/components/ui/AccessLogTable';
import { 
  getAllAccessLogs, 
  getLogsByDateRange, 
  getLogsByUser, 
  calculateAccessStats,
  downloadCSV,
  getActiveSessions,
  getDailyStats,
  initializeAccessLogs,
  type AccessLog,
  type AccessStats
} from '@/utils/accessLog';
import { getAllUsers } from '@/utils/database';

export default function AccessLogsPage() {
  const [allLogs, setAllLogs] = useState<AccessLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AccessLog[]>([]);
  const [stats, setStats] = useState<AccessStats>({
    totalSessions: 0,
    activeSessions: 0,
    failedAttempts: 0,
    avgSessionDuration: 0,
    uniqueUsers: 0
  });
  const [activeSessions, setActiveSessions] = useState<AccessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 필터 상태
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    status: 'all' as 'all' | 'success' | 'failed' | 'active'
  });

  const [users, setUsers] = useState<{ id: string; fullName: string; email: string }[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allLogs, filters]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 접속 로그 시스템 초기화
      initializeAccessLogs();
      
      // 데이터 로드
      const logs = getAllAccessLogs();
      const userList = getAllUsers();
      const sessions = getActiveSessions();
      
      setAllLogs(logs);
      setUsers(userList);
      setActiveSessions(sessions);
      setStats(calculateAccessStats(logs));
      
      // 기본 날짜 범위 설정 (최근 7일)
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      setFilters(prev => ({
        ...prev,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      }));
      
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allLogs];

    // 날짜 범위 필터
    if (filters.startDate && filters.endDate) {
      filtered = getLogsByDateRange(filters.startDate, filters.endDate);
    }

    // 사용자 필터
    if (filters.userId) {
      filtered = filtered.filter(log => log.userId === filters.userId);
    }

    // 상태 필터
    if (filters.status !== 'all') {
      if (filters.status === 'success') {
        filtered = filtered.filter(log => log.status === 'active' || log.status === 'logged_out');
      } else if (filters.status === 'failed') {
        filtered = filtered.filter(log => log.status === 'failed');
      } else if (filters.status === 'active') {
        filtered = filtered.filter(log => log.status === 'active');
      }
    }

    setFilteredLogs(filtered);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = () => {
    downloadCSV(filteredLogs, 'access_logs_filtered');
  };

  const handleExportAll = () => {
    downloadCSV(allLogs, 'access_logs_all');
  };

  const resetFilters = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    setFilters({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      userId: '',
      status: 'all'
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">접속 로그를 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-[#003876]">접속 로그</h1>
          <p className="text-slate-600 mt-1">사용자 접속 기록 및 보안 로그를 관리합니다</p>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">총 세션</p>
                <p className="text-xl font-bold text-slate-900">{stats.totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">활성 세션</p>
                <p className="text-xl font-bold text-slate-900">{activeSessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">실패 시도</p>
                <p className="text-xl font-bold text-slate-900">{stats.failedAttempts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">평균 세션</p>
                <p className="text-xl font-bold text-slate-900">{Math.round(stats.avgSessionDuration / 60)}분</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">고유 사용자</p>
                <p className="text-xl font-bold text-slate-900">{stats.uniqueUsers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 필터 섹션 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">필터 및 검색</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">시작 날짜</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">종료 날짜</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">사용자</label>
                <select
                  value={filters.userId}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                >
                  <option value="">모든 사용자</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.fullName}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">상태</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                >
                  <option value="all">모든 상태</option>
                  <option value="success">성공</option>
                  <option value="failed">실패</option>
                  <option value="active">활성</option>
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
              >
                필터 초기화
              </button>
              
              <button
                onClick={handleExportAll}
                className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                전체 로그 내보내기
              </button>
              
              <div className="text-sm text-slate-600 flex items-center">
                필터링된 결과: {filteredLogs.length}개 / 전체: {allLogs.length}개
              </div>
            </div>
          </div>
        </div>

        {/* 실시간 접속자 현황 */}
        {activeSessions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">실시간 접속자 현황</h2>
              <p className="text-sm text-slate-600 mt-1">현재 시스템에 접속 중인 사용자들</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeSessions.map(session => (
                  <div key={session.id} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {session.userName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="text-sm font-medium text-slate-900">{session.userName}</div>
                        <div className="text-xs text-slate-500">{session.ipAddress}</div>
                        <div className="text-xs text-green-600">
                          접속: {new Date(session.loginTime).toLocaleTimeString('ko-KR')}
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 접속 로그 테이블 */}
        <AccessLogTable 
          logs={filteredLogs} 
          onExport={handleExport}
        />
      </div>
    </DashboardLayout>
  );
}