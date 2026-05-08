/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "videos.ctfassets.net",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/webp", "image/avif"],
  },
  // SECURITY: Remove the X-Powered-By: Next.js header to reduce information disclosure.
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      // SECURITY: HSTS — force HTTPS for 2 years, cover subdomains, submit to preload list.
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      // SECURITY: Prevent clickjacking. frame-ancestors 'none' in CSP is the modern
      // equivalent but X-Frame-Options covers older browsers.
      { key: "X-Frame-Options", value: "DENY" },
      // SECURITY: Prevent MIME-type sniffing attacks.
      { key: "X-Content-Type-Options", value: "nosniff" },
      // SECURITY: Control referrer data sent to third parties.
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      // SECURITY: Disable DNS prefetching to prevent leaking visited URLs to DNS resolvers.
      { key: "X-DNS-Prefetch-Control", value: "off" },
      // SECURITY: Prevent Adobe Flash / PDF cross-domain data loading (defence-in-depth).
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      // SECURITY: Permissions-Policy — deny access to sensitive browser APIs.
      // payment and usb are unlisted by default but explicit denial is belt-and-suspenders.
      {
        key: "Permissions-Policy",
        value: [
          "camera=()",
          "microphone=()",
          "geolocation=()",
          "payment=()",
          "usb=()",
          "interest-cohort=()",
          "browsing-topics=()",
        ].join(", "),
      },
      {
        // SECURITY: Content Security Policy.
        //
        // unsafe-inline on script-src: REQUIRED for GTM and Google Consent Mode v2.
        // GTM injects inline <script> tags that cannot be nonce-based without a custom
        // server that rewrites HTML on every request. For a static/ISR Next.js site on
        // Vercel this is the pragmatic trade-off; document it here explicitly.
        //
        // unsafe-eval kept: required by Framer Motion (uses Function() for runtime
        // value interpolation in animations). Removing it breaks all animations on
        // the site. Acceptable trade-off given there is no user-controlled JS execution.
        //
        // img-src includes googletagmanager.com because GTM conversion pixels use 1×1 GIFs.
        // data: is needed for Next.js blur placeholders (base64 data URIs).
        //
        // connect-src includes Resend's API domain because the contact form POSTs to /api/contact
        // which is same-origin — no external connect needed for that. The GA/GTM entries
        // are needed for analytics beacons.
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          // SECURITY: unsafe-inline required by GTM; unsafe-eval required by Framer Motion.
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "img-src 'self' data: blob: https://images.ctfassets.net https://www.google-analytics.com https://www.googletagmanager.com",
          "media-src 'self' https://videos.ctfassets.net https://images.ctfassets.net",
          "font-src 'self' data: https://fonts.gstatic.com",
          "connect-src 'self' https://cdn.contentful.com https://preview.contentful.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://www.googletagmanager.com",
          "frame-src 'self' https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com",
          // SECURITY: Disallow this page from being framed anywhere.
          "frame-ancestors 'none'",
          // SECURITY: Restrict <base> tag to same origin — prevents base-tag hijacking.
          "base-uri 'self'",
          // SECURITY: Forms may only submit to same origin.
          "form-action 'self'",
          // SECURITY: Disallow Flash, Java applets, and other plugins.
          "object-src 'none'",
          // SECURITY: Disallow loading of workers from external origins.
          "worker-src 'self' blob:",
        ].join("; "),
      },
    ];
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
