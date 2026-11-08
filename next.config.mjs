import { fileURLToPath } from "node:url";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  experimental: { cpus: 2 },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
