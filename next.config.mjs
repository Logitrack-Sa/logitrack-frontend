import { fileURLToPath } from "node:url";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  experimental: { cpus: 2 },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
