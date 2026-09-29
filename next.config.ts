import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["lucide-react"],
  serverExternalPackages: [
    "@neondatabase/serverless",
    "@supabase/ssr",
    "@supabase/supabase-js",
  ],
};

export default nextConfig;
