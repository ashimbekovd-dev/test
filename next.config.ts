import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "static.tildacdn.pro" },
      { protocol: "https", hostname: "static.tildacdn.com" },
      { protocol: "https", hostname: "thb.tildacdn.pro" },
      { protocol: "https", hostname: "thb.tildacdn.com" },
    ],
  },
  // Старые адреса с Tilda, чтобы ссылки из соцсетей и поиска не вели в 404
  async redirects() {
    return [{ source: "/brand", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
