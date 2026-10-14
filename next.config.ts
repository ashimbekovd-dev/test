import type { NextConfig } from "next";

// Домены фото, которые оптимизирует next/image. Остальные URL отдаются как есть (unoptimized).
const IMAGE_HOSTS = ["static.tildacdn.pro", "thb.tildacdn.pro", "static.tildacdn.com", "thb.tildacdn.com"];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: IMAGE_HOSTS.map((hostname) => ({ protocol: "https" as const, hostname })),
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
