/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      // Product/category forms upload images via Server Actions; the default
      // 1 MB limit is too small for typical photos.
      bodySizeLimit: "10mb",
    },
  },
  images: {
    // Local dev here runs on a NAT64 network: public hosts (e.g. Supabase behind
    // Cloudflare) resolve to 64:ff9b::/96 addresses that Next 16's SSRF guard
    // misclassifies as private, returning 400 from /_next/image. Allow it in dev
    // only — production keeps the protection.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
