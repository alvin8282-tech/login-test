export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  department: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  lastLogin: string;
  createdAt: string;
  otpSecret?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  totalSessions: number;
}

// 로컬 스토리지 키
const USERS_KEY = 'hyundai_users';
const DASHBOARD_KEY = 'hyundai_dashboard';

// 더미 사용자 데이터
const dummyUsers: User[] = [
  {
    id: '1',
    email: 'admin@hyundai-autoever.com',
    password: 'admin123',
    fullName: '관리자',
    department: 'IT부',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-08-16T10:30:00Z',
    createdAt: '2024-01-01T09:00:00Z',
    otpSecret: 'JBSWY3DPEHPK3PXP'
  },
  {
    id: '2',
    email: 'user1@hyundai-autoever.com',
    password: 'user123',
    fullName: '김철수',
    department: '보안팀',
    role: 'user',
    status: 'active',
    lastLogin: '2024-08-16T09:15:00Z',
    createdAt: '2024-02-15T14:20:00Z',
    otpSecret: 'JBSWY3DPEHPK3PXQ'
  },
  {
    id: '3',
    email: 'user2@hyundai-autoever.com',
    password: 'user123',
    fullName: '이영희',
    department: '운영팀',
    role: 'user',
    status: 'active',
    lastLogin: '2024-08-15T16:45:00Z',
    createdAt: '2024-03-10T11:30:00Z',
    otpSecret: 'JBSWY3DPEHPK3PXR'
  },
  {
    id: '4',
    email: 'guest@hyundai-autoever.com',
    password: 'guest123',
    fullName: '박민수',
    department: '외부업체',
    role: 'guest',
    status: 'pending',
    lastLogin: '2024-08-14T13:20:00Z',
    createdAt: '2024-08-14T13:00:00Z'
  },
  {
    id: '5',
    email: 'inactive@hyundai-autoever.com',
    password: 'inactive123',
    fullName: '정지훈',
    department: '개발팀',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-07-20T10:00:00Z',
    createdAt: '2024-04-01T09:00:00Z',
    otpSecret: 'JBSWY3DPEHPK3PXS'
  }
];

// 초기 데이터 설정
export function initializeDatabase(): void {
  if (typeof window === 'undefined') return;
  
  // 사용자 데이터 초기화
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(dummyUsers));
  }
  
  // 대시보드 통계 초기화
  const existingStats = localStorage.getItem(DASHBOARD_KEY);
  if (!existingStats) {
    const stats: DashboardStats = {
      totalUsers: dummyUsers.length,
      activeUsers: dummyUsers.filter(u => u.status === 'active').length,
      pendingUsers: dummyUsers.filter(u => u.status === 'pending').length,
      totalSessions: 142
    };
    localStorage.setItem(DASHBOARD_KEY, JSON.stringify(stats));
  }
}

// 모든 사용자 조회
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') return [];
  
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

// 사용자 ID로 조회
export function getUserById(id: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.id === id) || null;
}

// 이메일로 사용자 조회
export function getUserByEmail(email: string): User | null {
  const users = getAllUsers();
  return users.find(user => user.email === email) || null;
}

// 사용자 추가
export function addUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const users = getAllUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  updateDashboardStats();
  
  return newUser;
}

// 사용자 수정
export function updateUser(id: string, userData: Partial<User>): User | null {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) return null;
  
  users[userIndex] = { ...users[userIndex], ...userData };
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  updateDashboardStats();
  
  return users[userIndex];
}

// 사용자 삭제
export function deleteUser(id: string): boolean {
  const users = getAllUsers();
  const filteredUsers = users.filter(user => user.id !== id);
  
  if (filteredUsers.length === users.length) return false;
  
  localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
  updateDashboardStats();
  
  return true;
}

// 사용자 마지막 로그인 시간 업데이트
export function updateLastLogin(email: string): void {
  const users = getAllUsers();
  const userIndex = users.findIndex(user => user.email === email);
  
  if (userIndex !== -1) {
    users[userIndex].lastLogin = new Date().toISOString();
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
}

// 대시보드 통계 조회
export function getDashboardStats(): DashboardStats {
  if (typeof window === 'undefined') {
    return { totalUsers: 0, activeUsers: 0, pendingUsers: 0, totalSessions: 0 };
  }
  
  const stats = localStorage.getItem(DASHBOARD_KEY);
  return stats ? JSON.parse(stats) : { totalUsers: 0, activeUsers: 0, pendingUsers: 0, totalSessions: 0 };
}

// 대시보드 통계 업데이트
function updateDashboardStats(): void {
  const users = getAllUsers();
  const stats: DashboardStats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    pendingUsers: users.filter(u => u.status === 'pending').length,
    totalSessions: getDashboardStats().totalSessions
  };
  
  localStorage.setItem(DASHBOARD_KEY, JSON.stringify(stats));
}

// 역할별 한글 표시
export function getRoleDisplayName(role: User['role']): string {
  const roleNames = {
    admin: '관리자',
    user: '일반사용자',
    guest: '게스트'
  };
  return roleNames[role];
}

// 상태별 한글 표시
export function getStatusDisplayName(status: User['status']): string {
  const statusNames = {
    active: '활성',
    inactive: '비활성',
    pending: '대기'
  };
  return statusNames[status];
}

// 상태별 색상 클래스
export function getStatusColorClass(status: User['status']): string {
  const colorClasses = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800'
  };
  return colorClasses[status];
}