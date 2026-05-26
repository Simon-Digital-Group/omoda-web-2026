import { NextRequest, NextResponse } from "next/server";

// SECURITY: Server-side proxy to the Make webhook. The webhook URL never reaches
// the browser, and we apply validation, rate limiting and CSRF/origin checks
// before forwarding.
const MAKE_WEBHOOK_URL = process.env.MAKE_ENTREGA_WEBHOOK_URL || "";

const MAX_BODY_BYTES = 8_192;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const attempts = new Map<string, { count: number; resetAt: number }>();

function pruneRateLimitMap(): void {
  const now = Date.now();
  Array.from(attempts.entries()).forEach(([key, val]) => {
    if (now > val.resetAt) attempts.delete(key);
  });
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
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

function isValidEmail(s: string): boolean {
  if (s.length > 254) return false;
  if (/[\r\n\0]/.test(s)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Allow the production domain, its `entrega` subdomain, and local dev.
const ALLOWED_ORIGIN_HOSTS = new Set([
  "omodajaecoo.com.uy",
  "www.omodajaecoo.com.uy",
  "entrega.omodajaecoo.com.uy",
]);

function isAllowedOrigin(origin: string, host: string): boolean {
  if (!origin) return true; // same-origin navigation
  let originHost = "";
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }
  if (originHost.startsWith("localhost") || originHost.startsWith("127.0.0.1")) {
    return process.env.NODE_ENV !== "production";
  }
  if (ALLOWED_ORIGIN_HOSTS.has(originHost)) return true;
  // Fallback: same host (covers Vercel preview deployments)
  return host ? originHost === host : false;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ error: "Tipo de contenido inválido." }, { status: 415 });
    }

    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload demasiado grande." }, { status: 413 });
    }

    const origin = request.headers.get("origin") || "";
    const host = request.headers.get("host") || "";
    if (!isAllowedOrigin(origin, host)) {
      return NextResponse.json({ error: "Origen inválido." }, { status: 403 });
    }

    const ip = getClientIp(request);
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Demasiados intentos. Esperá un minuto." },
        { status: 429 }
      );
    }

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

    const { fullName, ci, email, phone, website, submittedAt } = body || {};

    // Honeypot
    if (website) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Minimum time-to-submit
    if (submittedAt && typeof submittedAt === "number") {
      const elapsed = Date.now() - submittedAt;
      if (elapsed < 1500) {
        return NextResponse.json({ success: true }, { status: 200 });
      }
    }

    const rawName  = typeof fullName === "string" ? fullName.trim() : "";
    const rawCi    = typeof ci       === "string" ? ci.trim()       : "";
    const rawEmail = typeof email    === "string" ? email.trim()    : "";
    const rawPhone = typeof phone    === "string" ? phone.trim()    : "";

    if (!rawName || !rawCi || !rawEmail || !rawPhone) {
      return NextResponse.json(
        { error: "Todos los campos son requeridos." },
        { status: 400 }
      );
    }

    if (
      rawName.length  > 120 ||
      rawCi.length    > 20  ||
      rawEmail.length > 254 ||
      rawPhone.length > 40
    ) {
      return NextResponse.json({ error: "Campos demasiado largos." }, { status: 400 });
    }

    if (!isValidEmail(rawEmail)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    if (!MAKE_WEBHOOK_URL || !/^https:\/\//.test(MAKE_WEBHOOK_URL)) {
      console.error("MAKE_ENTREGA_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Servicio no configurado." },
        { status: 500 }
      );
    }

    const forwardPayload = {
      fullName: rawName,
      ci: rawCi,
      email: rawEmail,
      phone: rawPhone,
      submittedAt: new Date().toISOString(),
      ip,
      userAgent: request.headers.get("user-agent") || "",
      source: "entrega-form",
    };

    // SECURITY: Time-bound the upstream request so a slow Make endpoint cannot
    // hold the Vercel function open until timeout.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    let upstream: Response;
    try {
      upstream = await fetch(MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forwardPayload),
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timeout);
      console.error("Make webhook error:", (err as Error)?.message);
      return NextResponse.json(
        { error: "No se pudo registrar la entrega. Intentá nuevamente." },
        { status: 502 }
      );
    }
    clearTimeout(timeout);

    if (!upstream.ok) {
      console.error("Make webhook non-2xx:", upstream.status);
      return NextResponse.json(
        { error: "No se pudo registrar la entrega. Intentá nuevamente." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Entrega form error:", (err as Error)?.message);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
