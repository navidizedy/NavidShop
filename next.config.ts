/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "example.com",
      },
      {
        protocol: "https",
        hostname: "jatvjlbplufwvrolmaty.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
