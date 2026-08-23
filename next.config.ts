import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Faza 6 (naviqasiya) moved these under new routes/nav positions. The old
  // routes still exist (not deleted yet — see docs/architecture/
  // 03-migration-plan.md Faza 7) but nothing links to them anymore, so
  // redirect old bookmarks/search-engine links to the new location.
  async redirects() {
    return [
      { source: "/resources/opportunities", destination: "/work-with-us", permanent: true },
      { source: "/resources/opportunities/:slug", destination: "/work-with-us/:slug", permanent: true },
      { source: "/resources/misc", destination: "/resources/media", permanent: true },
    ];
  },
  // Governs dev-only cross-origin access to /_next/* assets and HMR — this
  // is why GET requests (page loads) already worked from another machine
  // on the LAN.
  allowedDevOrigins: ['192.168.1.69'],
  // Server Actions (every admin form POST, upload, login, etc.) validate
  // the request's Origin against a *separate* allowlist for CSRF
  // protection — without the port included here, LAN POSTs get rejected
  // even though GETs are fine. 213.136.92.177 is the production VPS
  // (behind nginx on :80, so no port suffix); mmmdkhnli.site is the real
  // domain now pointed at it (both bare and www, since either can end up
  // as the Origin depending on which one a visitor typed/clicked).
  experimental: {
    serverActions: {
      allowedOrigins: [
        '192.168.1.65:3000',
        '213.136.92.177',
        'mmmdkhnli.site',
        'www.mmmdkhnli.site',
      ],
      // Next.js defaults Server Action request bodies to 1MB — well under
      // the 8MB image cap upload-action.ts itself enforces. Anything over
      // 1MB (i.e. most real phone photos) got silently rejected by the
      // framework before that check ever ran, surfacing as a generic
      // "Failed to fetch" instead of a clean error message.
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
