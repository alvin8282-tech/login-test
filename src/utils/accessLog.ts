export interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  email: string;
  loginTime: string;
  logoutTime?: string;
  ipAddress: string;
  userAgent: string;
  browserInfo: string;
  status: 'success' | 'failed' | 'active' | 'logged_out';
  sessionDuration?: number; // in seconds
  loginMethod: 'password' | 'otp';
  failureReason?: string;
}

export interface AccessStats {
  totalSessions: number;
  activeSessions: number;
  failedAttempts: number;
  avgSessionDuration: number;
  uniqueUsers: number;
}

// 로컬 스토리지 키
const ACCESS_LOGS_KEY = 'hyundai_access_logs';
const ACTIVE_SESSIONS_KEY = 'hyundai_active_sessions';

// 브라우저 정보 추출 함수
export function getBrowserInfo(): string {
  if (typeof window === 'undefined') return 'Unknown';
  
  const userAgent = navigator.userAgent;
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'Unknown';
}

// IP 주소 시뮬레이션 (실제로는 서버에서 가져와야 함)
export function getClientIP(): string {
  // 실제 환경에서는 서버에서 클라이언트 IP를 제공받아야 함
  // 여기서는 시뮬레이션을 위해 랜덤 IP 생성
  const ips = [
    '192.168.1.100',
    '10.0.0.50',
    '172.16.0.25',
    '203.234.112.45',
    '121.156.78.90'
  ];
  return ips[Math.floor(Math.random() * ips.length)];
}

// 더미 로그 데이터 생성
function generateDummyLogs(): AccessLog[] {
  const now = new Date();
  const logs: AccessLog[] = [];
  
  const users = [
    { id: '1', name: '관리자', email: 'admin@hyundai-autoever.com' },
    { id: '2', name: '김철수', email: 'user1@hyundai-autoever.com' },
    { id: '3', name: '이영희', email: 'user2@hyundai-autoever.com' },
    { id: '4', name: '박민수', email: 'guest@hyundai-autoever.com' },
    { id: '5', name: '정지훈', email: 'inactive@hyundai-autoever.com' }
  ];

  const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
  const ips = ['192.168.1.100', '10.0.0.50', '172.16.0.25', '203.234.112.45'];

  // 최근 30일간의 로그 생성
  for (let i = 0; i < 150; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const loginTime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const isSuccess = Math.random() > 0.1; // 90% 성공률
    const sessionDuration = isSuccess ? Math.floor(Math.random() * 7200) + 300 : undefined; // 5분~2시간
    const logoutTime = isSuccess && Math.random() > 0.2 ? 
      new Date(loginTime.getTime() + (sessionDuration! * 1000)) : undefined;

    logs.push({
      id: `log_${Date.now()}_${i}`,
      userId: user.id,
      userName: user.name,
      email: user.email,
      loginTime: loginTime.toISOString(),
      logoutTime: logoutTime?.toISOString(),
      ipAddress: ips[Math.floor(Math.random() * ips.length)],
      userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36`,
      browserInfo: browsers[Math.floor(Math.random() * browsers.length)],
      status: isSuccess ? (logoutTime ? 'logged_out' : 'active') : 'failed',
      sessionDuration: logoutTime ? sessionDuration : undefined,
      loginMethod: isSuccess ? (Math.random() > 0.5 ? 'otp' : 'password') : 'password',
      failureReason: !isSuccess ? ['잘못된 비밀번호', '존재하지 않는 계정', 'OTP 오류'][Math.floor(Math.random() * 3)] : undefined
    });
  }

  return logs.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
}

// 데이터베이스 초기화
export function initializeAccessLogs(): void {
  if (typeof window === 'undefined') return;
  
  const existingLogs = localStorage.getItem(ACCESS_LOGS_KEY);
  if (!existingLogs) {
    const dummyLogs = generateDummyLogs();
    localStorage.setItem(ACCESS_LOGS_KEY, JSON.stringify(dummyLogs));
  }
}

// 모든 접속 로그 조회
export function getAllAccessLogs(): AccessLog[] {
  if (typeof window === 'undefined') return [];
  
  const logs = localStorage.getItem(ACCESS_LOGS_KEY);
  return logs ? JSON.parse(logs) : [];
}

// 로그인 기록 추가
export function addLoginLog(
  userId: string, 
  userName: string, 
  email: string, 
  success: boolean = true,
  failureReason?: string
): AccessLog {
  const log: AccessLog = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userId,
    userName,
    email,
    loginTime: new Date().toISOString(),
    ipAddress: getClientIP(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'Unknown',
    browserInfo: getBrowserInfo(),
    status: success ? 'active' : 'failed',
    loginMethod: success ? 'otp' : 'password',
    failureReason: failureReason
  };

  const logs = getAllAccessLogs();
  logs.unshift(log); // 최신 로그를 맨 앞에 추가
  localStorage.setItem(ACCESS_LOGS_KEY, JSON.stringify(logs));

  // 활성 세션에 추가 (성공한 경우만)
  if (success) {
    addActiveSession(log);
  }

  return log;
}

// 로그아웃 기록 업데이트
export function updateLogoutLog(userId: string): void {
  const logs = getAllAccessLogs();
  const activeLogIndex = logs.findIndex(log => 
    log.userId === userId && log.status === 'active'
  );

  if (activeLogIndex !== -1) {
    const loginTime = new Date(logs[activeLogIndex].loginTime);
    const logoutTime = new Date();
    const sessionDuration = Math.floor((logoutTime.getTime() - loginTime.getTime()) / 1000);

    logs[activeLogIndex] = {
      ...logs[activeLogIndex],
      logoutTime: logoutTime.toISOString(),
      status: 'logged_out',
      sessionDuration
    };

    localStorage.setItem(ACCESS_LOGS_KEY, JSON.stringify(logs));
    removeActiveSession(userId);
  }
}

// 활성 세션 관리
export function addActiveSession(log: AccessLog): void {
  if (typeof window === 'undefined') return;
  
  const activeSessions = getActiveSessions();
  // 기존 활성 세션이 있으면 제거
  const filteredSessions = activeSessions.filter(session => session.userId !== log.userId);
  filteredSessions.push(log);
  
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(filteredSessions));
}

export function removeActiveSession(userId: string): void {
  if (typeof window === 'undefined') return;
  
  const activeSessions = getActiveSessions();
  const filteredSessions = activeSessions.filter(session => session.userId !== userId);
  localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(filteredSessions));
}

export function getActiveSessions(): AccessLog[] {
  if (typeof window === 'undefined') return [];
  
  const sessions = localStorage.getItem(ACTIVE_SESSIONS_KEY);
  return sessions ? JSON.parse(sessions) : [];
}

// 날짜 범위로 로그 필터링
export function getLogsByDateRange(startDate: string, endDate: string): AccessLog[] {
  const logs = getAllAccessLogs();
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // 종료일 마지막 시간까지 포함

  return logs.filter(log => {
    const logDate = new Date(log.loginTime);
    return logDate >= start && logDate <= end;
  });
}

// 사용자별 로그 필터링
export function getLogsByUser(userId: string): AccessLog[] {
  const logs = getAllAccessLogs();
  return logs.filter(log => log.userId === userId);
}

// 접속 통계 계산
export function calculateAccessStats(logs: AccessLog[] = getAllAccessLogs()): AccessStats {
  const totalSessions = logs.length;
  const activeSessions = logs.filter(log => log.status === 'active').length;
  const failedAttempts = logs.filter(log => log.status === 'failed').length;
  
  const successfulSessions = logs.filter(log => log.sessionDuration !== undefined);
  const avgSessionDuration = successfulSessions.length > 0 
    ? successfulSessions.reduce((sum, log) => sum + (log.sessionDuration || 0), 0) / successfulSessions.length
    : 0;

  const uniqueUsers = new Set(logs.map(log => log.userId)).size;

  return {
    totalSessions,
    activeSessions,
    failedAttempts,
    avgSessionDuration: Math.round(avgSessionDuration),
    uniqueUsers
  };
}

// 로그 내보내기 (CSV 형식)
export function exportLogsToCSV(logs: AccessLog[] = getAllAccessLogs()): string {
  const headers = [
    '사용자명',
    '이메일',
    '접속일시',
    '로그아웃일시',
    '접속 IP',
    '브라우저',
    '상태',
    '세션 시간(분)',
    '로그인 방법',
    '실패 사유'
  ];

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    return Math.round(seconds / 60).toString();
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString('ko-KR');
  };

  const csvContent = [
    headers.join(','),
    ...logs.map(log => [
      log.userName,
      log.email,
      formatDateTime(log.loginTime),
      log.logoutTime ? formatDateTime(log.logoutTime) : '',
      log.ipAddress,
      log.browserInfo,
      log.status === 'success' || log.status === 'active' || log.status === 'logged_out' ? '성공' : '실패',
      formatDuration(log.sessionDuration),
      log.loginMethod === 'otp' ? 'OTP' : '비밀번호',
      log.failureReason || ''
    ].map(field => `"${field}"`).join(','))
  ].join('\n');

  return csvContent;
}

// CSV 파일 다운로드
export function downloadCSV(logs: AccessLog[] = getAllAccessLogs(), filename: string = 'access_logs'): void {
  const csvContent = exportLogsToCSV(logs);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM 추가
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// 시간대별 접속 통계
export function getHourlyStats(logs: AccessLog[] = getAllAccessLogs()): { hour: number; count: number }[] {
  const hourlyCount: { [hour: number]: number } = {};
  
  for (let i = 0; i < 24; i++) {
    hourlyCount[i] = 0;
  }

  logs.forEach(log => {
    const hour = new Date(log.loginTime).getHours();
    hourlyCount[hour]++;
  });

  return Object.entries(hourlyCount).map(([hour, count]) => ({
    hour: parseInt(hour),
    count
  }));
}

// 일별 접속 통계 (최근 30일)
export function getDailyStats(logs: AccessLog[] = getAllAccessLogs()): { date: string; count: number }[] {
  const dailyCount: { [date: string]: number } = {};
  const now = new Date();
  
  // 최근 30일 초기화
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];
    dailyCount[dateKey] = 0;
  }

  logs.forEach(log => {
    const dateKey = log.loginTime.split('T')[0];
    if (dailyCount.hasOwnProperty(dateKey)) {
      dailyCount[dateKey]++;
    }
  });

  return Object.entries(dailyCount).map(([date, count]) => ({
    date,
    count
  }));
}