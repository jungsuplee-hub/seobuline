import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
  allowedDevOrigins: ["seobuline.kro.kr", "localhost", "127.0.0.1"],
};

export default nextConfig;
