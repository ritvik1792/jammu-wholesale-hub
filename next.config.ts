import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    position: "top-right",
  },
  async rewrites() {
    return [
      {
        source: "/:file(google[a-zA-Z0-9_-]+\\.html)",
        destination: "/api/google-verify?file=:file",
      },
    ];
  },
};

export default nextConfig;
