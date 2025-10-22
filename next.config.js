/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/onboarding',
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig