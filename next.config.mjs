/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Gzip / Brotli compression for all responses
  compress: true,

  // Don't leak the server technology
  poweredByHeader: false,

  // Serve modern image formats when the browser supports them
  images: {
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    optimizePackageImports: [
      "react-icons",
      "react-icons/hi",
      "react-icons/hi2",
      "framer-motion",
      "recharts",
      "react-countup",
      "react-hot-toast",
    ],
  },

  // Cache-Control headers for static assets and API routes
  async headers() {
    return [
      {
        // Next.js immutable static assets (_next/static)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Electricity rate endpoint — data rarely changes
        source: "/api/electricity-rate",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600",
          },
        ],
      },
      {
        // AI endpoints must never be cached
        source: "/api/:path(gemini-.*|ai-.*|energy-tips)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

