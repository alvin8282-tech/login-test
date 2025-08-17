# GitHub Pages 배포 가이드

## 배포 완료! 🎉

이 프로젝트는 GitHub Pages 배포를 위해 완벽하게 설정되었습니다.

## 🔧 수정된 설정

### 1. Next.js 설정 (next.config.ts)
- `output: 'export'` - 정적 사이트로 빌드
- `distDir: 'docs'` - GitHub Pages가 인식하는 docs 폴더 사용
- `assetPrefix: '/hyundai-auth-project'` - 정적 파일 경로 수정
- `basePath: '/hyundai-auth-project'` - 기본 경로 설정
- `trailingSlash: true` - URL 끝에 슬래시 추가
- `images: { unoptimized: true }` - 이미지 최적화 비활성화

### 2. GitHub Actions 워크플로 (.github/workflows/deploy.yml)
- Node.js 20 사용
- 자동 빌드 및 배포
- 캐시 최적화
- main 브랜치 push 시 자동 실행

### 3. 추가 파일들
- `.nojekyll` - Jekyll 처리 건너뛰기
- `assetPath.ts` - 정적 파일 경로 처리 유틸리티

## 🚀 배포 방법

### 자동 배포 (권장)
1. 코드를 GitHub에 push
2. GitHub Actions가 자동으로 빌드 및 배포 실행
3. 몇 분 후 https://YOUR_USERNAME.github.io/hyundai-auth-project 에서 확인

### 수동 배포
1. `npm run build` - 로컬에서 빌드
2. `docs` 폴더의 내용을 GitHub Pages에 업로드

## ⚙️ GitHub 저장소 설정

1. GitHub 저장소로 이동
2. Settings > Pages
3. Source: "Deploy from a branch" 선택
4. Branch: "main" 선택
5. Folder: "/docs" 선택
6. Save 클릭

## 📁 폴더 구조

```
hyundai-auth-project/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 워크플로
├── docs/                       # 빌드된 정적 파일들 (GitHub Pages 소스)
├── src/                        # 소스 코드
├── .nojekyll                   # Jekyll 비활성화
├── next.config.ts              # Next.js 설정
└── package.json                # 프로젝트 설정
```

## 🎯 주요 특징

- ✅ **완전한 정적 사이트**: 서버 없이 동작
- ✅ **자동 배포**: main 브랜치 push 시 자동 배포
- ✅ **경로 최적화**: GitHub Pages 환경에 맞는 경로 설정
- ✅ **캐시 최적화**: 빌드 시간 단축
- ✅ **모바일 반응형**: 모든 디바이스에서 정상 작동

## 🔍 문제 해결

### 배포 후 CSS/JS가 로드되지 않는 경우
- `assetPrefix`와 `basePath` 설정 확인
- `.nojekyll` 파일이 docs 폴더에 있는지 확인

### 페이지 라우팅이 작동하지 않는 경우
- GitHub Pages는 SPA 라우팅을 지원하지 않음
- 정적 페이지 생성 확인

### 빌드 에러가 발생하는 경우
- `npm run build` 로컬에서 테스트
- 브라우저 전용 API 사용 여부 확인

## 📝 배포 상태 확인

배포 상태는 GitHub 저장소의 Actions 탭에서 확인할 수 있습니다:
- 🟢 녹색: 성공
- 🔴 빨간색: 실패
- 🟡 노란색: 진행 중

## 🌐 접속 URL

배포가 완료되면 다음 URL로 접속 가능합니다:
`https://YOUR_USERNAME.github.io/hyundai-auth-project`

---

## 추가 최적화 가능한 부분

1. **이미지 최적화**: WebP 형식 사용
2. **폰트 최적화**: 로컬 폰트 사용
3. **코드 분할**: Dynamic imports 활용
4. **Service Worker**: 오프라인 지원
5. **Progressive Web App**: PWA 기능 추가