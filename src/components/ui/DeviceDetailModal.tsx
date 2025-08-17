'use client';

import React, { useState, useEffect } from 'react';
import { Device, getStatusColor, getPerformanceColor, formatUptime, formatLastSeen, checkAlarms, getDeviceHistory, type DeviceHistory } from '@/utils/deviceMonitoring';

interface DeviceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

export default function DeviceDetailModal({ isOpen, onClose, device }: DeviceDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'alarms'>('overview');
  const [performanceHistory, setPerformanceHistory] = useState<DeviceHistory[]>([]);

  useEffect(() => {
    if (device && isOpen) {
      // 성능 기록 로드 (최근 1시간)
      const history = getDeviceHistory(device.id, 1);
      setPerformanceHistory(history);
    }
  }, [device, isOpen]);

  if (!isOpen || !device) return null;

  const alarms = checkAlarms(device);

  const getPerformanceIndicator = (value: number, label: string, threshold: number = 80, unit: string = '%') => {
    const colorClass = getPerformanceColor(value, threshold);
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-slate-700">{label}</span>
          <span className={`text-lg font-bold px-2 py-1 rounded ${colorClass}`}>
            {value}{unit}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 relative">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              value >= threshold ? 'bg-red-500' : 
              value >= threshold * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(value, 100)}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-white drop-shadow">
              {value >= 10 ? `${value}%` : ''}
            </span>
          </div>
        </div>
        {value >= threshold && (
          <div className="mt-1 text-xs text-red-600">
            ⚠️ 임계치 초과 (기준: {threshold}%)
          </div>
        )}
      </div>
    );
  };

  const formatTraffic = (mbps: number): string => {
    if (mbps >= 1000) {
      return `${(mbps / 1000).toFixed(1)} Gbps`;
    }
    return `${mbps.toFixed(1)} Mbps`;
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">기본 정보</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">장비명:</span>
              <span className="font-medium">{device.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">상태:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                {device.status === 'online' ? '온라인' : '오프라인'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">위치:</span>
              <span className="font-medium">{device.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">IP 주소:</span>
              <span className="font-mono text-sm">{device.ipAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">망 종류:</span>
              <span className="font-medium">{device.networkType}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-slate-900">상태 정보</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-600">마지막 접속:</span>
              <span className="font-medium">{formatLastSeen(device.lastSeen)}</span>
            </div>
            {device.status === 'online' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-600">업타임:</span>
                  <span className="font-medium">{formatUptime(device.performance.uptime)}</span>
                </div>
                {device.performance.temperature && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">온도:</span>
                    <span className="font-medium">{device.performance.temperature}°C</span>
                  </div>
                )}
              </>
            )}
            <div className="flex justify-between">
              <span className="text-slate-600">생성일:</span>
              <span className="font-medium">{new Date(device.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">최종 업데이트:</span>
              <span className="font-medium">{new Date(device.updatedAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 네트워크 트래픽 */}
      {device.status === 'online' && (
        <div>
          <h4 className="font-semibold text-slate-900 mb-4">네트워크 트래픽</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">인바운드</span>
                <span className="text-lg font-bold text-blue-900">
                  {formatTraffic(device.performance.network.inbound)}
                </span>
              </div>
              <div className="mt-2 flex items-center">
                <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                <span className="text-xs text-blue-600">수신 트래픽</span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-700">아웃바운드</span>
                <span className="text-lg font-bold text-green-900">
                  {formatTraffic(device.performance.network.outbound)}
                </span>
              </div>
              <div className="mt-2 flex items-center">
                <svg className="w-4 h-4 text-green-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                <span className="text-xs text-green-600">송신 트래픽</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderPerformanceTab = () => (
    <div className="space-y-6">
      {device.status === 'online' ? (
        <>
          {/* 성능 지표 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getPerformanceIndicator(device.performance.cpu, 'CPU 사용률', device.alarmSettings.cpuThreshold)}
            {getPerformanceIndicator(device.performance.memory, '메모리 사용률', device.alarmSettings.memoryThreshold)}
            {getPerformanceIndicator(device.performance.disk, '디스크 사용률', device.alarmSettings.diskThreshold)}
          </div>

          {/* 임계치 설정 */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">알람 임계치</h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-slate-600">CPU</div>
                  <div className="text-lg font-bold text-slate-900">{device.alarmSettings.cpuThreshold}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">메모리</div>
                  <div className="text-lg font-bold text-slate-900">{device.alarmSettings.memoryThreshold}%</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">디스크</div>
                  <div className="text-lg font-bold text-slate-900">{device.alarmSettings.diskThreshold}%</div>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className={`text-sm ${device.alarmSettings.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  알람 {device.alarmSettings.enabled ? '활성화' : '비활성화'}
                </span>
              </div>
            </div>
          </div>

          {/* 성능 기록 차트 (간단한 텍스트 기반) */}
          {performanceHistory.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">성능 기록 (최근 1시간)</h4>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="text-sm text-slate-600 mb-2">
                  {performanceHistory.length}개의 기록 (5분 간격)
                </div>
                <div className="space-y-2">
                  {performanceHistory.slice(-6).map((record, index) => (
                    <div key={record.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {new Date(record.timestamp).toLocaleTimeString('ko-KR')}
                      </span>
                      <div className="flex space-x-4">
                        <span>CPU: {record.performance.cpu}%</span>
                        <span>MEM: {record.performance.memory}%</span>
                        <span>DISK: {record.performance.disk}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-slate-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-slate-500">장비가 오프라인 상태입니다.</p>
          <p className="text-sm text-slate-400">성능 데이터를 사용할 수 없습니다.</p>
        </div>
      )}
    </div>
  );

  const renderAlarmsTab = () => (
    <div className="space-y-6">
      {alarms.length > 0 ? (
        <div>
          <h4 className="font-semibold text-red-600 mb-4">🚨 활성 알람 ({alarms.length}개)</h4>
          <div className="space-y-3">
            {alarms.map((alarm, index) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{alarm}</p>
                    <p className="text-xs text-red-600 mt-1">
                      {new Date().toLocaleString('ko-KR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-green-400 mb-2">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-slate-500">활성 알람이 없습니다.</p>
          <p className="text-sm text-slate-400">모든 성능 지표가 정상 범위입니다.</p>
        </div>
      )}

      {/* 알람 설정 정보 */}
      <div>
        <h4 className="font-semibold text-slate-900 mb-4">알람 설정</h4>
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-slate-700 mb-2">임계치</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>CPU:</span>
                  <span className="font-medium">{device.alarmSettings.cpuThreshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span>메모리:</span>
                  <span className="font-medium">{device.alarmSettings.memoryThreshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span>디스크:</span>
                  <span className="font-medium">{device.alarmSettings.diskThreshold}%</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-slate-700 mb-2">알람 상태</h5>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                device.alarmSettings.enabled 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {device.alarmSettings.enabled ? '활성화됨' : '비활성화됨'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-lg flex items-center justify-center">
                  <span className="text-white font-medium text-lg">🖥️</span>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{device.name}</h2>
                  <p className="text-sm text-slate-600">{device.location} • {device.ipAddress}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="px-6 border-b border-slate-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'overview'
                    ? 'border-[#0066CC] text-[#0066CC]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                개요
              </button>
              <button
                onClick={() => setActiveTab('performance')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'performance'
                    ? 'border-[#0066CC] text-[#0066CC]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                성능 지표
              </button>
              <button
                onClick={() => setActiveTab('alarms')}
                className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors relative ${
                  activeTab === 'alarms'
                    ? 'border-[#0066CC] text-[#0066CC]'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                알람
                {alarms.length > 0 && (
                  <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {alarms.length}
                  </span>
                )}
              </button>
            </nav>
          </div>

          {/* 탭 내용 */}
          <div className="p-6">
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'performance' && renderPerformanceTab()}
            {activeTab === 'alarms' && renderAlarmsTab()}
          </div>
        </div>
      </div>
    </div>
  );
}