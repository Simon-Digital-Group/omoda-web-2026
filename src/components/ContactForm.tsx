"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle, AlertCircle } from "lucide-react";
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
    <section ref={ref} id="contacto" className="section-padding relative border-t border-white/[0.06]">

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative container-custom"
      >
        {/* Header — direct, no fluff */}
        <motion.div variants={fadeInUp} className="mb-16 max-w-xl">
          <h2 className="text-section font-michroma font-bold text-white mb-4">
            Test Drive
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Dejanos tus datos y un asesor se comunicará contigo para coordinar
            una experiencia de manejo personalizada.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.form
            variants={fadeInUp}
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass p-5 sm:p-8 md:p-10"
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
                <label htmlFor="model" className="block text-sm text-text-secondary mb-2">
                  Modelo de interés
                </label>
                <select
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                             text-white text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/40
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
              <label htmlFor="message" className="block text-sm text-text-secondary mb-2">
                Mensaje (opcional)
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="¿Tenés alguna consulta específica?"
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                           text-white text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/40
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
              {status === "submitting" ? "Enviando..." : "Agendar Test Drive"}
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
            <div className="glass p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Teléfono</h3>
              <p className="text-sm text-text-secondary">{SITE_CONFIG.phone}</p>
            </div>

            <div className="glass p-4 sm:p-6">
              <h3 className="text-sm font-semibold text-white mb-1">Email</h3>
              <p className="text-sm text-text-secondary">{SITE_CONFIG.email}</p>
            </div>
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
      <label htmlFor={name} className="block text-sm text-text-secondary mb-2">{label}</label>
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3
                   text-white text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/40
                   transition-colors duration-300 placeholder:text-text-muted"
      />
    </div>
  );
}
