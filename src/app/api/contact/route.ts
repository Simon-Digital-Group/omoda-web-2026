import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/contact
 *
 * Handles lead form submissions.
 * Options for handling the data:
 *
 * 1. Send email via Resend (recommended — add `resend` to dependencies)
 * 2. Push to a Google Sheet via Google Sheets API
 * 3. Forward to a CRM webhook
 * 4. Store in a simple database (Supabase, PlanetScale, etc.)
 *
 * For now, this validates the data and returns success.
 * TODO: Wire up email/CRM integration.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { fullName, email, phone, model, message } = body;

    // Basic validation
    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: "Nombre, email y teléfono son requeridos." },
        { status: 400 }
      );
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Email inválido." },
        { status: 400 }
      );
    }

    // -------------------------------------------------------
    // TODO: Uncomment and configure one of these integrations:
    // -------------------------------------------------------

    // Option A: Send email with Resend
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'OMODA JAECOO <noreply@omodajaecoo.com.uy>',
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `Nuevo lead: ${fullName} — ${model || 'Sin modelo'}`,
    //   html: `
    //     <h2>Nuevo contacto desde la web</h2>
    //     <p><strong>Nombre:</strong> ${fullName}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Teléfono:</strong> ${phone}</p>
    //     <p><strong>Modelo:</strong> ${model || 'No especificado'}</p>
    //     <p><strong>Mensaje:</strong> ${message || 'Sin mensaje'}</p>
    //   `,
    // });

    // Option B: Webhook to CRM/Google Sheet
    // await fetch(process.env.WEBHOOK_URL!, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ fullName, email, phone, model, message, date: new Date().toISOString() }),
    // });

    console.log("📧 New lead:", { fullName, email, phone, model, message });

    return NextResponse.json(
      { success: true, message: "Solicitud recibida correctamente." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
