/**
 * Long-form, SEO-focused copy per model.
 * 300-500 palabras únicas por modelo: pensada para rankear en búsquedas
 * locales (Uruguay) y dar contexto al comprador antes del test drive.
 *
 * No usar para el hero/descripción corta — eso vive en Contentful.
 * Este content es estático, curado a nivel marca/país.
 */

export interface ModelSEOContent {
  sectionLabel: string;
  heading: string;
  paragraphs: string[];
}

const content: Record<string, ModelSEOContent> = {
  "omoda-5": {
    sectionLabel: "El SUV compacto premium",
    heading: "El OMODA 5 redefine el SUV compacto en Uruguay",
    paragraphs: [
      "El OMODA 5 llega a Uruguay como la opción más audaz dentro de los SUV compactos premium. Con un diseño exterior que rompe esquemas — líneas agresivas, parrilla futurista y una silueta aerodinámica — proyecta presencia desde el primer vistazo. Está pensado para conductores jóvenes, urbanos y exigentes, que buscan un auto que refleje su personalidad sin renunciar a la practicidad de un SUV.",
      "En lo mecánico, el OMODA 5 monta un motor 1.5T Turbo de 156 CV con caja automática 7DCT, combinación ideal para el tráfico montevideano y las rutas del interior. Su consumo eficiente (alrededor de 7.2 L/100km en ciclo combinado) y el respaldo de una garantía oficial lo convierten en una opción racional además de emocional.",
      "Por dentro sorprende: doble pantalla curva de 10.25 pulgadas, asistente de voz con inteligencia artificial, conectividad inalámbrica con Apple CarPlay y Android Auto, y materiales premium en toda la cabina. La suite de seguridad ADAS nivel 2 incluye frenado autónomo de emergencia, control de crucero adaptativo, asistente de permanencia de carril y detección de punto ciego — tecnologías que hasta hace poco estaban reservadas para segmentos mucho más caros.",
      "Dentro del segmento SUV compacto en Uruguay, el OMODA 5 compite directamente con referentes consolidados ofreciendo más tecnología, más equipamiento de serie y un precio competitivo. Es el vehículo ideal para quien usa el auto a diario en la ciudad, viaja en ruta los fines de semana, y no quiere comprometer diseño ni seguridad. Agendá tu test drive en cualquiera de nuestros concesionarios autorizados OMODA en Montevideo y el interior para vivir la experiencia.",
    ],
  },

  "omoda-e5": {
    sectionLabel: "100% eléctrico",
    heading: "OMODA E5: la movilidad eléctrica llega sin concesiones a Uruguay",
    paragraphs: [
      "El OMODA E5 es la versión 100% eléctrica del OMODA 5, diseñada para quienes quieren dar el paso a la movilidad sustentable sin renunciar al equipamiento premium ni a la practicidad de un SUV. Es parte de una nueva generación de vehículos eléctricos pensados para mercados como el uruguayo, donde la infraestructura de carga se expande año a año y los incentivos al auto eléctrico hacen cada vez más atractivo el cambio.",
      "La autonomía supera los 430 km en ciclo WLTP — más que suficiente para recorridos diarios en Montevideo y para viajes a Punta del Este, Colonia o Rocha sin necesidad de recargar. El motor eléctrico entrega potencia instantánea desde cero rpm, lo que se traduce en una aceleración notablemente superior a su equivalente nafta y una experiencia de manejo silenciosa y refinada.",
      "La carga se puede hacer en casa con un cargador doméstico durante la noche, o en estaciones de carga rápida en DC donde recupera hasta 80% en menos de 30 minutos. La app CarLink-O permite monitorear la batería, programar la carga en horarios de tarifa más barata, y pre-climatizar el interior antes de salir — especialmente útil para maximizar autonomía en invierno.",
      "Por dentro, el E5 mantiene el mismo estándar premium que su hermano nafta: doble pantalla curva, materiales de lujo, y la suite completa de asistencias a la conducción ADAS. Para quien busca un auto eléctrico en Uruguay con respaldo de red oficial, garantía extendida en la batería, y talleres autorizados en todo el país, el OMODA E5 es la propuesta más completa de su segmento. Conocé más agendando tu prueba de manejo.",
    ],
  },

  "jaecoo-5": {
    sectionLabel: "SUV premium compacto",
    heading: "JAECOO 5: la puerta de entrada a la experiencia premium",
    paragraphs: [
      "El JAECOO 5 marca el ingreso a la línea JAECOO en Uruguay — la marca hermana de OMODA que se enfoca en robustez, aventura y lujo discreto. Donde OMODA apuesta al diseño audaz y juvenil, JAECOO ofrece una estética más sobria y masculina, con líneas rectas, parrilla imponente y proporciones SUV tradicionales que transmiten solidez.",
      "Su motor 1.5T Turbo de 156 CV, combinado con una caja 7DCT, equilibra eficiencia y respuesta para el uso mixto urbano y rutero. La suspensión está calibrada para una conducción confortable, con aislamiento acústico superior que convierte cada viaje en una experiencia tranquila. Pensado especialmente para familias y profesionales que valoran el espacio interior sin necesidad de un SUV de gran tamaño, el JAECOO 5 ofrece una cabina amplia con materiales premium y detalles cuidados.",
      "El equipamiento incluye pantalla central de 12.3 pulgadas, climatizador bi-zona, llantas de aleación de 18 pulgadas, iluminación LED completa, y la suite de seguridad ADAS con frenado autónomo, control de crucero adaptativo y cámaras 360°. La garantía oficial y la red de talleres autorizados JAECOO en todo Uruguay — desde Montevideo hasta Salto, Rivera y Maldonado — dan tranquilidad de largo plazo.",
      "Para quien busca un SUV premium compacto en Uruguay con diseño diferenciado, equipamiento superior a su rango de precio, y respaldo de marca con presencia global, el JAECOO 5 es una opción a considerar seriamente. Agendá tu test drive y descubrí por qué JAECOO está creciendo rápidamente en el mercado latinoamericano.",
    ],
  },

  "jaecoo-6": {
    sectionLabel: "SUV mediano de carácter",
    heading: "JAECOO 6: potencia, presencia y tecnología para el conductor exigente",
    paragraphs: [
      "El JAECOO 6 se posiciona como el SUV mediano de la línea, dirigido a conductores que buscan más potencia, más espacio y más presencia sin saltar al precio de los grandes SUV premium. Con su motor 1.6T Turbo de 186 CV y 290 Nm de torque, acelera de 0 a 100 km/h en 8.5 segundos — cifras que lo colocan entre los más ágiles de su segmento en el mercado uruguayo.",
      "El diseño exterior combina la robustez característica de JAECOO con detalles deportivos: llantas de 19 pulgadas, techo contrastado bicolor opcional, luces LED adaptativas Matrix, y una parrilla vertical que domina la vista frontal. No pasa desapercibido, y esa es exactamente su intención — es un auto para quien quiere hacer una declaración en la calle sin caer en la ostentación.",
      "En el interior, la segunda fila ofrece espacio sobresaliente para tres adultos cómodamente, con apoyabrazos, climatizador independiente y puertos USB-C. El baúl supera los 500 litros, ideal para viajes largos en familia o para quien usa el auto profesionalmente. La tecnología incluye panel digital de 10.25\", pantalla central táctil de 14.8\", sonido premium de 8 parlantes, techo panorámico, y carga inalámbrica para smartphones.",
      "En materia de seguridad, el paquete ADAS es de los más completos del segmento: asistente de conducción semi-autónoma en ruta, frenado autónomo con detección de peatones y ciclistas, monitor de punto ciego con activación de frenado, y sistema de cámaras 360° con visión transparente. Para un SUV mediano en Uruguay que combine rendimiento, lujo y seguridad de última generación, el JAECOO 6 ofrece una propuesta de valor difícil de igualar. Conocé más agendando tu prueba de manejo en nuestros concesionarios.",
    ],
  },

  "jaecoo-7": {
    sectionLabel: "SUV híbrido enchufable",
    heading: "JAECOO 7 PHEV: el SUV insignia que combina potencia y eficiencia",
    paragraphs: [
      "El JAECOO 7 es el buque insignia de la marca en Uruguay, y llega con tecnología híbrida enchufable (PHEV) — una configuración que hasta hace poco era exclusiva de marcas premium europeas. Combina un motor de combustión con un sistema eléctrico capaz de impulsar el vehículo solo con electricidad para trayectos urbanos, o de sumarse al motor térmico para ofrecer potencia total en viajes largos.",
      "La autonomía en modo eléctrico puro supera los 80 km — suficiente para el uso diario de la mayoría de los conductores uruguayos, que podrían no necesitar cargar nafta durante semanas si cargan la batería en casa por la noche. Para viajes largos a Punta del Este, Colonia o el litoral, el sistema híbrido se activa automáticamente extendiendo la autonomía total a más de 1.000 km sin necesidad de parar a cargar.",
      "El diseño exterior está pensado para ser el más imponente de la línea: frente elevado, líneas horizontales marcadas, llantas de 20 pulgadas, y detalles en cobre o bronce que señalan la versión híbrida sin ser ostentosos. Las luces Matrix LED con firma lumínica personalizable, el techo panorámico que recorre todo el habitáculo, y las puertas con tiradores enrasados completan una estética de SUV premium internacional.",
      "Por dentro, el nivel de equipamiento es el más alto que ofrece JAECOO en Uruguay: asientos con masaje y ventilación, tapicería en cuero Nappa, sistema de sonido Sony de 14 parlantes, cuatro pantallas entre instrumentos, infotainment central, HUD y pantalla para el acompañante. Es, en síntesis, la opción más completa del portafolio — pensada para quien busca el auto de mayor jerarquía de la marca, con el plus de la eficiencia híbrida que reduce costos de uso diarios. Agendá tu test drive del JAECOO 7 PHEV en nuestros concesionarios autorizados para vivir la experiencia en primera persona.",
    ],
  },
};

export function getSeoContent(slug: string): ModelSEOContent | null {
  return content[slug] || null;
}
