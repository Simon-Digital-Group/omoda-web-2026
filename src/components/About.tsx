import AnimatedNumber from "./AnimatedNumber";

const STATS = [
  { value: 40, suffix: "+", label: "Países" },
  { value: 260, suffix: "K+", label: "Unidades vendidas" },
  { value: 2, suffix: "", label: "Años de crecimiento global" },
  { value: 1, suffix: "°", label: "Marca de mayor crecimiento" },
];

export default function About() {
  return (
    <section id="nosotros" className="section-padding relative">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="reveal-on-scroll">
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted mb-4 block">
              Sobre la marca
            </span>
            <h2 className="text-section font-michroma font-bold text-white mb-6">
              Una nueva era <span className="gradient-text">automotriz</span>
            </h2>
            <p className="text-text-secondary leading-relaxed mb-6">
              OMODA &amp; JAECOO nacen en una era de transformación. El automóvil
              ya no es solo un medio de transporte, es el símbolo de un estilo
              de vida. Integramos tecnologías innovadoras en dos líneas
              principales: OMODA, orientada al diseño juvenil y audaz, y
              JAECOO, enfocada en la robustez premium y la aventura.
            </p>
            <p className="text-text-secondary leading-relaxed mb-8">
              Presentes en más de 40 países, somos una de las marcas de más
              rápido crecimiento a escala mundial. Ahora, en Uruguay, con el
              respaldo de Santa Rosa Automotores.
            </p>
            <a href="#contacto" className="btn-outline">
              Conocé más
            </a>
          </div>

          <div className="grid grid-cols-2 gap-5 reveal-on-scroll">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass p-4 sm:p-6 text-center group hover:bg-white/[0.06] transition-all duration-500"
              >
                <p className="text-2xl md:text-4xl font-michroma font-bold text-white mb-1">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-text-muted uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
