import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/vericover",
  assetPrefix: "/vericover/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
