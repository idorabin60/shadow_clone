import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    // Use standalone output — avoids static generation errors with React 19 + framer-motion
    output: 'standalone',
}

export default nextConfig
