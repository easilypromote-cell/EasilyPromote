import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@ep/ui"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;
