"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, CheckCircle, AlertCircle, MapPin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { VEHICLE_MODELS, SITE_CONFIG } from "@/lib/data";

type FormStatus = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [status, setStatus] = useState<FormStatus>("idle");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    model: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // POST to Next.js API route
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ fullName: "", email: "", phone: "", model: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section ref={ref} id="contacto" className="section-padding relative">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/[0.03] rounded-full blur-[150px]" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm text-text-muted uppercase tracking-widest mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            Contacto
            <span className="w-8 h-[1px] bg-accent" />
          </span>
          <h2 className="text-section font-bold text-white mb-4">
            Solicitá tu{" "}
            <span className="gradient-text">test drive</span>
          </h2>
          <p className="text-subtitle text-text-secondary max-w-2xl mx-auto">
            Dejanos tus datos y un asesor se comunicará contigo para coordinar
            una experiencia de manejo personalizada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass p-8 md:p-10"
          >
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <InputField
                label="Nombre completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Juan Pérez"
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="juan@email.com"
              />
              <InputField
                label="Teléfono"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+598 99 123 456"
              />
              <div>
                <label className="block text-sm text-text-secondary mb-2">
                  Modelo de interés
                </label>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                             text-white text-sm outline-none focus:border-accent/50
                             transition-colors duration-300 appearance-none cursor-pointer"
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
              <label className="block text-sm text-text-secondary mb-2">
                Mensaje (opcional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="¿Tenés alguna consulta específica?"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                           text-white text-sm outline-none focus:border-accent/50
                           transition-colors duration-300 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className={cn(
                "btn-primary w-full justify-center text-base",
                status === "submitting" && "opacity-70 cursor-not-allowed"
              )}
            >
              {status === "submitting" ? (
                "Enviando..."
              ) : (
                <>
                  Enviar Solicitud
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Status messages */}
            {status === "success" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-accent text-sm mt-4"
              >
                <CheckCircle className="w-4 h-4" />
                ¡Gracias! Nos pondremos en contacto pronto.
              </motion.p>
            )}
            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm mt-4"
              >
                <AlertCircle className="w-4 h-4" />
                Ocurrió un error. Por favor intentá nuevamente.
              </motion.p>
            )}
          </motion.form>

          {/* Contact info sidebar */}
          <motion.div
            variants={fadeInUp}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="glass p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/[0.08] border border-accent/[0.15] flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Concesionario</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {SITE_CONFIG.address}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/[0.08] border border-accent/[0.15] flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Teléfono</h3>
                  <p className="text-sm text-text-secondary">{SITE_CONFIG.phone}</p>
                </div>
              </div>
            </div>

            <div className="glass p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/[0.08] border border-accent/[0.15] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Email</h3>
                  <p className="text-sm text-text-secondary">{SITE_CONFIG.email}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={SITE_CONFIG.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="glass p-6 flex items-center gap-4 group hover:bg-white/[0.06]
                         hover:border-green-500/20 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white mb-0.5">WhatsApp</h3>
                <p className="text-sm text-text-secondary group-hover:text-green-400 transition-colors">
                  Chateá con nosotros
                </p>
              </div>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/** Reusable input field */
function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm text-text-secondary mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                   text-white text-sm outline-none focus:border-accent/50
                   transition-colors duration-300 placeholder:text-text-muted"
      />
    </div>
  );
}
