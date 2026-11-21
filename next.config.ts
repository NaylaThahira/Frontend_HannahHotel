import type { NextConfig } from "next";

const ADMIN_SECURITY_HEADERS = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, max-age=0' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactCompiler: process.env.NODE_ENV === "production",
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  async headers() {
    return [
      { source: '/admin', headers: ADMIN_SECURITY_HEADERS },
      { source: '/admin/:path*', headers: ADMIN_SECURITY_HEADERS },
      { source: '/adminPadang', headers: ADMIN_SECURITY_HEADERS },
      { source: '/adminPadang/:path*', headers: ADMIN_SECURITY_HEADERS },
      { source: '/adminPainan', headers: ADMIN_SECURITY_HEADERS },
      { source: '/adminPainan/:path*', headers: ADMIN_SECURITY_HEADERS },
    ];
  },
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
