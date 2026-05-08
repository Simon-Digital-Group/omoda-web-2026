# Security Audit — OMODA | JAECOO Uruguay

**Date:** 2026-04-29  
**Auditor:** Senior AppSec review  
**Stack:** Next.js 14 (App Router) + TypeScript, Vercel, Contentful CDA, Resend  
**Scope:** Full codebase — no auth, no DB, no payments

---

## Summary

| Severity | Count |
|----------|-------|
| CRITICAL | 0     |
| HIGH     | 4     |
| MEDIUM   | 7     |
| LOW      | 4     |
| INFO     | 3     |

All HIGH and MEDIUM findings have been fixed in this audit pass. LOW and INFO items are documented with recommendations.

---

## Findings

---

### [HIGH-1] IP Spoofing in Rate Limiter via x-forwarded-for First Entry

**File:** `src/app/api/contact/route.ts`  
**Vector:** An attacker could send `X-Forwarded-For: 1.2.3.4, <real-ip>` and the old code would use `1.2.3.4` (the attacker-controlled first value) as the rate-limit key, completely bypassing the per-IP limit.  
**Fix applied:** Changed to use the **last** value in `x-forwarded-for`, which is set by Vercel's edge infrastructure and cannot be forged by the client.

---

### [HIGH-2] No Content-Type Enforcement on /api/contact

**File:** `src/app/api/contact/route.ts`  
**Vector:** Without a Content-Type check, an attacker could POST a `multipart/form-data` or `application/x-www-form-urlencoded` CSRF request from any origin (browsers do not send an `Origin` header for simple-request form submissions in some older configurations). This bypassed the origin check.  
**Fix applied:** Added strict `Content-Type: application/json` enforcement (HTTP 415 if absent). Combined with the origin check, this closes the CSRF surface.

---

### [HIGH-3] No Body Size Limit — Potential Memory/Log Exhaustion

**File:** `src/app/api/contact/route.ts`  
**Vector:** Without a body size limit, an attacker could POST arbitrarily large payloads, consuming Lambda memory and filling Vercel logs, effectively a low-cost DoS against the contact route.  
**Fix applied:** Added an 8 KB hard cap checked both via `Content-Length` header (fast path) and via `arrayBuffer().byteLength` (guards against spoofed headers). Responds HTTP 413.

---

### [HIGH-4] unsafe-eval in Content-Security-Policy

**File:** `next.config.mjs`  
**Vector:** `unsafe-eval` was present in `script-src` with no documented justification. It allows `eval()`, `new Function()`, and similar constructs — the primary escalation path for XSS payloads. No dependency in the current stack requires it.  
**Fix applied:** Removed `unsafe-eval`. Build passes; all runtime functionality confirmed working.

---

### [MEDIUM-1] Origin Check Used endsWith() — Subdomain Bypass Possible

**File:** `src/app/api/contact/route.ts`  
**Vector:** The old check `!origin.endsWith(host)` would pass for an origin like `evilsite-omodajaecoo.com.uy` if `host` was `omodajaecoo.com.uy`.  
**Fix applied:** Replaced with an allowlist (`Set`) of exact production origins plus explicit `localhost` allowance for development only. The `endsWith` fallback is now only used for Vercel preview deployment URLs.

---

### [MEDIUM-2] User Input Not Coerced to String Before Validation

**File:** `src/app/api/contact/route.ts`  
**Vector:** Fields were destructured from JSON as `unknown`. Passing a JSON `{"email": {"toString": "..."}}` object to `isValidEmail()` would throw a runtime error (unhandled, leaking a 500). Passing `{"fullName": []}` to `String()` would produce `""` and bypass the required-field check.  
**Fix applied:** All fields are now explicitly coerced: `typeof x === "string" ? x : ""` before any validation. Non-string values produce empty strings which fail required-field validation cleanly.

---

### [MEDIUM-3] Empty Catch Blocks Silencing Contentful Errors

**File:** `src/lib/contentful.ts`  
**Vector:** All five CMS fetch functions had bare `} catch { return []; }` / `return null`. Any Contentful API error, misconfigured token, or network outage was silently swallowed. This makes it impossible to distinguish "no data exists" from "auth failed" from "API is down" in logs.  
**Fix applied:** All catch blocks now log `(err as Error)?.message` to `console.error` with a function-specific prefix, while still returning the safe empty fallback. No error details reach the client.

---

### [MEDIUM-4] Missing Security Headers

**File:** `next.config.mjs`  
**Vector:** `X-DNS-Prefetch-Control` and `X-Permitted-Cross-Domain-Policies` were absent. `Permissions-Policy` was missing `payment`, `usb`, and `browsing-topics`.  
**Fix applied:** Added all missing headers. `X-DNS-Prefetch-Control: off` prevents prefetch leaks; `X-Permitted-Cross-Domain-Policies: none` blocks Adobe/Silverlight cross-domain requests; `Permissions-Policy` now explicitly denies camera, microphone, geolocation, payment, usb, interest-cohort, and browsing-topics.

---

### [MEDIUM-5] CMS-Sourced URLs Not Validated Before Use in href Attributes

**File:** `src/lib/contentful.ts`  
**Vector:** Contentful field values for `ctaLink`, `instagram`, `facebook`, `whatsapp` were used directly in `href` props. A compromised CMS account or misconfigured field could inject `javascript:` or `data:` URIs, leading to XSS when clicked.  
**Fix applied:** Added `sanitizeCmsUrl()` helper that allowlists `https://`, `http://`, `tel:`, `mailto:`, `/`, and `#` schemes. All other schemes are rejected with a warning log and return `""`. Applied to `ctaLink` in `getHeroBanners` and all three social/whatsapp URLs in `getSiteSettings`.

---

### [MEDIUM-6] WhatsApp Pre-Armed Text Not URL-Encoded

**File:** `src/app/concesionarios/page.tsx`  
**Vector:** The static text `"Hola! Me gustaría conocer un concesionario cercano"` was appended to the `wa.me` URL unencoded. Characters like `!`, accented letters, and future CMS-supplied dynamic text could break the URL structure or be interpreted as additional query parameters.  
**Fix applied:** Wrapped the text in `encodeURIComponent()`. All special characters are correctly percent-encoded.

---

### [MEDIUM-7] No Middleware — Bots and Preview Routes Unprotected

**File:** `src/middleware.ts` (new file)  
**Vector:** Without middleware, known vulnerability scanners (`sqlmap`, `nikto`, `masscan`, etc.) could freely probe `/api/contact` and other routes. The Contentful preview route (if exposed) would be accessible without authentication.  
**Fix applied:** Created `src/middleware.ts` at the edge that: (1) blocks requests from User-Agents matching known scanner/probe patterns with HTTP 403; (2) requires a matching `CONTENTFUL_PREVIEW_SECRET` for any `/api/preview` or `/preview` route. Matcher is scoped to `/api/*` and `/preview/*` only to keep edge latency minimal.

---

### [LOW-1] GTM ID Interpolated into Inline Script Without Format Validation

**File:** `src/app/layout.tsx`  
**Vector:** `NEXT_PUBLIC_GTM_ID` was interpolated directly into a `dangerouslySetInnerHTML` script block. A misconfigured env var (e.g. a value containing `');alert(1)//`) could break the GTM script or, in a misconfiguration scenario, inject arbitrary JS.  
**Fix applied:** GTM_ID is now validated against `/^GTM-[A-Z0-9]+$/` before use. Non-matching values fall back to the hardcoded default.

---

### [LOW-2] next/image SVG Optimization Not Explicitly Disabled

**File:** `next.config.mjs`  
**Vector:** By default Next.js 14's image optimizer can process SVG files. An SVG stored in Contentful with embedded `<script>` tags would be served as-is (SVG optimization passes SVG through), and if rendered via `<img>` could execute scripts in some browser contexts (SVG-as-image with inline event handlers).  
**Fix applied:** Added `dangerouslyAllowSVG: false`, `contentDispositionType: "attachment"`, and a restrictive `contentSecurityPolicy` on the image optimizer config.

---

### [LOW-3] npm audit — Transitive Dependency Vulnerabilities

**Packages:** `axios` (SSRF/header injection, CVSS 4.8–7.2), `next` (see below), `glob`/`minimatch` (ReDoS)  
**Vector:** These are transitive dependencies of `contentful` SDK and `eslint-config-next`. Direct exploitation is limited: the `axios` vulnerabilities require server-side SSRF conditions that don't exist in this read-only CDA usage; the `next` finding is in `@next/eslint-plugin-next` (dev-only).  
**Fix not applied:** Upgrading these requires bumping `contentful` SDK to v11 (breaking API changes) or `eslint-config-next` to v16 (requires Next.js 15). This is an **ops/infra action** — see recommendations below.  
**Risk rating for this site:** LOW — no server-side request proxying, no user-controlled URLs in HTTP client calls.

---

### [LOW-4] Resend API Key Instantiated Per-Request

**File:** `src/app/api/contact/route.ts`  
**Vector:** `new Resend(process.env.RESEND_API_KEY)` is called inside every POST handler invocation. This is not a security issue but wastes a small amount of memory per cold start. Not a threat vector.  
**Recommendation:** Move to module-level instantiation. Not changed to avoid risk during this security pass.

---

### [INFO-1] NEXT_PUBLIC_GTM_ID Is Not a Secret

GTM container IDs are visible in browser source by design — they are not sensitive. The `NEXT_PUBLIC_` prefix is appropriate here. Documented explicitly in the code.

---

### [INFO-2] In-Memory Rate Limiter Resets on Cold Start

The rate limiter (`Map<ip, {count, resetAt}>`) lives in the serverless function's memory. On Vercel, each cold start resets it, and multiple concurrent instances do not share state. This means a determined attacker with distributed IPs or who triggers enough cold starts can send more than 3 requests/minute.

**This is an acceptable trade-off for a marketing site** with no financial transactions. The honeypot + timing check provide additional bot mitigation.

**Recommendation for future hardening:** Integrate [Upstash Redis](https://upstash.com) or Vercel KV for cross-instance rate limiting. The current code is structured for easy swap — replace `checkRateLimit()` with a KV-based implementation.

---

### [INFO-3] dangerouslySetInnerHTML Usage — All Safe

All `dangerouslySetInnerHTML` usages in the codebase are for:
- GTM / Google Consent Mode inline scripts (static strings, no user input)
- JSON-LD structured data (sanitized via `safeJsonLd()` which escapes `<` as `<`)
- Schema.org breadcrumb/vehicle schemas (static values, no CMS data injected raw)

None contain user-controlled or raw CMS string data. These are safe as implemented.

---

## Ops/Infra Action Items (Cannot Be Fixed in Code Alone)

| Priority | Action |
|----------|--------|
| HIGH | Set `CONTENTFUL_PREVIEW_SECRET` in Vercel environment variables. Until set, all `/preview` and `/api/preview` routes return 401 (secure-by-default). |
| HIGH | Upgrade `contentful` SDK to v11 and `eslint-config-next` to v16 to resolve `axios` and `glob` CVEs. Test CMS integration after upgrade. |
| MEDIUM | Set up Upstash KV or Vercel KV for cross-instance rate limiting on `/api/contact`. The current in-memory implementation is good enough for low-traffic but not for sustained spam campaigns. |
| MEDIUM | Configure Vercel Firewall rules to block known bad-actor ASNs and apply rate limiting at the infrastructure level (complements the in-code middleware). |
| LOW | Submit `omodajaecoo.com.uy` to the HSTS preload list at hstspreload.org. The `preload` directive is already in the HSTS header — this is the final step. |
| LOW | Run `npm audit fix` after the contentful/eslint-config-next upgrades to clear remaining transitive CVEs. |

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/api/contact/route.ts` | Content-Type enforcement, body size cap, IP spoofing fix, strict origin allowlist, string coercion, Array.from Map iteration, inline comment |
| `next.config.mjs` | Removed `unsafe-eval`, added `X-DNS-Prefetch-Control`, `X-Permitted-Cross-Domain-Policies`, expanded `Permissions-Policy`, SVG lockdown, `worker-src`, documented CSP comments |
| `src/middleware.ts` | **New file** — bot UA filtering, preview route secret guard |
| `src/lib/contentful.ts` | Server-only token comments, preview client guard, `sanitizeCmsUrl()` helper, applied sanitizer to `ctaLink` and social URLs, replaced all empty catch blocks with logged versions |
| `src/app/layout.tsx` | GTM_ID format validation |
| `src/app/concesionarios/page.tsx` | `encodeURIComponent` on WhatsApp pre-armed text |
| `.env.local.example` | **New file** — documents all required env vars with placeholder values |

---

## Build Status

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (17/17)
```

Build passes with zero errors and zero type errors.
