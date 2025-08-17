# Hyundai Auth Project - Claude Reference

## 프로젝트 개요
- Next.js 15.4.6 기반 인증 시스템
- TypeScript + React 19
- OTP 인증 기능 포함

## 개발 서버 실행
```bash
npm run dev
```
- 포트: 7777
- URL: http://localhost:7777
- Turbopack 사용
- 호스트: 0.0.0.0 (외부 접근 가능)

## 주요 스크립트
- `npm run dev`: 개발 서버 시작
- `npm run build`: 프로덕션 빌드
- `npm run start`: 프로덕션 서버 시작
- `npm run lint`: ESLint 실행

## 프로젝트 구조
```
src/
├── app/                 # Next.js App Router
│   ├── login/          # 로그인 페이지
│   ├── register/       # 회원가입 페이지
│   ├── forgot-password/ # 비밀번호 찾기
│   ├── setup-otp/      # OTP 설정
│   └── success/        # 성공 페이지
├── components/
│   ├── layout/         # 레이아웃 컴포넌트
│   └── ui/             # UI 컴포넌트 (Button, Input 등)
└── utils/              # 유틸리티 (OTP, 저장소, 검증)
```

## 주요 의존성
- Next.js 15.4.6
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- otplib (OTP 라이브러리)
- qrcode (QR 코드 생성)

## 문제 해결
- 서버 응답 없음: 초기 컴파일 시간 필요 (약 30초)
- 프로세스 확인: `ps aux | grep node`
- 포트 확인: `ss -tulpn | grep :7777`

## 참고사항
- 외부 접속 시 allowedDevOrigins 경고 발생 (정상)
- Turbopack 사용으로 빠른 개발 환경 제공

## SuperClaude Commands

### Available Commands:
- `/sc` - SuperClaude 명령어 참조 및 도움말
- `/analyze` - 코드 분석 및 품질 검토
- `/build` - 프로젝트 빌드 및 배포
- `/implement` - 기능 구현 및 개발
- `/improve` - 코드 개선 및 최적화
- `/test` - 테스트 작성 및 실행
- `/document` - 문서화 작성
- `/git` - Git 워크플로 지원

### MCP Servers:
- **filesystem-mcp**: 파일 시스템 작업
- **sequential-thinking**: 복잡한 분석 및 추론
- **context7**: 라이브러리 문서 및 패턴
- **playwright**: 브라우저 자동화 및 테스트
- **magic**: UI 컴포넌트 생성