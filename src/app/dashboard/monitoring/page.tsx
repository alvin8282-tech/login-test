'use client';

import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DeviceTable from '@/components/ui/DeviceTable';
import DeviceDetailModal from '@/components/ui/DeviceDetailModal';
import DeviceFormModal from '@/components/ui/DeviceFormModal';
import Button from '@/components/ui/Button';
import { 
  getAllDevices, 
  searchDevices, 
  calculateDeviceStats,
  updateDeviceStatus,
  deleteDevice,
  getCountries,
  initializeDeviceMonitoring,
  saveDeviceHistory,
  type Device,
  type DeviceStats
} from '@/utils/deviceMonitoring';

export default function DeviceMonitoringPage() {
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<DeviceStats>({
    totalDevices: 0,
    onlineDevices: 0,
    offlineDevices: 0,
    criticalDevices: 0,
    averagePerformance: { cpu: 0, memory: 0, disk: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  
  // 필터 상태
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all' as 'all' | 'online' | 'offline',
    country: '',
    networkType: 'all' as 'all' | '사용자망' | '업무망'
  });

  // 실시간 업데이트 카운터
  const [updateCounter, setUpdateCounter] = useState(0);

  // 데이터 로드
  const loadData = useCallback(() => {
    try {
      initializeDeviceMonitoring();
      const devices = getAllDevices();
      setAllDevices(devices);
      setStats(calculateDeviceStats());
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 필터 적용
  const applyFilters = useCallback(() => {
    const filtered = searchDevices(
      filters.searchTerm,
      filters.status,
      filters.country,
      filters.networkType
    );
    setFilteredDevices(filtered);
  }, [filters]);

  // 실시간 업데이트
  const handleRealTimeUpdate = useCallback(() => {
    updateDeviceStatus();
    saveDeviceHistory();
    const devices = getAllDevices();
    setAllDevices(devices);
    setStats(calculateDeviceStats());
    setUpdateCounter(prev => prev + 1);
  }, []);

  // 초기 로드
  useEffect(() => {
    loadData();
  }, [loadData]);

  // 필터 변경 시 적용
  useEffect(() => {
    applyFilters();
  }, [allDevices, filters, applyFilters]);

  // 실시간 업데이트 (5초마다)
  useEffect(() => {
    const interval = setInterval(handleRealTimeUpdate, 5000);
    return () => clearInterval(interval);
  }, [handleRealTimeUpdate]);

  // 선택된 장비 업데이트 (모달이 열려있을 때)
  useEffect(() => {
    if (selectedDevice && isDetailModalOpen) {
      const updatedDevice = allDevices.find(d => d.id === selectedDevice.id);
      if (updatedDevice) {
        setSelectedDevice(updatedDevice);
      }
    }
  }, [allDevices, selectedDevice, isDetailModalOpen]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      status: 'all',
      country: '',
      networkType: 'all'
    });
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsDetailModalOpen(true);
  };

  const handleEditDevice = (device: Device) => {
    setSelectedDevice(device);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDeleteDevice = (deviceId: string) => {
    if (deleteDevice(deviceId)) {
      loadData();
    }
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedDevice(null);
  };

  const handleAddDevice = () => {
    setSelectedDevice(null);
    setFormMode('add');
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedDevice(null);
  };

  const handleSaveDevice = () => {
    loadData();
  };

  const handleManualRefresh = () => {
    setIsLoading(true);
    handleRealTimeUpdate();
    setTimeout(() => setIsLoading(false), 500);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#0066CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">장비 모니터링 데이터를 불러오는 중...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* 페이지 헤더 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#003876]">장비 모니터링</h1>
            <p className="text-slate-600 mt-1">
              원격 IP 차단 장비 실시간 모니터링 • 
              마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button
              variant="secondary"
              onClick={handleManualRefresh}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              새로고침
            </Button>
            <Button
              variant="primary"
              onClick={handleAddDevice}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              장비 추가
            </Button>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">전체 장비</p>
                <p className="text-xl font-bold text-slate-900">{stats.totalDevices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">온라인</p>
                <p className="text-xl font-bold text-slate-900">{stats.onlineDevices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">오프라인</p>
                <p className="text-xl font-bold text-slate-900">{stats.offlineDevices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">임계치 초과</p>
                <p className="text-xl font-bold text-slate-900">{stats.criticalDevices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-slate-600">평균 CPU</p>
                <p className="text-xl font-bold text-slate-900">{stats.averagePerformance.cpu}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* 실시간 상태 표시 */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-700">실시간 모니터링 활성</span>
              <span className="text-xs text-slate-500">5초마다 자동 업데이트</span>
            </div>
            <div className="text-xs text-slate-500">
              업데이트 횟수: {updateCounter}
            </div>
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">검색 및 필터</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">통합 검색</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="장비명, 위치, IP주소 검색..."
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">상태</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                >
                  <option value="all">전체 상태</option>
                  <option value="online">온라인</option>
                  <option value="offline">오프라인</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">지역</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                >
                  <option value="">모든 지역</option>
                  {getCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">망 종류</label>
                <select
                  value={filters.networkType}
                  onChange={(e) => handleFilterChange('networkType', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                >
                  <option value="all">모든 망</option>
                  <option value="사용자망">사용자망</option>
                  <option value="업무망">업무망</option>
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
              
              <div className="text-sm text-slate-600 flex items-center">
                필터링된 결과: {filteredDevices.length}개 / 전체: {allDevices.length}개
              </div>
            </div>
          </div>
        </div>

        {/* 장비 목록 테이블 */}
        <DeviceTable
          devices={filteredDevices}
          onDeviceClick={handleDeviceClick}
          onEditDevice={handleEditDevice}
          onDeleteDevice={handleDeleteDevice}
        />

        {/* 장비 상세 정보 모달 */}
        <DeviceDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          device={selectedDevice}
        />

        {/* 장비 추가/수정 모달 */}
        <DeviceFormModal
          isOpen={isFormModalOpen}
          onClose={handleCloseFormModal}
          onSave={handleSaveDevice}
          device={selectedDevice}
          mode={formMode}
        />
      </div>
    </DashboardLayout>
  );
}