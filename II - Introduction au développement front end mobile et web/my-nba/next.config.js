/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ca-times.brightspotcdn.com",
      },
    ],
  },
};

module.exports = nextConfig;
