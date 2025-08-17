# Hyundai Auth Project

현대 그룹 브랜딩을 적용한 Google OTP 2단계 인증 시스템입니다.

## 🚀 Features

- **Modern UI Design**: 21st.dev 스타일의 현대적인 디자인
- **Google OTP Authentication**: 구글 인증앱을 이용한 2단계 인증
- **Responsive Design**: 모바일 친화적인 반응형 디자인
- **TypeScript**: 타입 안전성을 위한 TypeScript 적용
- **Component Architecture**: 재사용 가능한 컴포넌트 구조

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.6
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Authentication**: otplib, qrcode
- **Deployment**: GitHub Pages

## 🏗 Development

### Prerequisites

- Node.js 18 이상
- npm 또는 yarn

### Installation

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

개발 서버는 http://localhost:7777 에서 실행됩니다.

### Build

```bash
# 프로덕션 빌드
npm run build

# 정적 사이트 빌드 (GitHub Pages용)
npm run build:static
```

## 📦 Deployment

### GitHub Pages 자동 배포

1. GitHub 저장소에 코드를 푸시합니다
2. Settings > Pages > Source를 "GitHub Actions"로 설정합니다
3. main 브랜치에 푸시하면 자동으로 배포됩니다

### Manual Deployment

```bash
# 정적 사이트 빌드
npm run build

# out 폴더의 내용을 웹 서버에 업로드
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # 로그인 페이지
│   ├── register/          # 회원가입 페이지
│   ├── forgot-password/   # 비밀번호 찾기
│   ├── setup-otp/         # OTP 설정
│   └── success/           # 성공 페이지
├── components/
│   ├── auth/              # 인증 관련 컴포넌트
│   ├── ui/                # 공통 UI 컴포넌트
│   └── layout/            # 레이아웃 컴포넌트
├── types/                 # TypeScript 타입 정의
└── utils/                 # 유틸리티 함수
```

## 🔐 Authentication Flow

1. **이메일/비밀번호 입력**: 1차 인증
2. **Google OTP 설정**: QR 코드 스캔으로 Google Authenticator 설정
3. **OTP 코드 입력**: 6자리 OTP 코드로 2차 인증
4. **로그인 완료**: 대시보드로 이동

## 🎨 Design System

- **Primary Colors**: Hyundai Blue (#003876, #0066CC)
- **Typography**: System fonts with Korean support
- **Layout**: Modern full-screen and card-based layouts
- **Icons**: Heroicons for consistent iconography

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

© 2024 Hyundai AutoEver. All rights reserved.

---

**Demo**: [GitHub Pages URL will be available after deployment]