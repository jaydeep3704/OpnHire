import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  devIndicators:{
    position:'bottom-right'
  },
  
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "utfs.io",
        port: "",
        protocol: "https"
      },
      {
        hostname: "7kf49zim2e.ufs.sh",
        protocol: "https"
      },

    ]
  },
  webpack: (config) => {
    return config;
  }
};

export default nextConfig;
