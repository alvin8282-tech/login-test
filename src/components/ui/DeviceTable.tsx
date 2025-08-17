'use client';

import React, { useState } from 'react';
import { Device, getStatusColor, getPerformanceColor, formatUptime, formatLastSeen } from '@/utils/deviceMonitoring';

interface DeviceTableProps {
  devices: Device[];
  onDeviceClick: (device: Device) => void;
  onEditDevice: (device: Device) => void;
  onDeleteDevice: (deviceId: string) => void;
}

export default function DeviceTable({ devices, onDeviceClick, onEditDevice, onDeleteDevice }: DeviceTableProps) {
  const [sortField, setSortField] = useState<keyof Device>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 정렬 함수
  const handleSort = (field: keyof Device) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 정렬된 장비 목록
  const sortedDevices = [...devices].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      const comparison = aValue.localeCompare(bValue);
      return sortDirection === 'asc' ? comparison : -comparison;
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevices = sortedDevices.slice(startIndex, endIndex);

  const getSortIcon = (field: keyof Device) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
  };

  const getPerformanceIndicator = (value: number, label: string, threshold: number = 80) => {
    const colorClass = getPerformanceColor(value, threshold);
    return (
      <div className="flex items-center space-x-2">
        <div className="w-12 bg-slate-200 rounded-full h-2 relative">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              value >= threshold ? 'bg-red-500' : 
              value >= threshold * 0.7 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(value, 100)}%` }}
          ></div>
        </div>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${colorClass}`}>
          {value}%
        </span>
      </div>
    );
  };

  const getStatusIndicator = (status: 'online' | 'offline') => {
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`}></div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
          {status === 'online' ? '온라인' : '오프라인'}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* 테이블 헤더 */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">장비 목록</h3>
            <p className="text-sm text-slate-600 mt-1">총 {devices.length}개의 장비</p>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>장비명</span>
                  {getSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1">
                  <span>상태</span>
                  {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('location')}
              >
                <div className="flex items-center space-x-1">
                  <span>위치</span>
                  {getSortIcon('location')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('ipAddress')}
              >
                <div className="flex items-center space-x-1">
                  <span>IP주소</span>
                  {getSortIcon('ipAddress')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                성능 지표
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                onClick={() => handleSort('lastSeen')}
              >
                <div className="flex items-center space-x-1">
                  <span>마지막 접속</span>
                  {getSortIcon('lastSeen')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {currentDevices.map((device) => (
              <tr 
                key={device.id} 
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => onDeviceClick(device)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-[#003876] to-[#0066CC] rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-xs">
                        🖥️
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">{device.name}</div>
                      <div className="text-xs text-slate-500 flex items-center space-x-2">
                        <span>{device.networkType}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{device.country}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusIndicator(device.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {device.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">
                  {device.ipAddress}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 w-8">CPU</span>
                      {getPerformanceIndicator(device.performance.cpu, 'CPU', device.alarmSettings.cpuThreshold)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 w-8">MEM</span>
                      {getPerformanceIndicator(device.performance.memory, 'Memory', device.alarmSettings.memoryThreshold)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500 w-8">DISK</span>
                      {getPerformanceIndicator(device.performance.disk, 'Disk', device.alarmSettings.diskThreshold)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{formatLastSeen(device.lastSeen)}</div>
                  {device.status === 'online' && (
                    <div className="text-xs text-slate-500">
                      업타임: {formatUptime(device.performance.uptime)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeviceClick(device);
                      }}
                      className="text-[#0066CC] hover:text-[#003876] transition-colors"
                      title="상세 보기"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDevice(device);
                      }}
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                      title="수정"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`${device.name} 장비를 정말 삭제하시겠습니까?`)) {
                          onDeleteDevice(device.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="삭제"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-700">
              {startIndex + 1}-{Math.min(endIndex, sortedDevices.length)} / {sortedDevices.length}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                이전
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + Math.max(1, currentPage - 2);
                if (pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 border rounded-md text-sm ${
                      currentPage === pageNum
                        ? 'bg-[#0066CC] text-white border-[#0066CC]'
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}