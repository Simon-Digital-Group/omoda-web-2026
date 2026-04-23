"use client";

import { useEffect } from "react";

/**
 * Global click listener that auto-pushes events to dataLayer.
 * Any element with `data-event="event_name"` is tracked on click.
 * Additional `data-event-*` attributes become event params.
 *
 * Example:
 *   <a data-event="whatsapp_click" data-event-location="float" />
 *   → dataLayer.push({ event: "whatsapp_click", event_location: "float" })
 *
 * GTM picks these up via a "Custom Event" trigger.
 */
export default function AnalyticsEvents() {
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest<HTMLElement>("[data-event]");
      if (!el) return;
      const eventName = el.dataset.event;
      if (!eventName) return;

      const payload: Record<string, string> = { event: eventName };
      Object.entries(el.dataset).forEach(([k, v]) => {
        if (k === "event" || !v) return;
        if (k.startsWith("event")) {
          const key = k.replace(/^event/, "").replace(/^([A-Z])/, (_, c) => c.toLowerCase());
          payload[`event_${key || "value"}`] = v;
        }
      });

      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(payload);
    };

    document.addEventListener("click", handler, { passive: true });
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
