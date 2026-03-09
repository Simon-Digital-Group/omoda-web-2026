import { MapPin, Phone, Mail, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NetworkLocation } from "@/lib/network-data";

interface LocationCardProps {
  location: NetworkLocation;
  accentClass?: string;
}

export default function LocationCard({
  location,
  accentClass = "text-accent",
}: LocationCardProps) {
  return (
    <div className="glass group p-6 flex flex-col gap-4 hover:bg-white/[0.06] hover:border-white/[0.10] transition-all duration-300">
      {/* Name + department */}
      <div>
        <span
          className={cn(
            "inline-block text-[10px] font-semibold tracking-[0.15em] uppercase mb-2",
            accentClass
          )}
        >
          {location.department}
          {location.city ? ` · ${location.city}` : ""}
        </span>
        <h3 className="text-base font-semibold text-white leading-snug">
          {location.name}
        </h3>
      </div>

      {/* Details */}
      <div className="space-y-2.5 text-sm text-text-secondary">
        <div className="flex items-start gap-2.5">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-text-muted" />
          <span>{location.address}</span>
        </div>

        {location.phone && (
          <div className="flex items-center gap-2.5">
            <Phone className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" />
            <a
              href={`tel:${location.phone.replace(/\s/g, "")}`}
              className="hover:text-white transition-colors"
            >
              {location.phone}
            </a>
          </div>
        )}

        <div className="flex items-center gap-2.5">
          <Mail className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" />
          <a
            href={`mailto:${location.email}`}
            className="hover:text-white transition-colors truncate"
          >
            {location.email}
          </a>
        </div>

        {location.contact && (
          <div className="flex items-center gap-2.5">
            <User className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" />
            <span>{location.contact}</span>
          </div>
        )}

        {location.hours && (
          <div className="flex items-center gap-2.5">
            <Clock className="w-3.5 h-3.5 flex-shrink-0 text-text-muted" />
            <span>{location.hours}</span>
          </div>
        )}
      </div>
    </div>
  );
}
