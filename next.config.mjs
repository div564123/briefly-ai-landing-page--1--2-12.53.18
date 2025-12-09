/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Turbopack configuration for Next.js 16
  // Empty config to silence the warning - webpack config is for production builds
  turbopack: {},
  // Keep webpack config for production builds (non-Turbopack)
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude ffmpeg packages from webpack bundling on server side
      config.externals = config.externals || []
      config.externals.push({
        'ffmpeg-static': 'commonjs ffmpeg-static',
        '@ffmpeg-installer/ffmpeg': 'commonjs @ffmpeg-installer/ffmpeg',
        'fluent-ffmpeg': 'commonjs fluent-ffmpeg',
      })
    }
    return config
  },
  // Add headers for CSP in development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: process.env.NODE_ENV === 'development'
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.live;"
              : "script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';",
          },
        ],
      },
    ]
  },
}

export default nextConfig
