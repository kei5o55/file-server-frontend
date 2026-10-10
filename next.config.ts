import type { NextConfig } from 'next';

// Next.js サーバーから見た Rails の URL (Docker 内では service 名で到達する)
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL ?? 'http://localhost:3000';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['192.168.100.5'],
  // Rails が返す相対パス (/rails/active_storage/...) をバックエンドへ中継する
  async rewrites() {
    return [
      {
        source: '/rails/:path*',
        destination: `${backendInternalUrl}/rails/:path*`,
      },
    ];
  },
};

export default nextConfig;
