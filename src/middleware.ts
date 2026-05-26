import { NextRequest, NextResponse } from "next/server";

// SECURITY: Middleware runs on every matched request at the Vercel edge before
// the Next.js runtime. It is the first line of defence for:
//   1. Blocking obvious bots from hitting expensive API routes.
//   2. Protecting the Contentful preview route with a shared secret.
//   3. Adding a lightweight request-level signal for the API rate limiter.

// ---------------------------------------------------------------------------
// Bot detection
// ---------------------------------------------------------------------------

// SECURITY: Patterns that reliably identify automated scanners, vulnerability
// probes, and spam bots — not real browsers. This is a denylist, not an allowlist,
// so legitimate but unusual UAs (curl in dev, Googlebot) are NOT blocked here;
// only obviously malicious ones are.
const BOT_UA_PATTERNS = [
  /masscan/i,
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /zgrab/i,
  /python-requests\/[0-9]/i, // unversioned / old requests lib spam
  /go-http-client\/1\./i,    // Go default HTTP client used by many scanners
  /libwww-perl/i,
  /\bscanner\b/i,
  /\bfuzz/i,
  /\bcrawler\b.*bot/i,
];

function isKnownBadBot(ua: string): boolean {
  if (!ua) return false;
  return BOT_UA_PATTERNS.some((re) => re.test(ua));
}

// ---------------------------------------------------------------------------
// Preview route protection
// ---------------------------------------------------------------------------

// SECURITY: The Contentful preview client uses a separate token with write-level
// access to draft content. Any route under /api/preview or /preview must require
// a secret query parameter or header matching CONTENTFUL_PREVIEW_SECRET to prevent
// accidental exposure of unpublished content.
//
// Set CONTENTFUL_PREVIEW_SECRET in Vercel environment variables (not NEXT_PUBLIC_).
const PREVIEW_SECRET = process.env.CONTENTFUL_PREVIEW_SECRET || "";

function isPreviewRoute(pathname: string): boolean {
  return pathname.startsWith("/api/preview") || pathname.startsWith("/preview");
}

function hasValidPreviewSecret(req: NextRequest): boolean {
  if (!PREVIEW_SECRET) return false; // secret not configured → deny all preview access
  const qsSecret = req.nextUrl.searchParams.get("secret");
  const headerSecret = req.headers.get("x-preview-secret");
  return qsSecret === PREVIEW_SECRET || headerSecret === PREVIEW_SECRET;
}

// ---------------------------------------------------------------------------
// Main middleware
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Subdomain rewrite (entrega.*)
// ---------------------------------------------------------------------------

// The vehicle delivery form lives at /entrega but is served from its own
// subdomain. Rewriting here keeps a single Next.js deployment while exposing
// the form on entrega.<root>.
function isEntregaSubdomain(host: string): boolean {
  const hostname = host.split(":")[0].toLowerCase();
  return (
    hostname === "entrega.omodajaecoo.com.uy" ||
    hostname.startsWith("entrega.localhost")
  );
}

function shouldSkipRewrite(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/images/")
  );
}

// ---------------------------------------------------------------------------
// Main middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get("user-agent") || "";
  const host = request.headers.get("host") || "";

  // SECURITY: Block known bad bots from reaching any route, especially /api/contact.
  if (isKnownBadBot(ua)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // SECURITY: Protect preview routes — return 401 if secret is absent/wrong.
  if (isPreviewRoute(pathname)) {
    if (!hasValidPreviewSecret(request)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // Subdomain rewrite: entrega.* → /entrega. Skipped for API/static so the
  // form's POST to /api/entrega and asset requests still resolve normally.
  if (isEntregaSubdomain(host) && !shouldSkipRewrite(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? "/entrega" : `/entrega${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Pass the request through; clone response to add any extra headers if needed.
  return NextResponse.next();
}

// SECURITY: Matcher — run middleware on every route except Next.js internals
// and obvious static assets. We need page-level coverage so the subdomain
// rewrite for entrega.* can intercept `/`, while still keeping edge latency
// minimal by excluding _next/static, _next/image and favicon.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
