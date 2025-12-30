// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */
//   reactCompiler: true,
// };

// export default nextConfig;
// next.config.mjs

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,  // Enables React strict mode for better development experience
  swcMinify: true,        // Enables SWC minifier for production builds
};

export default nextConfig;
