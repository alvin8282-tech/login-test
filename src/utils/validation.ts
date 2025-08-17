export interface PasswordStrength {
  isValid: boolean;
  score: number;
  feedback: string[];
}

export const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  // 길이 검사 (최소 8자)
  if (password.length < 8) {
    feedback.push('비밀번호는 최소 8자 이상이어야 합니다.');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }

  // 대문자 포함 검사
  if (!/[A-Z]/.test(password)) {
    feedback.push('대문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 소문자 포함 검사
  if (!/[a-z]/.test(password)) {
    feedback.push('소문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 숫자 포함 검사
  if (!/\d/.test(password)) {
    feedback.push('숫자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 특수문자 포함 검사
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('특수문자를 포함해야 합니다.');
  } else {
    score += 1;
  }

  // 연속된 문자 검사
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('동일한 문자를 3번 이상 연속으로 사용할 수 없습니다.');
    score -= 1;
  }

  const isValid = feedback.length === 0 && score >= 4;

  return {
    isValid,
    score: Math.max(0, score),
    feedback
  };
};

export const getPasswordStrengthText = (score: number): { text: string; color: string } => {
  if (score >= 5) {
    return { text: '매우 강함', color: 'text-green-600' };
  } else if (score >= 4) {
    return { text: '강함', color: 'text-blue-600' };
  } else if (score >= 3) {
    return { text: '보통', color: 'text-yellow-600' };
  } else {
    return { text: '약함', color: 'text-red-600' };
  }
};