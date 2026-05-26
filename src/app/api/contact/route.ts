import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "OMODA JAECOO <onboarding@resend.dev>";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";

// SECURITY: Maximum request body size accepted (bytes). Rejects oversized payloads
// before parsing to prevent memory exhaustion / log flooding.
const MAX_BODY_BYTES = 8_192; // 8 KB — far more than any legitimate contact form needs

// SECURITY: In-memory rate limiter per serverless instance. Resets on cold start by design;
// this is acceptable for a marketing site — it limits burst abuse, not determined attackers.
// For true cross-instance limiting swap for Upstash Redis / Vercel KV.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max requests per IP per window
const attempts = new Map<string, { count: number; resetAt: number }>();

// SECURITY: Purge stale entries periodically so the Map doesn't grow unbounded in
// long-lived instances (e.g. development server). In production serverless this
// matters less, but it's good hygiene.
function pruneRateLimitMap(): void {
  const now = Date.now();
  // SECURITY: Use Array.from to avoid needing --downlevelIteration while still
  // iterating a Map safely across all tsconfig targets.
  Array.from(attempts.entries()).forEach(([key, val]) => {
    if (now > val.resetAt) attempts.delete(key);
  });
}

// SECURITY: Use the LAST entry in x-forwarded-for (set by Vercel's edge, not spoofable
// by the client) rather than the first (which the client can forge). When the header is
// absent fall back to x-real-ip set by the infrastructure.
function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    // Vercel appends the real client IP as the LAST comma-separated value.
    const parts = fwd.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return req.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
  pruneRateLimitMap();
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count += 1;
  return true;
}

// SECURITY: HTML-escape all user-supplied strings before embedding in email HTML body.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// SECURITY: Strip CR/LF from any value that lands in an email header (Subject, To, From, etc.)
// to prevent header injection attacks.
function sanitizeHeader(s: string): string {
  return s.replace(/[\r\n\0]/g, " ").trim().slice(0, 200);
}

// SECURITY: Validate email format and reject any address containing header-injection chars.
function isValidEmail(s: string): boolean {
  if (s.length > 254) return false;
  if (/[\r\n\0]/.test(s)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// SECURITY: Allowed origins — the production domain and localhost for dev.
// Requests whose Origin header doesn't match are rejected (CSRF protection).
const ALLOWED_ORIGINS = new Set([
  "https://omodajaecoo.com.uy",
  "https://www.omodajaecoo.com.uy",
]);

function isAllowedOrigin(origin: string, host: string): boolean {
  if (!origin) return true; // server-to-server or same-origin navigation (no Origin header)
  // Allow localhost in development
  if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
    return process.env.NODE_ENV !== "production";
  }
  // Allow exact match against the production domain set
  if (ALLOWED_ORIGINS.has(origin)) return true;
  // Fallback: origin must end with the Host header value (handles preview deployments)
  return host ? origin.endsWith(host) : false;
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Enforce Content-Type: application/json — reject non-JSON requests early.
    // This blocks form-based CSRF (multipart/form-data, application/x-www-form-urlencoded).
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Tipo de contenido inválido." }, { status: 415 });
    }

    // SECURITY: Enforce body size limit before reading. Prevents large-payload attacks.
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload demasiado grande." }, { status: 413 });
    }

    // SECURITY: Strict origin/referer check (CSRF protection).
    const origin = request.headers.get("origin") || "";
    const host = request.headers.get("host") || "";
    if (!isAllowedOrigin(origin, host)) {
      return NextResponse.json({ error: "Origen inválido." }, { status: 403 });
    }

    // Rate limit
    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Esperá un minuto." },
        { status: 429 }
      );
    }

    // SECURITY: Read body with a size guard. If content-length was absent or spoofed,
    // slicing protects against unexpectedly large bodies.
    let rawBody: string;
    try {
      const buf = await request.arrayBuffer();
      if (buf.byteLength > MAX_BODY_BYTES) {
        return NextResponse.json({ error: "Payload demasiado grande." }, { status: 413 });
      }
      rawBody = new TextDecoder().decode(buf);
    } catch {
      return NextResponse.json({ error: "Error al leer el cuerpo." }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
    }

    const { fullName, email, phone, model, message, website, submittedAt } = body || {};

    // Honeypot — bots fill hidden fields
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Minimum time-to-submit (bots submit instantly)
    if (submittedAt && typeof submittedAt === "number") {
      const elapsed = Date.now() - submittedAt;
      if (elapsed < 1500) {
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    // SECURITY: Coerce all fields to strings before any validation so that
    // objects / arrays from a crafted JSON payload cannot bypass string checks.
    const rawName    = typeof fullName  === "string" ? fullName  : "";
    const rawEmail   = typeof email     === "string" ? email     : "";
    const rawPhone   = typeof phone     === "string" ? phone     : "";
    const rawModel   = typeof model     === "string" ? model     : "";
    const rawMessage = typeof message   === "string" ? message   : "";

    // Validation
    if (!rawName || !rawEmail || !rawPhone) {
      return NextResponse.json(
        { error: "Nombre, email y teléfono son requeridos." },
        { status: 400 }
      );
    }

    // Length caps
    if (
      rawName.length    > 120 ||
      rawEmail.length   > 254 ||
      rawPhone.length   > 40  ||
      rawModel.length   > 80  ||
      rawMessage.length > 2000
    ) {
      return NextResponse.json({ error: "Campos demasiado largos." }, { status: 400 });
    }

    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !CONTACT_EMAIL) {
      console.error("Resend not configured");
      return NextResponse.json(
        { error: "Servicio de email no configurado." },
        { status: 500 }
      );
    }

    // SECURITY: Every field HTML-escaped + header-sanitized before use in email.
    const safe = {
      fullName: escapeHtml(sanitizeHeader(rawName)),
      email:    escapeHtml(rawEmail),
      phone:    escapeHtml(sanitizeHeader(rawPhone)),
      model:    escapeHtml(sanitizeHeader(rawModel || "No especificado")),
      message:  escapeHtml(rawMessage || "Sin mensaje"),
    };

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL.split(",").map((e) => e.trim()),
      // SECURITY: replyTo uses the raw (pre-escape) validated email — Resend handles
      // its own header encoding; passing HTML-escaped form would corrupt the address.
      replyTo: rawEmail,
      subject: sanitizeHeader(`Nuevo lead: ${safe.fullName} — ${safe.model}`),
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#111">
          <h2 style="color:#00A88F;margin-bottom:16px">Nuevo contacto desde la web</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold;width:140px">Nombre</td><td style="padding:8px;border-bottom:1px solid #eee">${safe.fullName}</td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Email</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="mailto:${safe.email}">${safe.email}</a></td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Teléfono</td><td style="padding:8px;border-bottom:1px solid #eee"><a href="tel:${safe.phone.replace(/\s/g, "")}">${safe.phone}</a></td></tr>
            <tr><td style="padding:8px;border-bottom:1px solid #eee;font-weight:bold">Modelo</td><td style="padding:8px;border-bottom:1px solid #eee">${safe.model}</td></tr>
            <tr><td style="padding:8px;vertical-align:top;font-weight:bold">Mensaje</td><td style="padding:8px;white-space:pre-wrap">${safe.message}</td></tr>
          </table>
          <p style="color:#888;font-size:12px;margin-top:24px">Recibido desde omodajaecoo.com.uy</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error status:", (error as any)?.statusCode || "unknown");
      return NextResponse.json(
        { error: "No se pudo enviar el email. Intentá nuevamente." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Solicitud recibida correctamente." },
      { status: 200 }
    );
  } catch (err) {
    console.error("Contact form error:", (err as Error)?.message);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
