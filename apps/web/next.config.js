/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@astromate/shared'],
  // Allow cross-origin requests to the local Express server
  async rewrites() {
    return [
      {
        source: '/api/server/:path*',
        destination: `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3001'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
