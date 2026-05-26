"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const STORAGE_KEY = "oj_cookie_consent_v1";

type Consent = "accepted" | "rejected" | null;

declare global {
  interface Window {
    __ojConsentResolved?: boolean;
    gtag?: (...args: any[]) => void;
  }
}

export default function CookieBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const rejectRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Consent;
      if (stored === "accepted" || stored === "rejected") {
        setConsent(stored);
        applyConsent(stored);
        window.__ojConsentResolved = true;
      }
    } catch {
      // localStorage may be unavailable (privacy mode, etc.)
    }
  }, []);

  const applyConsent = (value: Consent) => {
    if (typeof window === "undefined") return;
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage: value === "accepted" ? "granted" : "denied",
        analytics_storage: value === "accepted" ? "granted" : "denied",
        ad_user_data: value === "accepted" ? "granted" : "denied",
        ad_personalization: value === "accepted" ? "granted" : "denied",
      });
    }
  };

  const save = (value: "accepted" | "rejected") => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    setConsent(value);
    applyConsent(value);
    if (typeof window !== "undefined") window.__ojConsentResolved = true;
    // Notify WhatsApp float to return to default position
    window.dispatchEvent(new CustomEvent("oj-consent-resolved"));
  };

  // Move focus + trap focus + Escape handler
  const showing = mounted && !consent;
  useEffect(() => {
    if (!showing) return;
    acceptRef.current?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        save("rejected");
      } else if (e.key === "Tab") {
        const focusables = [rejectRef.current, acceptRef.current].filter(Boolean) as HTMLElement[];
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showing]);

  if (!showing) return null;

  return (
    <div
      className="fixed left-0 right-0 z-[60] px-4 pointer-events-none animate-[slide-up_0.4s_ease-out] motion-reduce:animate-none"
      style={{ bottom: "max(1rem, env(safe-area-inset-bottom))" }}
      role="dialog"
      aria-modal="true"
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
          <h2 id="cookie-title" className="text-sm font-semibold text-white mb-1">
            Utilizamos cookies
          </h2>
          <p id="cookie-desc" className="text-xs sm:text-sm text-text-secondary leading-relaxed">
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
            ref={rejectRef}
            onClick={() => save("rejected")}
            className="flex-1 md:flex-none px-4 py-2.5 text-sm text-text-secondary
                       border border-white/[0.1] rounded-xl hover:border-white/[0.2]
                       hover:text-white transition-all min-h-[44px]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Rechazar
          </button>
          <button
            ref={acceptRef}
            onClick={() => save("accepted")}
            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-background
                       bg-accent rounded-xl hover:bg-accent/90 transition-all min-h-[44px]
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
