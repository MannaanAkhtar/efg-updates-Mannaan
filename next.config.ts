import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old site URLs → new equivalents (301 permanent)
      { source: "/about-us", destination: "/about", permanent: true },
      { source: "/about-us/", destination: "/about", permanent: true },
      { source: "/past-events", destination: "/events", permanent: true },
      { source: "/past-events/", destination: "/events", permanent: true },
      { source: "/what-we-do", destination: "/about", permanent: true },
      { source: "/what-we-do/", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/contact-us/", destination: "/contact", permanent: true },
      // Old event-specific URLs (WordPress-era patterns)
      { source: "/cyber-first", destination: "/events/cyber-first", permanent: true },
      { source: "/cyber-first/", destination: "/events/cyber-first", permanent: true },
      { source: "/ot-security-first", destination: "/events/ot-security-first", permanent: true },
      { source: "/ot-security-first/", destination: "/events/ot-security-first", permanent: true },
      { source: "/opex-first", destination: "/events/opex-first", permanent: true },
      { source: "/opex-first/", destination: "/events/opex-first", permanent: true },
      { source: "/events/opex-first/virtual-boardroom-mena", destination: "/events/opex-first/process-intelligence", permanent: true },
      { source: "/data-ai-first", destination: "/events/data-ai-first", permanent: true },
      { source: "/data-ai-first/", destination: "/events/data-ai-first", permanent: true },
      { source: "/digital-first", destination: "/events/data-ai-first", permanent: true },
      { source: "/digital-first/", destination: "/events/data-ai-first", permanent: true },
      // Old WordPress patterns with trailing slashes
      { source: "/events/", destination: "/events", permanent: true },
      { source: "/speakers/", destination: "/speakers", permanent: true },
      { source: "/insights/", destination: "/insights", permanent: true },
      { source: "/contact/", destination: "/contact", permanent: true },
      { source: "/about/", destination: "/about", permanent: true },
      // Consolidate old event domains content
      { source: "/general-trading/:path*", destination: "/", permanent: true },
      { source: "/it-products/:path*", destination: "/", permanent: true },
      { source: "/technical-service/:path*", destination: "/", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cyberfirstseries.com",
      },
      {
        protocol: "https",
        hostname: "efg-final.s3.eu-north-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "opexfirst.com",
      },
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

export default nextConfig;
// Rebuild: Sun Mar  1 02:45:35 +04 2026
