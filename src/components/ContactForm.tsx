"use client";

import { useState, useRef, useEffect } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { VEHICLE_MODELS, SITE_CONFIG } from "@/lib/data";

type FormStatus = "idle" | "submitting" | "success" | "error";

// Small replacement for framer-motion's useInView. Fires once when the
// element enters the viewport, then disconnects. Avoids hydrating the
// ~20KB framer-motion runtime just for an entry animation.
function useInViewOnce<T extends Element>(rootMargin = "-100px"): [React.RefObject<T>, boolean] {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced-motion users see the content immediately, no fade.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return [ref, inView];
}

export default function ContactForm() {
  const [ref, isInView] = useInViewOnce<HTMLElement>("-100px");
  const mountedAt = useRef(Date.now());
  const [errorMessage, setErrorMessage] = useState("");

  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    model: "",
    message: "",
    website: "", // honeypot
  });

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const pushEvent = (event: string, data: Record<string, any> = {}) => {
    if (typeof window === "undefined") return;
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).dataLayer.push({ event, ...data });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    pushEvent("lead_submit_attempt", { model: formData.model || "none" });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          submittedAt: mountedAt.current,
        }),
      });

      if (res.ok) {
        setStatus("success");
        pushEvent("lead_submit_success", {
          model: formData.model || "none",
          form_location: "home_contact",
        });
        setFormData({ fullName: "", email: "", phone: "", model: "", message: "", website: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMessage(data.error || "Ocurrió un error. Intentá nuevamente.");
        setStatus("error");
        pushEvent("lead_submit_error", { status: res.status });
      }
    } catch {
      setErrorMessage("No se pudo conectar con el servidor. Intentá nuevamente.");
      setStatus("error");
      pushEvent("lead_submit_error", { status: "network" });
    }
  };

  // Single fade-up on first intersection. Children inherit the transition
  // via the parent state instead of running per-child stagger animations.
  const reveal = isInView
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-6";

  return (
    <section ref={ref} id="contacto" className="section-padding relative border-t border-white/[0.06]">
      <div
        className={cn(
          "relative container-custom transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none",
          reveal,
        )}
      >
        <div className="mb-16 max-w-xl">
          <h2 className="text-section font-michroma font-bold text-white mb-4">
            Test Drive
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Dejanos tus datos y un asesor se comunicará contigo para coordinar
            una experiencia de manejo personalizada.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass p-5 sm:p-8 md:p-10"
            noValidate
          >
            {/* Honeypot — hidden from users, visible to bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", opacity: 0 }}
            />

            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <InputField
                label="Nombre completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
                autoComplete="name"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="juan@email.com"
                autoComplete="email"
                inputMode="email"
              />
              <InputField
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+598 99 123 456"
                autoComplete="tel"
                inputMode="tel"
              />
              <div>
                <label htmlFor="model" className="block text-sm text-text-secondary mb-2">
                  Modelo de interés <span className="text-text-muted font-normal">(opcional)</span>
                </label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                             text-white text-base sm:text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/40
                             transition-colors duration-300 appearance-none cursor-pointer min-h-[44px]"
                >
                  <option value="" className="bg-surface">
                    Seleccionar modelo
                  </option>
                  {VEHICLE_MODELS.map((m) => (
                    <option key={m.slug} value={m.name} className="bg-surface">
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm text-text-secondary mb-2">
                Mensaje <span className="text-text-muted font-normal">(opcional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
                placeholder="¿Tenés alguna consulta específica?"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                           text-white text-base sm:text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/40
                           transition-colors duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              aria-busy={status === "submitting"}
              className={cn(
                "btn-primary w-full justify-center text-base min-h-[48px]",
                status === "submitting" && "opacity-70 cursor-not-allowed"
              )}
            >
              {status === "submitting" ? "Enviando..." : "Agendar Test Drive"}
            </button>

            {/* Live region for status */}
            <div role="status" aria-live="polite" aria-atomic="true" className="mt-4">
              {status === "success" && (
                <p className="flex items-center gap-2 text-accent text-sm">
                  <CheckCircle className="w-4 h-4" aria-hidden="true" />
                  ¡Gracias! Nos pondremos en contacto pronto.
                </p>
              )}
              {status === "error" && (
                <p className="flex items-center gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  {errorMessage || "Ocurrió un error. Por favor intentá nuevamente."}
                </p>
              )}
            </div>
          </form>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="glass p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Teléfono</h3>
              <p className="text-sm text-text-secondary">
                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {SITE_CONFIG.phone}
                </a>
              </p>
            </div>

            <div className="glass p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Email</h3>
              <p className="text-sm text-text-secondary">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="hover:text-white transition-colors break-all"
                >
                  {SITE_CONFIG.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "email" | "tel" | "text" | "numeric" | "search" | "url";
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm text-text-secondary mb-2">
        {label}
        {required && <span className="sr-only"> (requerido)</span>}
        {required && <span aria-hidden="true" className="text-accent ml-0.5">*</span>}
      </label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        aria-required={required || undefined}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={type === "email" ? 254 : 120}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                   text-white text-base sm:text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/40
                   transition-colors duration-300 placeholder:text-text-muted min-h-[44px]"
      />
    </div>
  );
}
