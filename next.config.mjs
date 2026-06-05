/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
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

// ── CDN + Cache-Control headers ───────────────────────────────────────────────
nextConfig.headers = async () => [
  // Immutable long cache for all hashed Next.js static chunks
  {
    source: "/_next/static/:path*",
    headers: [
      { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    ],
  },
  // Static public assets — 24-hour browser cache, CDN revalidates weekly
  {
    source: "/icons/:path*",
    headers: [
      { key: "Cache-Control", value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400" },
    ],
  },
  // Constitution / parties / election pages — ISR-friendly
  // CDN caches for 5 min; browser for 60 s; falls back to stale for 1 day
  {
    source: "/(constitution|parties|elections|judiciary|power-structure)",
    headers: [
      { key: "Cache-Control", value: "public, max-age=60, s-maxage=300, stale-while-revalidate=86400" },
    ],
  },
  // API routes that are safe to cache at edge (read-only, source-verified data)
  {
    source: "/api/(parties|timeline|institutions|judiciary|graph/:path*)",
    headers: [
      { key: "Cache-Control", value: "public, max-age=60, s-maxage=300, stale-while-revalidate=3600" },
    ],
  },
  // No cache for auth, user-specific, AI, and admin routes
  {
    source: "/api/(auth|assistant|moderation|admin|representatives/discover)/:path*",
    headers: [
      { key: "Cache-Control", value: "private, no-store" },
    ],
  },
  // Health check — never cache
  {
    source: "/api/health",
    headers: [
      { key: "Cache-Control", value: "no-store" },
    ],
  },
];

export default nextConfig;
