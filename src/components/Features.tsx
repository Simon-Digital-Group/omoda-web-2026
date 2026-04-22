const FEATURES = [
  {
    title: "Tecnología Inteligente",
    description:
      "Pantallas de alta resolución, asistente de voz AI y conectividad total con tu smartphone.",
  },
  {
    title: "Seguridad Avanzada",
    description:
      "Suite completa de asistencias a la conducción: ADAS nivel 2, frenado autónomo y más.",
  },
  {
    title: "Eficiencia Superior",
    description:
      "Motorizaciones eficientes con opciones eléctricas e híbridas para cada necesidad.",
  },
  {
    title: "Rendimiento Premium",
    description:
      "Suspensión independiente, dirección precisa y potencia que se siente en cada curva.",
  },
  {
    title: "Conectividad Total",
    description:
      "App CarLink-O para controlar tu vehículo desde el teléfono. Carga, clima, ubicación y más.",
  },
  {
    title: "Diseño Audaz",
    description:
      "Líneas que definen una nueva era. Diseño que genera impacto en cada ángulo.",
  },
];

export default function Features() {
  return (
    <section className="section-padding relative overflow-hidden border-t border-white/[0.06]">
      <div className="relative container-custom">
        <div className="mb-16 max-w-2xl reveal-on-scroll">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4">
            Características
          </p>
          <h2 className="text-section font-michroma font-bold text-white mb-4">
            Tecnología que inspira confianza
          </h2>
          <p className="text-text-secondary leading-relaxed">
            Cada modelo integra lo último en innovación automotriz, diseño y seguridad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.title}
              className="reveal-on-scroll group p-5 md:p-8 bg-surface border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
