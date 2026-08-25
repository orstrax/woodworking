import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [{ source: "/tools/shaker-door", destination: "/tools/cabinet-doors", permanent: true }];
  },
};

export default nextConfig;
