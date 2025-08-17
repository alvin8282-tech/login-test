export interface User {
  email: string;
  password: string;
  fullName: string;
  department: string;
  employeeId: string;
  otpSecret?: string;
  createdAt: string;
}

const STORAGE_KEY = 'hyundai_users';

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }
};

export const getUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const findUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find(user => user.email === email) || null;
};

export const updateUserOtpSecret = (email: string, otpSecret: string): void => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    users[userIndex].otpSecret = otpSecret;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }
};