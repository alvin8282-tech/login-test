'use client';

import React, { useState, useEffect } from 'react';
import { Device, addDevice, updateDevice, getCountries } from '@/utils/deviceMonitoring';
import Button from './Button';
import Input from './Input';

interface DeviceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  device?: Device | null;
  mode: 'add' | 'edit';
}

export default function DeviceFormModal({ isOpen, onClose, onSave, device, mode }: DeviceFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    ipAddress: '',
    networkType: '사용자망' as '사용자망' | '업무망',
    country: '',
    status: 'online' as 'online' | 'offline',
    alarmSettings: {
      cpuThreshold: 80,
      memoryThreshold: 85,
      diskThreshold: 90,
      enabled: true
    }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // 국가별 지역 매핑
  const countryRegions: { [country: string]: string[] } = {
    '미국': ['뉴욕', '로스앤젤레스', '시카고', '휴스턴'],
    '일본': ['도쿄', '오사카', '나고야', '요코하마'],
    '중국': ['베이징', '상하이', '광저우', '선전'],
    '독일': ['베를린', '뮌헨', '함부르크', '쾰른'],
    '영국': ['런던', '맨체스터', '버밍엄', '리버풀'],
    '프랑스': ['파리', '마르세유', '리옹', '툴루즈'],
    '브라질': ['상파울루', '리우데자네이루', '브라질리아', '살바도르'],
    '인도': ['뭄바이', '델리', '방갈로르', '첸나이']
  };

  useEffect(() => {
    if (device && mode === 'edit') {
      setFormData({
        name: device.name,
        location: device.location,
        ipAddress: device.ipAddress,
        networkType: device.networkType,
        country: device.country,
        status: device.status,
        alarmSettings: device.alarmSettings
      });
    } else {
      setFormData({
        name: '',
        location: '',
        ipAddress: '',
        networkType: '사용자망',
        country: '',
        status: 'online',
        alarmSettings: {
          cpuThreshold: 80,
          memoryThreshold: 85,
          diskThreshold: 90,
          enabled: true
        }
      });
    }
    setErrors({});
  }, [device, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('alarmSettings.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        alarmSettings: {
          ...prev.alarmSettings,
          [field]: type === 'number' ? parseInt(value) : value === 'true'
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // 장비명 검증
    if (!formData.name.trim()) {
      newErrors.name = '장비명을 입력해주세요.';
    } else if (!formData.name.includes('IP FLOW_')) {
      newErrors.name = '장비명은 "IP FLOW_국가명_(망종류)" 형식이어야 합니다.';
    }

    // 국가 검증
    if (!formData.country) {
      newErrors.country = '국가를 선택해주세요.';
    }

    // 지역 검증
    if (!formData.location.trim()) {
      newErrors.location = '위치를 입력해주세요.';
    }

    // IP 주소 검증
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!formData.ipAddress.trim()) {
      newErrors.ipAddress = 'IP 주소를 입력해주세요.';
    } else if (!ipRegex.test(formData.ipAddress)) {
      newErrors.ipAddress = '올바른 IP 주소 형식을 입력해주세요. (예: 192.168.1.1)';
    } else {
      // IP 범위 검증
      const parts = formData.ipAddress.split('.');
      if (parts.some(part => parseInt(part) > 255)) {
        newErrors.ipAddress = 'IP 주소의 각 부분은 0-255 범위여야 합니다.';
      }
    }

    // 임계치 검증
    if (formData.alarmSettings.cpuThreshold < 1 || formData.alarmSettings.cpuThreshold > 100) {
      newErrors.cpuThreshold = 'CPU 임계치는 1-100 범위여야 합니다.';
    }
    if (formData.alarmSettings.memoryThreshold < 1 || formData.alarmSettings.memoryThreshold > 100) {
      newErrors.memoryThreshold = '메모리 임계치는 1-100 범위여야 합니다.';
    }
    if (formData.alarmSettings.diskThreshold < 1 || formData.alarmSettings.diskThreshold > 100) {
      newErrors.diskThreshold = '디스크 임계치는 1-100 범위여야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // 시뮬레이션

      if (mode === 'add') {
        // 새 장비 추가
        addDevice({
          name: formData.name,
          status: formData.status,
          location: formData.location,
          ipAddress: formData.ipAddress,
          networkType: formData.networkType,
          country: formData.country,
          performance: {
            cpu: 0,
            memory: 0,
            disk: 0,
            network: { inbound: 0, outbound: 0 },
            uptime: 0
          },
          alarmSettings: formData.alarmSettings
        });
      } else if (device) {
        // 기존 장비 수정
        updateDevice(device.id, {
          name: formData.name,
          location: formData.location,
          ipAddress: formData.ipAddress,
          networkType: formData.networkType,
          country: formData.country,
          status: formData.status,
          alarmSettings: formData.alarmSettings
        });
      }
      
      onSave();
      onClose();
    } catch (error) {
      console.error('장비 저장 실패:', error);
      setErrors({ submit: '저장 중 오류가 발생했습니다.' });
    } finally {
      setIsLoading(false);
    }
  };

  const generateDeviceName = () => {
    if (formData.country && formData.networkType) {
      const countryCode = {
        '미국': 'USA',
        '일본': 'JAPAN',
        '중국': 'CHINA',
        '독일': 'GERMANY',
        '영국': 'UK',
        '프랑스': 'FRANCE',
        '브라질': 'BRAZIL',
        '인도': 'INDIA'
      }[formData.country] || formData.country.toUpperCase();

      const deviceName = `IP FLOW_${countryCode}_(${formData.networkType})`;
      setFormData(prev => ({ ...prev, name: deviceName }));
    }
  };

  const generateSampleIP = () => {
    const ranges = ['192.168', '10.0', '172.16'];
    const range = ranges[Math.floor(Math.random() * ranges.length)];
    const third = Math.floor(Math.random() * 255);
    const fourth = Math.floor(Math.random() * 254) + 1;
    const sampleIP = `${range}.${third}.${fourth}`;
    setFormData(prev => ({ ...prev, ipAddress: sampleIP }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                {mode === 'add' ? '새 장비 추가' : '장비 정보 수정'}
              </h2>
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

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">국가 *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    >
                      <option value="">국가 선택</option>
                      {getCountries().map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                    {errors.country && <p className="text-red-600 text-sm mt-1">{errors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">망 종류 *</label>
                    <select
                      name="networkType"
                      value={formData.networkType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    >
                      <option value="사용자망">사용자망</option>
                      <option value="업무망">업무망</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">장비명 *</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="IP FLOW_USA_(사용자망)"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={generateDeviceName}
                        className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        title="자동 생성"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">위치 *</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="예: 미국 뉴욕"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    />
                    {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">IP 주소 *</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="ipAddress"
                        value={formData.ipAddress}
                        onChange={handleInputChange}
                        placeholder="192.168.1.100"
                        className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={generateSampleIP}
                        className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        title="샘플 IP 생성"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>
                    {errors.ipAddress && <p className="text-red-600 text-sm mt-1">{errors.ipAddress}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-2">초기 상태</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    >
                      <option value="online">온라인</option>
                      <option value="offline">오프라인</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 알람 설정 */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">알람 설정</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">CPU 임계치 (%)</label>
                    <input
                      type="number"
                      name="alarmSettings.cpuThreshold"
                      value={formData.alarmSettings.cpuThreshold}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    />
                    {errors.cpuThreshold && <p className="text-red-600 text-sm mt-1">{errors.cpuThreshold}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">메모리 임계치 (%)</label>
                    <input
                      type="number"
                      name="alarmSettings.memoryThreshold"
                      value={formData.alarmSettings.memoryThreshold}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    />
                    {errors.memoryThreshold && <p className="text-red-600 text-sm mt-1">{errors.memoryThreshold}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">디스크 임계치 (%)</label>
                    <input
                      type="number"
                      name="alarmSettings.diskThreshold"
                      value={formData.alarmSettings.diskThreshold}
                      onChange={handleInputChange}
                      min="1"
                      max="100"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0066CC] focus:border-transparent"
                    />
                    {errors.diskThreshold && <p className="text-red-600 text-sm mt-1">{errors.diskThreshold}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="alarmSettings.enabled"
                      checked={formData.alarmSettings.enabled}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        alarmSettings: {
                          ...prev.alarmSettings,
                          enabled: e.target.checked
                        }
                      }))}
                      className="h-4 w-4 text-[#0066CC] focus:ring-[#0066CC] border-slate-300 rounded"
                    />
                    <span className="ml-2 text-sm text-slate-700">알람 활성화</span>
                  </label>
                </div>
              </div>

              {errors.submit && (
                <div className="text-red-600 text-sm">{errors.submit}</div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
              >
                {mode === 'add' ? '장비 추가' : '수정 완료'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}