import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build autonome pour l'image Docker (voir Dockerfile).
  output: "standalone",
};

export default nextConfig;
