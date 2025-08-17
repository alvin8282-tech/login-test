import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 최적화 설정
  images: {
    domains: ['localhost'],
    unoptimized: false
  },
  
  // 외부 접근 허용 (성능 경고 해결)
  allowedDevOrigins: ['*'],
  
  // 메모리 최적화를 위해 Turbopack 비활성화
  // turbopack: {},
  
  // 메모리 최적화 설정
  experimental: {
    optimizePackageImports: ['@/components', '@/utils'],
    cpus: 1, // CPU 워커 수 제한
  },
  
  // 번들 최적화
  webpack: (config, { dev }) => {
    if (dev) {
      // 개발 모드에서 메모리 절약
      config.optimization = {
        ...config.optimization,
        minimize: false,
        splitChunks: false,
      };
      
      // 캐시 제한으로 메모리 절약
      config.cache = {
        type: 'memory',
        maxGenerations: 1,
      };
    }
    return config;
  },
  
  // 정적 사이트에서는 headers 설정이 지원되지 않음
  // 필요한 경우 배포 후 웹서버에서 설정
  // async headers() {
  //   return [
  //     {
  //       source: '/(.*)',
  //       headers: [
  //         {
  //           key: 'Access-Control-Allow-Origin',
  //           value: '*',
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
