import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  serverExternalPackages: [
    "@neondatabase/serverless",
  ],
};

export default nextConfig;
