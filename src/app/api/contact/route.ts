import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "OMODA JAECOO <onboarding@resend.dev>";
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "";

// In-memory rate limiter (per instance). Good enough for small sites.
// For multi-region deployments, swap for Upstash/Vercel KV.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max requests per IP per window
const attempts = new Map<string, { count: number; resetAt: number }>();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): boolean {
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeHeader(s: string): string {
  return s.replace(/[\r\n]/g, " ").trim().slice(0, 200);
}

function isValidEmail(s: string): boolean {
  if (s.length > 254) return false;
  if (/[\r\n\0]/.test(s)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export async function POST(request: NextRequest) {
  try {
    // Origin check (CSRF-lite)
    const origin = request.headers.get("origin") || "";
    const host = request.headers.get("host") || "";
    if (origin && host && !origin.endsWith(host)) {
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

    const body = await request.json();
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

    // Validation
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Nombre, email y teléfono son requeridos." },
        { status: 400 }
      );
    }

    // Length caps
    if (
      String(fullName).length > 120 ||
      String(email).length > 254 ||
      String(phone).length > 40 ||
      String(model || "").length > 80 ||
      String(message || "").length > 2000
    ) {
      return NextResponse.json({ error: "Campos demasiado largos." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY || !CONTACT_EMAIL) {
      console.error("Resend not configured");
      return NextResponse.json(
        { error: "Servicio de email no configurado." },
        { status: 500 }
      );
    }

    const safe = {
      fullName: escapeHtml(sanitizeHeader(fullName)),
      email: escapeHtml(email),
      phone: escapeHtml(sanitizeHeader(phone)),
      model: escapeHtml(sanitizeHeader(model || "No especificado")),
      message: escapeHtml(String(message || "Sin mensaje")),
    };

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL.split(",").map((e) => e.trim()),
      replyTo: email,
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
