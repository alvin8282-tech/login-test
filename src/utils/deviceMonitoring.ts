export interface Device {
  id: string;
  name: string; // IP FLOW_USA_(사용자망) 형식
  status: 'online' | 'offline';
  location: string; // 지리적 위치
  ipAddress: string;
  networkType: '사용자망' | '업무망';
  country: string;
  lastSeen: string;
  createdAt: string;
  updatedAt: string;
  // 성능 지표
  performance: DevicePerformance;
  // 알람 설정
  alarmSettings: AlarmSettings;
}

export interface DevicePerformance {
  cpu: number; // CPU 사용률 (%)
  memory: number; // 메모리 사용률 (%)
  disk: number; // 디스크 사용률 (%)
  network: {
    inbound: number; // 인바운드 트래픽 (Mbps)
    outbound: number; // 아웃바운드 트래픽 (Mbps)
  };
  uptime: number; // 업타임 (초)
  temperature?: number; // 온도 (섭씨)
}

export interface AlarmSettings {
  cpuThreshold: number;
  memoryThreshold: number;
  diskThreshold: number;
  enabled: boolean;
}

export interface DeviceStats {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  criticalDevices: number; // 임계치 초과 장비
  averagePerformance: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface DeviceHistory {
  id: string;
  deviceId: string;
  timestamp: string;
  performance: DevicePerformance;
  status: 'online' | 'offline';
}

// 로컬 스토리지 키
const DEVICES_KEY = 'hyundai_devices';
const DEVICE_HISTORY_KEY = 'hyundai_device_history';

// 국가 및 지역 정보
const COUNTRIES = [
  { code: 'USA', name: '미국', regions: ['뉴욕', '로스앤젤레스', '시카고', '휴스턴'] },
  { code: 'JAPAN', name: '일본', regions: ['도쿄', '오사카', '나고야', '요코하마'] },
  { code: 'CHINA', name: '중국', regions: ['베이징', '상하이', '광저우', '선전'] },
  { code: 'GERMANY', name: '독일', regions: ['베를린', '뮌헨', '함부르크', '쾰른'] },
  { code: 'UK', name: '영국', regions: ['런던', '맨체스터', '버밍엄', '리버풀'] },
  { code: 'FRANCE', name: '프랑스', regions: ['파리', '마르세유', '리옹', '툴루즈'] },
  { code: 'BRAZIL', name: '브라질', regions: ['상파울루', '리우데자네이루', '브라질리아', '살바도르'] },
  { code: 'INDIA', name: '인도', regions: ['뭄바이', '델리', '방갈로르', '첸나이'] }
];

// IP 주소 생성 함수
function generateIPAddress(): string {
  const ranges = [
    '192.168', '10.0', '172.16', '203.234', '121.156', '58.229', '211.45'
  ];
  const range = ranges[Math.floor(Math.random() * ranges.length)];
  const third = Math.floor(Math.random() * 255);
  const fourth = Math.floor(Math.random() * 254) + 1;
  return `${range}.${third}.${fourth}`;
}

// 성능 지표 생성 함수
function generatePerformance(): DevicePerformance {
  const isHealthy = Math.random() > 0.2; // 80% 확률로 정상 상태
  
  return {
    cpu: isHealthy ? Math.floor(Math.random() * 70) + 10 : Math.floor(Math.random() * 30) + 70,
    memory: isHealthy ? Math.floor(Math.random() * 60) + 20 : Math.floor(Math.random() * 20) + 80,
    disk: isHealthy ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 20) + 80,
    network: {
      inbound: Math.floor(Math.random() * 1000) + 100,
      outbound: Math.floor(Math.random() * 800) + 50
    },
    uptime: Math.floor(Math.random() * 30) * 24 * 3600, // 최대 30일
    temperature: Math.floor(Math.random() * 20) + 40 // 40-60도
  };
}

// 더미 장비 데이터 생성
function generateDummyDevices(): Device[] {
  const devices: Device[] = [];
  let deviceCount = 0;

  COUNTRIES.forEach(country => {
    const deviceCountPerCountry = Math.floor(Math.random() * 3) + 2; // 2-4개 장비
    
    for (let i = 0; i < deviceCountPerCountry; i++) {
      const networkType = Math.random() > 0.5 ? '사용자망' : '업무망';
      const region = country.regions[Math.floor(Math.random() * country.regions.length)];
      const isOnline = Math.random() > 0.15; // 85% 확률로 온라인
      
      const device: Device = {
        id: `device_${deviceCount++}`,
        name: `IP FLOW_${country.code}_(${networkType})`,
        status: isOnline ? 'online' : 'offline',
        location: `${country.name} ${region}`,
        ipAddress: generateIPAddress(),
        networkType,
        country: country.name,
        lastSeen: new Date().toISOString(),
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        performance: isOnline ? generatePerformance() : {
          cpu: 0, memory: 0, disk: 0,
          network: { inbound: 0, outbound: 0 },
          uptime: 0
        },
        alarmSettings: {
          cpuThreshold: 80,
          memoryThreshold: 85,
          diskThreshold: 90,
          enabled: true
        }
      };
      
      devices.push(device);
    }
  });

  return devices;
}

// 데이터베이스 초기화
export function initializeDeviceMonitoring(): void {
  if (typeof window === 'undefined') return;
  
  const existingDevices = localStorage.getItem(DEVICES_KEY);
  if (!existingDevices) {
    const dummyDevices = generateDummyDevices();
    localStorage.setItem(DEVICES_KEY, JSON.stringify(dummyDevices));
  }
}

// 모든 장비 조회
export function getAllDevices(): Device[] {
  if (typeof window === 'undefined') return [];
  
  const devices = localStorage.getItem(DEVICES_KEY);
  return devices ? JSON.parse(devices) : [];
}

// 장비 ID로 조회
export function getDeviceById(id: string): Device | null {
  const devices = getAllDevices();
  return devices.find(device => device.id === id) || null;
}

// 장비 추가
export function addDevice(deviceData: Omit<Device, 'id' | 'createdAt' | 'updatedAt' | 'lastSeen'>): Device {
  const devices = getAllDevices();
  const newDevice: Device = {
    ...deviceData,
    id: `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSeen: new Date().toISOString()
  };
  
  devices.push(newDevice);
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  
  return newDevice;
}

// 장비 업데이트
export function updateDevice(id: string, deviceData: Partial<Device>): Device | null {
  const devices = getAllDevices();
  const deviceIndex = devices.findIndex(device => device.id === id);
  
  if (deviceIndex === -1) return null;
  
  devices[deviceIndex] = {
    ...devices[deviceIndex],
    ...deviceData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(DEVICES_KEY, JSON.stringify(devices));
  return devices[deviceIndex];
}

// 장비 삭제
export function deleteDevice(id: string): boolean {
  const devices = getAllDevices();
  const filteredDevices = devices.filter(device => device.id !== id);
  
  if (filteredDevices.length === devices.length) return false;
  
  localStorage.setItem(DEVICES_KEY, JSON.stringify(filteredDevices));
  return true;
}

// 장비 상태 실시간 업데이트
export function updateDeviceStatus(): void {
  const devices = getAllDevices();
  const updatedDevices = devices.map(device => {
    // 5% 확률로 상태 변경
    if (Math.random() < 0.05) {
      const newStatus = device.status === 'online' ? 'offline' : 'online';
      return {
        ...device,
        status: newStatus,
        performance: newStatus === 'online' ? generatePerformance() : {
          cpu: 0, memory: 0, disk: 0,
          network: { inbound: 0, outbound: 0 },
          uptime: 0
        },
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    // 온라인 장비의 성능 지표 업데이트
    if (device.status === 'online') {
      const performance = device.performance;
      return {
        ...device,
        performance: {
          ...performance,
          cpu: Math.max(0, Math.min(100, performance.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, performance.memory + (Math.random() - 0.5) * 8)),
          disk: Math.max(0, Math.min(100, performance.disk + (Math.random() - 0.5) * 3)),
          network: {
            inbound: Math.max(0, performance.network.inbound + (Math.random() - 0.5) * 200),
            outbound: Math.max(0, performance.network.outbound + (Math.random() - 0.5) * 150)
          },
          uptime: performance.uptime + 5, // 5초 증가
          temperature: performance.temperature ? Math.max(30, Math.min(80, performance.temperature + (Math.random() - 0.5) * 2)) : undefined
        },
        lastSeen: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    return device;
  });
  
  localStorage.setItem(DEVICES_KEY, JSON.stringify(updatedDevices));
}

// 장비 통계 계산
export function calculateDeviceStats(): DeviceStats {
  const devices = getAllDevices();
  const onlineDevices = devices.filter(d => d.status === 'online');
  const criticalDevices = onlineDevices.filter(d => 
    d.performance.cpu > d.alarmSettings.cpuThreshold ||
    d.performance.memory > d.alarmSettings.memoryThreshold ||
    d.performance.disk > d.alarmSettings.diskThreshold
  );

  const avgPerformance = onlineDevices.length > 0 ? {
    cpu: Math.round(onlineDevices.reduce((sum, d) => sum + d.performance.cpu, 0) / onlineDevices.length),
    memory: Math.round(onlineDevices.reduce((sum, d) => sum + d.performance.memory, 0) / onlineDevices.length),
    disk: Math.round(onlineDevices.reduce((sum, d) => sum + d.performance.disk, 0) / onlineDevices.length)
  } : { cpu: 0, memory: 0, disk: 0 };

  return {
    totalDevices: devices.length,
    onlineDevices: onlineDevices.length,
    offlineDevices: devices.length - onlineDevices.length,
    criticalDevices: criticalDevices.length,
    averagePerformance: avgPerformance
  };
}

// 검색 및 필터링
export function searchDevices(
  searchTerm: string = '',
  statusFilter: 'all' | 'online' | 'offline' = 'all',
  countryFilter: string = '',
  networkTypeFilter: 'all' | '사용자망' | '업무망' = 'all'
): Device[] {
  const devices = getAllDevices();
  
  return devices.filter(device => {
    // 검색어 필터
    const matchesSearch = !searchTerm || 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ipAddress.includes(searchTerm);
    
    // 상태 필터
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    // 국가 필터
    const matchesCountry = !countryFilter || device.country === countryFilter;
    
    // 망 종류 필터
    const matchesNetworkType = networkTypeFilter === 'all' || device.networkType === networkTypeFilter;
    
    return matchesSearch && matchesStatus && matchesCountry && matchesNetworkType;
  });
}

// 성능 지표 색상 가져오기
export function getPerformanceColor(value: number, threshold: number = 80): string {
  if (value >= threshold) return 'text-red-600 bg-red-100';
  if (value >= threshold * 0.7) return 'text-yellow-600 bg-yellow-100';
  return 'text-green-600 bg-green-100';
}

// 상태 배지 색상
export function getStatusColor(status: 'online' | 'offline'): string {
  return status === 'online' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800';
}

// 업타임 포맷
export function formatUptime(seconds: number): string {
  if (seconds === 0) return '0분';
  
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (days > 0) return `${days}일 ${hours}시간`;
  if (hours > 0) return `${hours}시간 ${minutes}분`;
  return `${minutes}분`;
}

// 마지막 접속 시간 포맷
export function formatLastSeen(isoString: string): string {
  const now = new Date();
  const lastSeen = new Date(isoString);
  const diffInSeconds = Math.floor((now.getTime() - lastSeen.getTime()) / 1000);
  
  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  return `${Math.floor(diffInSeconds / 86400)}일 전`;
}

// 국가 목록 가져오기
export function getCountries(): string[] {
  return COUNTRIES.map(country => country.name);
}

// 임계치 알람 체크
export function checkAlarms(device: Device): string[] {
  const alarms: string[] = [];
  
  if (!device.alarmSettings.enabled || device.status === 'offline') {
    return alarms;
  }
  
  if (device.performance.cpu > device.alarmSettings.cpuThreshold) {
    alarms.push(`CPU 사용률 임계치 초과 (${device.performance.cpu}%)`);
  }
  
  if (device.performance.memory > device.alarmSettings.memoryThreshold) {
    alarms.push(`메모리 사용률 임계치 초과 (${device.performance.memory}%)`);
  }
  
  if (device.performance.disk > device.alarmSettings.diskThreshold) {
    alarms.push(`디스크 사용률 임계치 초과 (${device.performance.disk}%)`);
  }
  
  return alarms;
}

// 성능 기록 저장
export function saveDeviceHistory(): void {
  const devices = getAllDevices();
  const history: DeviceHistory[] = JSON.parse(localStorage.getItem(DEVICE_HISTORY_KEY) || '[]');
  const timestamp = new Date().toISOString();
  
  devices.forEach(device => {
    history.push({
      id: `history_${Date.now()}_${device.id}`,
      deviceId: device.id,
      timestamp,
      performance: device.performance,
      status: device.status
    });
  });
  
  // 최근 24시간 데이터만 유지
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const filteredHistory = history.filter(h => h.timestamp > cutoffTime);
  
  localStorage.setItem(DEVICE_HISTORY_KEY, JSON.stringify(filteredHistory));
}

// 장비별 성능 기록 조회
export function getDeviceHistory(deviceId: string, hours: number = 1): DeviceHistory[] {
  if (typeof window === 'undefined') return [];
  
  const history: DeviceHistory[] = JSON.parse(localStorage.getItem(DEVICE_HISTORY_KEY) || '[]');
  const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
  
  return history
    .filter(h => h.deviceId === deviceId && h.timestamp > cutoffTime)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}