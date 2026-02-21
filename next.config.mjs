/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
};

export default nextConfig;
