import type { ModelSEOContent as SeoContent } from "@/lib/model-seo-content";

interface Props {
  content: SeoContent | null;
}

export default function ModelSEOContent({ content }: Props) {
  if (!content) return null;

  return (
    <section
      className="section-padding relative border-t border-white/[0.06]"
      aria-labelledby="seo-content-heading"
    >
      <div className="container-custom max-w-3xl">
        <div className="reveal-on-scroll mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
            {content.sectionLabel}
          </p>
          <h2
            id="seo-content-heading"
            className="text-section font-michroma font-bold text-white leading-tight"
          >
            {content.heading}
          </h2>
        </div>

        <div className="space-y-5">
          {content.paragraphs.map((p, i) => (
            <p
              key={i}
              className="reveal-on-scroll text-base sm:text-lg text-text-secondary leading-relaxed"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
