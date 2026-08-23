import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/resources/opportunities", destination: "/work-with-us", permanent: true },
      { source: "/resources/opportunities/:slug", destination: "/work-with-us/:slug", permanent: true },
      { source: "/resources/misc", destination: "/resources/media", permanent: true },
    ];
  },
  allowedDevOrigins: ['192.168.1.69'],
  experimental: {
    serverActions: {
      allowedOrigins: [
        '192.168.1.65:3000',
        '213.136.92.177',
        'mmmdkhnli.site',
        'www.mmmdkhnli.site',
      ],
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
