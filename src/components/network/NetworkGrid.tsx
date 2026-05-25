"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import LocationCard from "./LocationCard";
import type { NetworkLocation } from "@/lib/network-data";

interface NetworkGridProps {
  locations: NetworkLocation[];
  departments: string[];
  accentClass?: string;
}

export default function NetworkGrid({
  locations,
  departments,
  accentClass = "text-accent",
}: NetworkGridProps) {
  const [activeDept, setActiveDept] = useState<string>("Todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return locations.filter((loc) => {
      const matchesDept =
        activeDept === "Todos" || loc.department === activeDept;
      const q = query.toLowerCase();
      const matchesQuery =
        !q ||
        loc.name.toLowerCase().includes(q) ||
        loc.department.toLowerCase().includes(q) ||
        loc.address.toLowerCase().includes(q) ||
        (loc.city ?? "").toLowerCase().includes(q);
      return matchesDept && matchesQuery;
    });
  }, [locations, activeDept, query]);

  const allDepts = ["Todos", ...departments];

  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState, allDepts.length]);

  const scrollByStep = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(200, el.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative w-full md:w-80 md:flex-shrink-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por nombre, ciudad…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full
                       pl-11 pr-5 py-2.5 text-sm text-white placeholder:text-text-muted
                       focus:outline-none focus:border-white/[0.18] transition-colors"
          />
        </div>

        {/* Department filter — carets sit alongside the scrollable pill row */}
        <div className="flex items-center gap-2 min-w-0 md:flex-1">
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scrollByStep(-1)}
              aria-label="Ver filtros anteriores"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full
                         bg-white/[0.04] border border-white/[0.08] text-white
                         hover:bg-white/[0.08] hover:border-white/[0.18] transition-colors duration-200"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          <div
            ref={scrollerRef}
            className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth min-w-0 flex-1"
          >
            {allDepts.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-200",
                  activeDept === dept
                    ? "bg-accent text-background"
                    : "bg-white/[0.04] text-text-secondary border border-white/[0.06] hover:bg-white/[0.08] hover:text-white"
                )}
              >
                {dept}
              </button>
            ))}
          </div>

          {canScrollRight && (
            <button
              type="button"
              onClick={() => scrollByStep(1)}
              aria-label="Ver más filtros"
              className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full
                         bg-white/[0.04] border border-white/[0.08] text-white
                         hover:bg-white/[0.08] hover:border-white/[0.18] transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-text-muted mb-6">
        {filtered.length} {filtered.length === 1 ? "ubicación" : "ubicaciones"}
        {activeDept !== "Todos" ? ` en ${activeDept}` : ""}
      </p>

      {/* Cards grid */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((loc, i) => (
            <motion.div
              key={`${loc.name}-${loc.department}-${loc.address}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <LocationCard location={loc} accentClass={accentClass} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-text-muted">
          <p className="text-lg">Sin resultados para "{query}"</p>
          <button
            onClick={() => { setQuery(""); setActiveDept("Todos"); }}
            className="mt-4 text-sm text-accent hover:underline"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}
