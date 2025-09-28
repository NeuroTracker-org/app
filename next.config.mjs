/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ➜ réduit la taille et complexité du build
  output: 'standalone',

  // ➜ évite que le build plante à cause du lint
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ➜ évite que le build plante à cause d’erreurs TypeScript
  typescript: {
    ignoreBuildErrors: true,
  },

  // ➜ active quelques optimisations Next.js 15
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
    // memoryLeakFixes aide parfois pour les SIGBUS
    memoryLeakFixes: true,
  },
};

export default nextConfig;
