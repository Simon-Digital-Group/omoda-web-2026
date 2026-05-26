import type { ModelFAQ } from "@/lib/model-faqs";

interface ModelFAQProps {
  faqs: ModelFAQ[];
  modelName: string;
}

export default function ModelFAQSection({ faqs, modelName }: ModelFAQProps) {
  if (!faqs.length) return null;

  return (
    <section
      id="faq"
      className="section-padding relative border-t border-white/[0.06]"
      aria-labelledby="faq-heading"
    >
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 reveal-on-scroll">
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
              Preguntas frecuentes
            </p>
            <h2
              id="faq-heading"
              className="text-section font-michroma font-bold text-white"
            >
              Sobre el {modelName}
            </h2>
          </div>

          <div className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group reveal-on-scroll"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <summary
                  className="flex items-start justify-between gap-6 py-5 cursor-pointer list-none
                             hover:text-white transition-colors
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <h3 className="text-base sm:text-lg font-medium text-white pr-4 flex-1">
                    {faq.question}
                  </h3>
                  <span
                    className="flex-shrink-0 w-6 h-6 mt-1 flex items-center justify-center
                               rounded-full border border-white/[0.2]
                               text-text-secondary text-lg leading-none
                               group-open:rotate-45 group-open:border-accent group-open:text-accent
                               transition-all"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-5 -mt-1 text-sm sm:text-base text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
