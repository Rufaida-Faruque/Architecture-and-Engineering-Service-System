// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;
// next.config.mjs
import { defineConfig } from 'next';

export default defineConfig({
  // Tell Next.js to use the src directory for pages
  experimental: {
    srcDir: 'src'
  },
  reactStrictMode: true,
});
