import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:"utfs.io",
        port:"",
        protocol:"https"
      },{
        hostname:"7kf49zim2e.ufs.sh",
        protocol:"https"
      }
    ]
  }
};

export default nextConfig;
