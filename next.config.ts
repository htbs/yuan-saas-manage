import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["*.soolay.cn"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yl-prescription-share.oss-cn-beijing.aliyuncs.com", // 替换为你的真实 OSS 域名
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
