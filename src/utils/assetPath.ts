/**
 * GitHub Pages 배포를 위한 asset 경로 처리 유틸리티
 * 로컬 개발 시와 배포 시의 경로를 자동으로 처리
 */

const isProd = process.env.NODE_ENV === 'production';
const basePath = '/hyundai-auth-project';

/**
 * 정적 파일 경로를 반환합니다.
 * 로컬 개발 시에는 그대로, 배포 시에는 basePath를 추가합니다.
 */
export function getAssetPath(path: string): string {
  // path가 이미 절대 경로이거나 외부 URL인 경우 그대로 반환
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('//')) {
    return path;
  }
  
  // 슬래시로 시작하지 않는 경우 추가
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return isProd ? `${basePath}${normalizedPath}` : normalizedPath;
}

/**
 * API 경로를 반환합니다.
 * GitHub Pages는 정적 사이트이므로 API는 사용할 수 없지만,
 * 나중에 다른 호스팅 플랫폼 사용 시를 대비
 */
export function getApiPath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return isProd ? `${basePath}/api${normalizedPath}` : `/api${normalizedPath}`;
}

/**
 * 페이지 경로를 반환합니다.
 */
export function getPagePath(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return isProd ? `${basePath}${normalizedPath}` : normalizedPath;
}