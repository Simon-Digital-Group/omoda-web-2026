"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
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

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
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

        {/* Department filter — scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
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
