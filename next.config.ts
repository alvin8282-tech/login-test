import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel 배포 최적화 설정
  images: {
    domains: ['localhost'],
    unoptimized: false
  },
  
  // 실험적 기능 최소화
  experimental: {
    optimizePackageImports: ['@/components', '@/utils']
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
