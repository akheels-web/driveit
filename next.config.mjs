import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Type errors used to be silently ignored in production builds. Keep this
  // enabled — `npm run typecheck` is also wired up for CI.
  typescript: {
    ignoreBuildErrors: false,
  },
  // Docker builds set NEXT_OUTPUT_STANDALONE=true to emit a self-contained
  // server bundle. Keeping it opt-in means a local `npm run build && npm start`
  // behaves normally (Next warns that `next start` is unsupported when a
  // standalone build is present).
  output: process.env.NEXT_OUTPUT_STANDALONE === 'true' ? 'standalone' : undefined,
  // sharp and ioredis ship native binaries — load them from node_modules at
  // runtime instead of trying to bundle them.
  serverExternalPackages: ['sharp', '@payloadcms/db-postgres', 'ioredis'],
  poweredByHeader: false,
  allowedDevOrigins: ['localhost:3000', 'localhost:3001', '127.0.0.1:3000', '127.0.0.1:3001'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        // CMS uploads are delivered straight from Cloudinary when configured.
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(self)',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
}

export default withPayload(nextConfig)
