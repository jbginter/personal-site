/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Common server settings you might want:
  
  // Custom headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'my-value',
  },
  
  // Image optimization
  images: {
    domains: ['example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Custom port (dev only)
  // Run with: npm run dev
};

module.exports = nextConfig;