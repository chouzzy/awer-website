import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async redirects() {
    return [
      // Endereço curto usado em materiais de captação
      { source: "/planfim6-1", destination: "/escala-6x1", permanent: true },
    ];
  },
};

export default nextConfig;
