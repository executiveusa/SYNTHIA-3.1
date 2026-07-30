import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Pauli Cockpit',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
}

export default nextConfig
