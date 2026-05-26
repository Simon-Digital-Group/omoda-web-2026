"use client";

import { useRef, useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export default function EntregaForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const submittedAtRef = useRef<number>(Date.now());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "submitting") return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? "").trim(),
      ci: String(formData.get("ci") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      // honeypot — bots fill hidden fields
      website: String(formData.get("website") ?? ""),
      submittedAt: submittedAtRef.current,
    };

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/entrega", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: data.error || "No se pudo enviar el formulario.",
        });
        return;
      }
      setStatus({ kind: "success" });
      (e.target as HTMLFormElement).reset();
      submittedAtRef.current = Date.now();
    } catch {
      setStatus({
        kind: "error",
        message: "Error de red. Intentá nuevamente.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-accent/30 bg-accent/5 p-6"
      >
        <h2 className="font-display text-xl font-medium text-accent">
          Entrega registrada
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          Los datos del cliente fueron enviados correctamente.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: "idle" })}
          className="mt-6 inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-medium text-text-primary transition hover:border-accent hover:text-accent"
        >
          Registrar otra entrega
        </button>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 sm:p-8"
    >
      <Field
        label="Nombre completo"
        name="fullName"
        autoComplete="name"
        required
        maxLength={120}
      />
      <Field
        label="Cédula de identidad"
        name="ci"
        inputMode="numeric"
        autoComplete="off"
        required
        maxLength={20}
        placeholder="1.234.567-8"
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        maxLength={254}
      />
      <Field
        label="Teléfono"
        name="phone"
        type="tel"
        autoComplete="tel"
        inputMode="tel"
        required
        maxLength={40}
        placeholder="+598 9X XXX XXX"
      />

      {/* Honeypot — invisible to humans, attractive to bots */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-0 w-0 overflow-hidden">
        <label>
          No completar
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {status.kind === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {status.message}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-medium text-background transition hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Enviando…" : "Registrar entrega"}
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

function Field({
  label,
  name,
  type = "text",
  required,
  maxLength,
  placeholder,
  autoComplete,
  inputMode,
}: FieldProps) {
  const id = `f-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-text-secondary">
        {label}
        {required && <span className="ml-1 text-accent">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="rounded-lg border border-border bg-background px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}
