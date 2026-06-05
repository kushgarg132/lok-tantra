/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Sharp is a native module used server-side only for image processing
    serverComponentsExternalPackages: ["sharp"],
  },
  images: {
    remotePatterns: [
      // Official government sources
      { protocol: "https", hostname: "**.eci.gov.in" },
      { protocol: "https", hostname: "**.gov.in" },
      { protocol: "https", hostname: "**.nic.in" },
      { protocol: "https", hostname: "sansad.in" },
      { protocol: "https", hostname: "loksabha.nic.in" },
      { protocol: "https", hostname: "rajyasabha.nic.in" },
      { protocol: "https", hostname: "pib.gov.in" },
      { protocol: "https", hostname: "india.gov.in" },
      // Trusted fallback sources
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      // Cloudflare R2 / custom CDN
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "media.loktantra.in" },
      // AWS S3
      { protocol: "https", hostname: "**.s3.amazonaws.com" },
      { protocol: "https", hostname: "**.s3.*.amazonaws.com" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 86400, // 24 hours
  },
};

export default nextConfig;
