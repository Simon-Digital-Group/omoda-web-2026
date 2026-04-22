"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const STORAGE_KEY = "oj_cookie_consent_v1";

type Consent = "accepted" | "rejected" | null;

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(STORAGE_KEY) as Consent;
    if (stored === "accepted" || stored === "rejected") {
      setConsent(stored);
      applyConsent(stored);
    }
  }, []);

  const applyConsent = (value: Consent) => {
    if (typeof window === "undefined") return;
    const w = window as any;
    if (w.gtag) {
      w.gtag("consent", "update", {
        ad_storage: value === "accepted" ? "granted" : "denied",
        analytics_storage: value === "accepted" ? "granted" : "denied",
        ad_user_data: value === "accepted" ? "granted" : "denied",
        ad_personalization: value === "accepted" ? "granted" : "denied",
      });
    }
  };

  const save = (value: "accepted" | "rejected") => {
    localStorage.setItem(STORAGE_KEY, value);
    setConsent(value);
    applyConsent(value);
  };

  if (!mounted || consent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 right-0 z-[60] px-4 pb-4 pointer-events-none"
        role="dialog"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-desc"
      >
        <div
          className="pointer-events-auto max-w-4xl mx-auto bg-surface/95 backdrop-blur-xl
                     border border-white/[0.08] rounded-2xl p-5 sm:p-6
                     shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]
                     flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
        >
          <div className="flex-1">
            <h2
              id="cookie-title"
              className="text-sm font-semibold text-white mb-1"
            >
              Utilizamos cookies
            </h2>
            <p
              id="cookie-desc"
              className="text-xs sm:text-sm text-text-secondary leading-relaxed"
            >
              Usamos cookies propias y de terceros para analizar el tráfico,
              personalizar contenido y mejorar tu experiencia. Al aceptar, nos
              ayudás a entender cómo usás el sitio.{" "}
              <Link
                href="/politica-de-privacidad"
                className="text-accent hover:text-white transition-colors underline underline-offset-2"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={() => save("rejected")}
              className="flex-1 md:flex-none px-4 py-2.5 text-sm text-text-secondary
                         border border-white/[0.1] rounded-xl hover:border-white/[0.2]
                         hover:text-white transition-all"
            >
              Rechazar
            </button>
            <button
              onClick={() => save("accepted")}
              className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-background
                         bg-accent rounded-xl hover:bg-accent/90 transition-all"
            >
              Aceptar
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
