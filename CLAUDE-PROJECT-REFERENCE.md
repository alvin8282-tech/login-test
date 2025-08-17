# 현대오토에버 원격IP차단장비 Manager - 프로젝트 참조 문서

## 📋 프로젝트 개요

### 기본 정보
- **프로젝트명**: 현대오토에버 원격IP차단장비 Manager
- **기술 스택**: Next.js 15.4.6 + React 19 + TypeScript + Tailwind CSS 4
- **인증**: OTP 기반 2단계 인증
- **포트**: 7777
- **브랜드 컬러**: #003876 (진한 파랑), #0066CC (밝은 파랑)

### 주요 특징
- 관리자 대시보드 시스템
- 사용자 관리 및 권한 제어
- 접속 로그 모니터링
- 커스터마이징 가능한 로고 시스템
- 반응형 디자인

## 🏗️ 시스템 아키텍처

### 디렉터리 구조
```
src/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # 메인 랜딩 페이지
│   ├── login/page.tsx           # 로그인 (2단계 인증)
│   ├── register/page.tsx        # 회원가입
│   ├── forgot-password/page.tsx # 비밀번호 찾기
│   ├── setup-otp/page.tsx       # OTP 설정
│   ├── success/page.tsx         # 로그인 성공
│   └── dashboard/               # 관리자 대시보드
│       ├── page.tsx            # 메인 대시보드
│       ├── users/page.tsx      # 사용자 관리
│       ├── logs/page.tsx       # 접속 로그
│       └── settings/page.tsx   # 시스템 설정
├── components/
│   ├── layout/
│   │   ├── AuthLayout.tsx      # 인증 페이지 레이아웃
│   │   └── DashboardLayout.tsx # 대시보드 레이아웃
│   └── ui/
│       ├── Button.tsx          # 버튼 컴포넌트
│       ├── Input.tsx           # 입력 필드
│       ├── PasswordInput.tsx   # 비밀번호 입력
│       ├── UserTable.tsx       # 사용자 목록 테이블
│       ├── UserModal.tsx       # 사용자 추가/수정 모달
│       ├── AccessLogTable.tsx  # 접속 로그 테이블
│       └── ImageUpload.tsx     # 이미지 업로드
└── utils/
    ├── database.ts             # 사용자 데이터베이스
    ├── storage.ts              # 로컬 저장소
    ├── validation.ts           # 입력 검증
    ├── otp.ts                  # OTP 관련 유틸
    └── accessLog.ts            # 접속 로그 관리
```

## 🔐 인증 시스템

### 2단계 인증 플로우
1. **1차 인증**: 이메일 + 비밀번호
2. **2차 인증**: Google OTP (6자리)
3. **성공 시**: 대시보드로 자동 리다이렉트
4. **실패 시**: 접속 로그에 실패 사유 기록

### 기본 계정
```typescript
// 관리자 계정
email: 'admin@hyundai-autoever.com'
password: 'admin123'
OTP Secret: 'JBSWY3DPEHPK3PXP'

// 일반 사용자
email: 'user1@hyundai-autoever.com'
password: 'user123'
OTP Secret: 'JBSWY3DPEHPK3PXQ'
```

## 👥 사용자 관리 시스템

### 사용자 데이터 구조
```typescript
interface User {
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
```

### 주요 기능
- **사용자 목록**: 정렬, 검색, 필터링, 페이지네이션
- **사용자 추가**: 모달 기반 폼
- **사용자 수정**: 기존 정보 수정
- **사용자 삭제**: 확인 후 삭제
- **권한 관리**: 역할 및 상태 변경

## 📊 대시보드 시스템

### 메인 대시보드 (`/dashboard`)
- **통계 카드**: 전체/활성/대기 사용자, 총 세션
- **최근 사용자**: 최근 가입한 5명
- **시스템 상태**: 데이터베이스, 인증 서비스, 보안 모듈, 백업 상태
- **빠른 작업**: 사용자 추가, 보고서 생성, 시스템 설정

### 사이드바 네비게이션
```typescript
const menuItems = [
  { id: 'dashboard', label: '대시보드', href: '/dashboard', icon: '📊' },
  { id: 'users', label: '사용자 관리', href: '/dashboard/users', icon: '👥' },
  { id: 'security', label: '보안 설정', href: '/dashboard/security', icon: '🔒' },
  { id: 'logs', label: '접속 로그', href: '/dashboard/logs', icon: '📋' },
  { id: 'settings', label: '시스템 설정', href: '/dashboard/settings', icon: '⚙️' }
];
```

## 📋 접속 로그 시스템

### 로그 데이터 구조
```typescript
interface AccessLog {
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
  sessionDuration?: number;
  loginMethod: 'password' | 'otp';
  failureReason?: string;
}
```

### 자동 로그 수집
- **로그인 성공**: 세션 시작 기록
- **로그인 실패**: 실패 사유 기록
- **로그아웃**: 세션 종료 및 지속시간 계산
- **세션 추적**: 활성 세션 실시간 관리

### 접속 로그 페이지 (`/dashboard/logs`)
- **통계 카드**: 총 세션, 활성 세션, 실패 시도, 평균 세션 시간, 고유 사용자
- **실시간 접속자**: 현재 로그인 중인 사용자 표시
- **필터링**: 날짜 범위, 사용자별, 상태별
- **정렬**: 모든 컬럼 정렬 가능
- **내보내기**: CSV 형식 다운로드 (UTF-8 BOM)
- **페이지네이션**: 20개씩 표시

## 🎨 커스텀 로고 시스템

### 로고 업로드 기능 (`/dashboard/settings`)
- **지원 형식**: PNG, JPG, GIF (PNG 권장)
- **파일 크기**: 2MB 이하
- **권장 크기**: 32x32px ~ 64x64px
- **업로드 방식**: 드래그 앤 드롭 또는 클릭
- **저장 방식**: LocalStorage (Base64 인코딩)
- **폴백 처리**: 이미지 로드 실패 시 기본 "H" 아이콘

### 로고 적용 위치
- **대시보드 헤더**: 8x8 크기
- **사이드바**: 6x6 크기 (작은 화면)
- **미리보기**: 실시간 확인 가능

## 💾 데이터 저장소

### LocalStorage 키 구조
```typescript
// 사용자 데이터
'hyundai_users': User[]

// 대시보드 통계
'hyundai_dashboard': DashboardStats

// 접속 로그
'hyundai_access_logs': AccessLog[]

// 활성 세션
'hyundai_active_sessions': AccessLog[]

// 커스텀 로고
'hyundai-logo-image': string (Base64)
```

### 더미 데이터
- **5명의 사용자**: 다양한 역할 및 상태
- **150개의 접속 로그**: 최근 30일 데이터
- **통계 데이터**: 실시간 계산 및 업데이트

## 🎯 주요 기능별 페이지

### 1. 메인 랜딩 (`/`)
- 브랜드 로고 및 제목
- 로그인/회원가입 버튼
- 반응형 디자인

### 2. 로그인 (`/login`)
- 2단계 인증 플로우
- OTP QR 코드 표시
- 실패 시 자동 로그 기록

### 3. 대시보드 (`/dashboard`)
- 시스템 현황 대시보드
- 통계 카드 및 차트
- 빠른 작업 버튼

### 4. 사용자 관리 (`/dashboard/users`)
- 사용자 목록 테이블
- 검색, 필터링, 정렬
- 사용자 추가/수정/삭제

### 5. 접속 로그 (`/dashboard/logs`)
- 접속 기록 모니터링
- 실시간 접속자 현황
- 로그 내보내기

### 6. 시스템 설정 (`/dashboard/settings`)
- 로고 업로드 및 관리
- 시스템 정보 표시
- 미리보기 기능

## 🔧 개발 환경

### 실행 명령어
```bash
# 개발 서버 시작
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm run start

# 린트 실행
npm run lint
```

### 환경 설정
- **포트**: 7777
- **호스트**: 0.0.0.0 (외부 접근 가능)
- **Turbopack**: 활성화
- **핫 리로딩**: 지원

## 🎨 디자인 시스템

### 브랜드 컬러
```css
--primary-dark: #003876   /* 진한 파랑 */
--primary-light: #0066CC  /* 밝은 파랑 */
--gradient: linear-gradient(to right, #003876, #0066CC)
```

### 컴포넌트 스타일
- **버튼**: 그라데이션 배경, 호버 효과
- **입력 필드**: 포커스 시 파란색 테두리
- **테이블**: 호버 효과, 정렬 아이콘
- **모달**: 반투명 배경, 애니메이션
- **카드**: 그림자 효과, 둥근 모서리

## 🔒 보안 고려사항

### 인증 보안
- **2단계 인증** 필수
- **OTP 시크릿** 암호화 저장
- **세션 만료** 처리
- **접속 실패** 로그 기록

### 데이터 보안
- **클라이언트 사이드** 저장 (개발 환경)
- **민감 정보** 암호화
- **XSS 방지** 입력 검증
- **CSRF 보호** 토큰 사용

## 📱 반응형 디자인

### 브레이크포인트
- **모바일**: < 640px
- **태블릿**: 640px ~ 1024px
- **데스크톱**: > 1024px

### 적응형 요소
- **사이드바**: 모바일에서 햄버거 메뉴
- **테이블**: 가로 스크롤 지원
- **카드**: 그리드 레이아웃 조정
- **모달**: 화면 크기에 맞는 크기

## 🚀 배포 가이드

### 프로덕션 배포 시 고려사항
1. **데이터베이스**: LocalStorage → 실제 DB 연동
2. **인증**: JWT 토큰 기반 인증
3. **파일 업로드**: 서버 저장소 연동
4. **보안**: HTTPS, 환경 변수 설정
5. **모니터링**: 실제 로그 시스템 연동

### 환경 변수
```env
NEXT_PUBLIC_API_BASE_URL=
DATABASE_URL=
JWT_SECRET=
UPLOAD_PATH=
```

## 📚 추가 개발 가능한 기능

### 단기 목표
- [ ] 실제 데이터베이스 연동
- [ ] JWT 기반 인증 시스템
- [ ] 파일 업로드 서버 구현
- [ ] 이메일 알림 시스템

### 장기 목표
- [ ] 역할 기반 권한 시스템 (RBAC)
- [ ] 실시간 알림 시스템
- [ ] 접속 통계 차트/그래프
- [ ] 백업/복원 기능
- [ ] API 문서화

## 🐛 알려진 이슈 및 해결책

### 현재 제한사항
1. **클라이언트 저장소**: LocalStorage 사용으로 데이터 휘발성
2. **세션 관리**: 브라우저 새로고침 시 세션 유지 필요
3. **파일 업로드**: 클라이언트 저장으로 제한적

### 해결 방안
1. **백엔드 API** 개발 및 연동
2. **세션 스토리지** 개선
3. **서버 파일 저장** 시스템 구축

---

## 📞 참고 정보

### 개발 환경
- **Node.js**: v18+ 권장
- **npm**: v9+ 권장
- **브라우저**: Chrome, Firefox, Safari 최신 버전

### 라이브러리 버전
- **Next.js**: 15.4.6
- **React**: 19.1.0
- **TypeScript**: 5+
- **Tailwind CSS**: 4
- **otplib**: 12.0.1
- **qrcode**: 1.5.4

---

*이 문서는 현대오토에버 원격IP차단장비 Manager 시스템의 전체 구조와 기능을 설명합니다. 추가 개발이나 유지보수 시 이 문서를 참조하여 주세요.*