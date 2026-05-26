/**
 * Extended model data for individual model pages.
 * This will eventually come from Contentful.
 *
 * Content Type "vehicleModelPage" fields:
 *   - model: Reference to vehicleModel
 *   - heroImage: Media (cinematic front/angle shot)
 *   - exteriorHeading: Short Text
 *   - exteriorDescription: Long Text
 *   - exteriorImages: Media[] (gallery)
 *   - interiorHeading: Short Text
 *   - interiorDescription: Long Text
 *   - interiorImages: Media[]
 *   - technologyFeatures: JSON (array of {icon, title, description})
 *   - safetyFeatures: JSON
 *   - specs: JSON (grouped technical specs)
 *   - colors: JSON (array of {name, hex, image})
 *   - powertrainOptions: JSON
 */

export interface ModelColor {
  name: string;
  hex: string;
  image?: string;
}

export interface ModelFeature {
  icon: string; // lucide icon name
  title: string;
  description: string;
  image?: string; // optional image URL — when present, rendered at top of the feature card
}

export interface SpecGroup {
  category: string;
  items: { label: string; value: string }[];
}

export interface PowertrainOption {
  name: string;
  type: "Nafta" | "Eléctrico" | "Híbrido";
  power: string;
  torque: string;
  acceleration?: string;
  consumption?: string;
  range?: string;
  transmission: string;
}

export interface KeyStat {
  value: string; // "430"
  unit: string;  // "km"
  label: string; // "Autonomía WLTP"
}

export interface ModelPageData {
  slug: string;
  name: string;
  brand: "OMODA" | "JAECOO";
  tagline: string;
  heroDescription: string;
  heroImage: string;

  // Key stats — displayed prominently below hero (OMODA UK style)
  keyStats: KeyStat[];

  // Exterior
  exteriorHeading: string;
  exteriorDescription: string;
  exteriorImages: string[];
  exteriorHighlights: string[];

  // Interior
  interiorHeading: string;
  interiorDescription: string;
  interiorImages: string[];
  interiorHighlights: string[];

  // Technology
  technologyFeatures: ModelFeature[];

  // Safety
  safetyFeatures: ModelFeature[];

  // Specs
  specs: SpecGroup[];

  // Colors
  colors: ModelColor[];

  // Powertrain
  powertrainOptions: PowertrainOption[];

  // Price
  price: string;
}

// ---------------------------------------------------------------------------
// Model page data — OMODA 5
// ---------------------------------------------------------------------------
const omoda5: ModelPageData = {
  slug: "omoda-5",
  name: "OMODA 5",
  brand: "OMODA",
  tagline: "Diseño que inspira",
  heroDescription:
    "El SUV compacto que redefine la categoría. Un lenguaje de diseño audaz que fusiona la estética futurista con la ingeniería de precisión.",
  heroImage: "/images/models/omoda-5-hero.jpg",

  keyStats: [
    { value: "156", unit: "CV", label: "Potencia" },
    { value: "230", unit: "Nm", label: "Torque" },
    { value: "9.5", unit: "s", label: "0–100 km/h" },
    { value: "4.400", unit: "mm", label: "Longitud" },
  ],

  exteriorHeading: "Exterior que deja huella",
  exteriorDescription:
    "Líneas aerodinámicas, faros LED de firma luminosa distintiva, parrilla sin bordes y manijas semi-ocultas crean una silueta limpia y dinámica. Cada ángulo del OMODA 5 comunica movimiento y modernidad.",
  exteriorImages: [
    "/images/models/omoda-5-ext-1.jpg",
    "/images/models/omoda-5-ext-2.jpg",
    "/images/models/omoda-5-ext-3.jpg",
  ],
  exteriorHighlights: [
    "Faros LED full con firma luminosa",
    "Parrilla sin bordes integrada",
    "Manijas de puerta semi-ocultas",
    "Techo panorámico",
  ],

  interiorHeading: "Interior que eleva cada viaje",
  interiorDescription:
    "Iluminación ambiental, panel de instrumentos flotante y asientos sport-inspired elevan cada trayecto. Materiales premium y atención al detalle en cada superficie.",
  interiorImages: [
    "/images/models/omoda-5-int-1.jpg",
    "/images/models/omoda-5-int-2.jpg",
    "/images/models/omoda-5-int-3.jpg",
  ],
  interiorHighlights: [
    "Pantalla táctil de 12.3 pulgadas",
    "Iluminación ambiental 64 colores",
    "Asientos deportivos con soporte lumbar",
    "Cargador inalámbrico",
  ],

  technologyFeatures: [
    {
      icon: "Monitor",
      title: "Pantalla HD de 12.3\"",
      description:
        "Sistema multimedia con conectividad Apple CarPlay y Android Auto inalámbrico.",
    },
    {
      icon: "Mic",
      title: "Asistente de Voz AI",
      description:
        "Control por voz inteligente para clima, navegación, entretenimiento y más.",
    },
    {
      icon: "Smartphone",
      title: "App CarLink-O",
      description:
        "Controlá tu vehículo desde el celular: ubicación, clima, carga y alertas de seguridad.",
    },
    {
      icon: "Wifi",
      title: "Conectividad Total",
      description:
        "Wi-Fi a bordo, actualizaciones OTA y ecosistema digital integrado.",
    },
  ],

  safetyFeatures: [
    {
      icon: "ShieldCheck",
      title: "ADAS Nivel 2",
      description:
        "Suite completa de asistencias: frenado autónomo, alerta de cambio de carril, control de crucero adaptativo.",
    },
    {
      icon: "Eye",
      title: "Monitoreo 360°",
      description:
        "Cámaras perimetrales con visión surround para maniobras seguras.",
    },
    {
      icon: "Lock",
      title: "Estructura Reforzada",
      description:
        "Carrocería de acero de alta resistencia con zonas de deformación programada.",
    },
    {
      icon: "Heart",
      title: "6 Airbags",
      description:
        "Protección integral para todos los ocupantes con 6 airbags de serie.",
    },
  ],

  specs: [
    {
      category: "Dimensiones",
      items: [
        { label: "Largo", value: "4.400 mm" },
        { label: "Ancho", value: "1.830 mm" },
        { label: "Alto", value: "1.588 mm" },
        { label: "Distancia entre ejes", value: "2.630 mm" },
        { label: "Capacidad de baúl", value: "360 / 1.075 L" },
      ],
    },
    {
      category: "Motor",
      items: [
        { label: "Tipo", value: "1.5T Turbo" },
        { label: "Potencia", value: "156 CV" },
        { label: "Torque", value: "230 Nm" },
        { label: "Transmisión", value: "CVT / 7DCT" },
        { label: "Tracción", value: "Delantera" },
      ],
    },
    {
      category: "Rendimiento",
      items: [
        { label: "Velocidad máxima", value: "190 km/h" },
        { label: "0-100 km/h", value: "9.5 s" },
        { label: "Consumo mixto", value: "6.9 L/100km" },
      ],
    },
  ],

  colors: [
    { name: "Pearl White", hex: "#F5F5F0" },
    { name: "Obsidian Black", hex: "#1A1A1A" },
    { name: "Cosmos Grey", hex: "#6B6B6B" },
    { name: "Aurora Blue", hex: "#2E5090" },
    { name: "Sunset Orange", hex: "#D4602A" },
  ],

  powertrainOptions: [
    {
      name: "1.5T Turbo",
      type: "Nafta",
      power: "156 CV",
      torque: "230 Nm",
      acceleration: "9.5s (0-100)",
      consumption: "6.9 L/100km",
      transmission: "CVT Automática",
    },
  ],

  price: "Desde USD 29.990",
};

// ---------------------------------------------------------------------------
// Model page data — OMODA E5
// ---------------------------------------------------------------------------
const omodaE5: ModelPageData = {
  slug: "omoda-e5",
  name: "OMODA E5",
  brand: "OMODA",
  tagline: "Energía sin límites",
  heroDescription:
    "100% eléctrico, 100% premium. Autonomía excepcional, carga ultrarrápida y la experiencia de conducción que define el futuro.",
  heroImage: "/images/models/omoda-e5-hero.jpg",

  keyStats: [
    { value: "204", unit: "CV", label: "Potencia" },
    { value: "430", unit: "km", label: "Autonomía WLTP" },
    { value: "28", unit: "min", label: "Carga 30→80%" },
    { value: "340", unit: "Nm", label: "Torque" },
  ],

  exteriorHeading: "Diseño eléctrico, impacto visual",
  exteriorDescription:
    "El OMODA E5 reinterpreta el diseño del C5 con una estética puramente eléctrica. Parrilla cerrada, líneas aerodinámicas optimizadas y detalles en turquesa que comunican su naturaleza 100% eléctrica.",
  exteriorImages: [
    "/images/models/omoda-e5-ext-1.jpg",
    "/images/models/omoda-e5-ext-2.jpg",
  ],
  exteriorHighlights: [
    "Parrilla cerrada aerodinámica",
    "Detalles cromados turquesa EV",
    "Coeficiente aerodinámico Cd 0.29",
    "Llantas de diseño aerodinámico",
  ],

  interiorHeading: "Cabina del futuro",
  interiorDescription:
    "Espacio, silencio y tecnología. El interior del E5 maximiza el confort con materiales reciclados premium y una experiencia digital inmersiva.",
  interiorImages: [
    "/images/models/omoda-e5-int-1.jpg",
    "/images/models/omoda-e5-int-2.jpg",
  ],
  interiorHighlights: [
    "Pantalla dual de 12.3\" + 15.6\"",
    "Materiales reciclados premium",
    "NVH ultra-silencioso",
    "Modo de descanso con asientos reclinables",
  ],

  technologyFeatures: [
    {
      icon: "Battery",
      title: "Carga Rápida DC",
      description: "Del 30% al 80% en solo 28 minutos con carga rápida DC de 80kW.",
    },
    {
      icon: "Gauge",
      title: "Autonomía Real",
      description: "Hasta 430 km de autonomía WLTP con batería de 61 kWh.",
    },
    {
      icon: "Smartphone",
      title: "App CarLink-O",
      description: "Monitoreo de carga, preclimatización y localización desde tu celular.",
    },
    {
      icon: "Zap",
      title: "Frenado Regenerativo",
      description: "Recuperación de energía en 3 niveles ajustables y modo One Pedal.",
    },
  ],

  safetyFeatures: [
    {
      icon: "ShieldCheck",
      title: "ADAS Nivel 2+",
      description: "Frenado autónomo, mantenimiento de carril, detección de peatones y ciclistas.",
    },
    {
      icon: "Eye",
      title: "Visión 360°",
      description: "Cámaras de alta definición con vista surround y sensor de punto ciego.",
    },
    {
      icon: "Lock",
      title: "Protección de Batería",
      description: "Batería con estructura de protección IP67 y gestión térmica inteligente.",
    },
    {
      icon: "Heart",
      title: "6 Airbags",
      description: "Protección integral con 6 airbags de serie y cortina lateral.",
    },
  ],

  specs: [
    {
      category: "Dimensiones",
      items: [
        { label: "Largo", value: "4.424 mm" },
        { label: "Ancho", value: "1.830 mm" },
        { label: "Alto", value: "1.588 mm" },
        { label: "Distancia entre ejes", value: "2.630 mm" },
        { label: "Capacidad de baúl", value: "380 L" },
      ],
    },
    {
      category: "Tren Motriz",
      items: [
        { label: "Motor", value: "Eléctrico síncrono permanente" },
        { label: "Potencia", value: "204 CV" },
        { label: "Torque", value: "340 Nm" },
        { label: "Batería", value: "61 kWh (LFP)" },
        { label: "Autonomía WLTP", value: "430 km" },
      ],
    },
    {
      category: "Carga",
      items: [
        { label: "Carga rápida DC", value: "30-80% en 28 min" },
        { label: "Carga AC", value: "0-100% en 7.5 h (7kW)" },
        { label: "Conector", value: "CCS Tipo 2" },
      ],
    },
  ],

  colors: [
    { name: "Glacier White", hex: "#F0F0F0" },
    { name: "Deep Black", hex: "#111111" },
    { name: "Ocean Blue", hex: "#1E4D8C" },
    { name: "Aurora Green", hex: "#2D7E5E" },
  ],

  powertrainOptions: [
    {
      name: "Electric Single Motor",
      type: "Eléctrico",
      power: "204 CV",
      torque: "340 Nm",
      acceleration: "7.9s (0-100)",
      range: "430 km WLTP",
      transmission: "Directa (single speed)",
    },
  ],

  price: "Desde USD 35.990",
};

// ---------------------------------------------------------------------------
// Shortened entries for JAECOO models (same structure, key data)
// ---------------------------------------------------------------------------
const jaecoo5: ModelPageData = {
  slug: "jaecoo-5",
  name: "JAECOO 5",
  brand: "JAECOO",
  tagline: "Aventura premium",
  heroDescription:
    "Robusto, elegante y capaz. El JAECOO 5 combina lo mejor del off-road con el confort de un SUV premium.",
  heroImage: "/images/models/jaecoo-5-hero.jpg",
  keyStats: [
    { value: "156", unit: "CV", label: "Potencia" },
    { value: "230", unit: "Nm", label: "Torque" },
    { value: "9.8", unit: "s", label: "0–100 km/h" },
    { value: "2.672", unit: "mm", label: "Entre ejes" },
  ],
  exteriorHeading: "Carácter robusto, líneas refinadas",
  exteriorDescription:
    "El JAECOO 5 proyecta solidez desde cada ángulo. Proporciones musculosas, protecciones inferiores y una presencia que impone respeto en cualquier terreno.",
  exteriorImages: ["/images/models/jaecoo-5-ext-1.jpg", "/images/models/jaecoo-5-ext-2.jpg"],
  exteriorHighlights: ["Protecciones inferiores off-road", "Barras de techo funcionales", "Faros LED matrix", "Distancia al suelo elevada"],
  interiorHeading: "Confort sin concesiones",
  interiorDescription:
    "Interior premium con materiales nobles, espacio generoso y tecnología intuitiva. Preparado para la aventura sin resignar lujo.",
  interiorImages: ["/images/models/jaecoo-5-int-1.jpg", "/images/models/jaecoo-5-int-2.jpg"],
  interiorHighlights: ["Tapizado de cuero Nappa", "Pantalla de 12.3\"", "Climatización bizona", "Asientos con ventilación"],
  technologyFeatures: [
    { icon: "Monitor", title: "Display Dual", description: "Instrumentos digitales + pantalla multimedia de 12.3\" con conectividad total." },
    { icon: "Mountain", title: "Modos de Conducción", description: "Modos Eco, Comfort, Sport y Off-Road para cada tipo de terreno." },
    { icon: "Smartphone", title: "CarLink-O", description: "Control remoto del vehículo desde tu smartphone." },
    { icon: "Volume2", title: "Audio Premium", description: "Sistema de sonido de alta fidelidad con 8 parlantes." },
  ],
  safetyFeatures: [
    { icon: "ShieldCheck", title: "ADAS Completo", description: "Frenado autónomo, alerta de colisión frontal y trasera, control de crucero adaptativo." },
    { icon: "Eye", title: "Cámaras 360°", description: "Visión completa para maniobras seguras en cualquier situación." },
    { icon: "Lock", title: "Carrocería HSSE", description: "Acero de ultra alta resistencia para máxima protección estructural." },
    { icon: "Heart", title: "6 Airbags", description: "Airbags frontales, laterales y de cortina de serie." },
  ],
  specs: [
    { category: "Dimensiones", items: [{ label: "Largo", value: "4.400 mm" }, { label: "Ancho", value: "1.860 mm" }, { label: "Alto", value: "1.680 mm" }, { label: "Dist. entre ejes", value: "2.672 mm" }, { label: "Baúl", value: "410 L" }] },
    { category: "Motor", items: [{ label: "Tipo", value: "1.5T Turbo" }, { label: "Potencia", value: "156 CV" }, { label: "Torque", value: "230 Nm" }, { label: "Transmisión", value: "7DCT" }, { label: "Tracción", value: "Delantera / AWD" }] },
  ],
  colors: [{ name: "Summit White", hex: "#EDEDED" }, { name: "Night Black", hex: "#151515" }, { name: "Forest Green", hex: "#2B5E3E" }, { name: "Canyon Brown", hex: "#6B4E37" }],
  powertrainOptions: [{ name: "1.5T Turbo", type: "Nafta", power: "156 CV", torque: "230 Nm", acceleration: "9.8s (0-100)", consumption: "7.2 L/100km", transmission: "7DCT Automática" }],
  price: "Desde USD 33.990",
};

const jaecoo6: ModelPageData = {
  slug: "jaecoo-6",
  name: "JAECOO 6",
  brand: "JAECOO",
  tagline: "Potencia y estilo",
  heroDescription: "Un SUV que no hace concesiones. Potencia, espacio y tecnología en un diseño que eleva el segmento.",
  heroImage: "/images/models/jaecoo-6-hero.jpg",
  keyStats: [
    { value: "186", unit: "CV", label: "Potencia" },
    { value: "290", unit: "Nm", label: "Torque" },
    { value: "8.5", unit: "s", label: "0–100 km/h" },
    { value: "4.605", unit: "mm", label: "Longitud" },
  ],
  exteriorHeading: "Presencia imponente",
  exteriorDescription: "El JAECOO 6 combina líneas cortantes con proporciones imponentes. Faros LED de firma compleja y una parrilla tridimensional que define su identidad.",
  exteriorImages: ["/images/models/jaecoo-6-ext-1.jpg", "/images/models/jaecoo-6-ext-2.jpg"],
  exteriorHighlights: ["Parrilla tridimensional", "Faros LED adaptativos", "Portón eléctrico", "Llantas de 19\""],
  interiorHeading: "Espacio premium",
  interiorDescription: "Amplitud de clase superior con segunda fila generosa, acabados premium y tecnología que anticipa tus necesidades.",
  interiorImages: ["/images/models/jaecoo-6-int-1.jpg", "/images/models/jaecoo-6-int-2.jpg"],
  interiorHighlights: ["Pantalla de 15.6\" central", "Asientos eléctricos con memoria", "Techo panorámico", "Iluminación ambiental 128 colores"],
  technologyFeatures: [
    { icon: "Monitor", title: "Pantalla 15.6\"", description: "Display central de gran formato con interfaz fluida y personalizable." },
    { icon: "Mic", title: "Asistente AI", description: "Control por voz natural con inteligencia artificial avanzada." },
    { icon: "Smartphone", title: "Llave Digital", description: "Usá tu celular como llave con NFC y Bluetooth." },
    { icon: "Wifi", title: "OTA Updates", description: "Actualizaciones remotas para siempre tener las últimas funciones." },
  ],
  safetyFeatures: [
    { icon: "ShieldCheck", title: "ADAS L2+", description: "Asistente de autopista con centrado de carril y control de velocidad adaptativo." },
    { icon: "Eye", title: "Visión Nocturna", description: "Cámara infrarroja para detección de peatones y animales en oscuridad." },
    { icon: "Lock", title: "8 Airbags", description: "Protección de 360° con airbags frontales, laterales, cortina y central." },
    { icon: "Heart", title: "Alerta de Fatiga", description: "Sistema de monitoreo de atención del conductor con alertas proactivas." },
  ],
  specs: [
    { category: "Dimensiones", items: [{ label: "Largo", value: "4.605 mm" }, { label: "Ancho", value: "1.890 mm" }, { label: "Alto", value: "1.720 mm" }, { label: "Dist. entre ejes", value: "2.745 mm" }, { label: "Baúl", value: "480 L" }] },
    { category: "Motor", items: [{ label: "Tipo", value: "1.6T Turbo" }, { label: "Potencia", value: "186 CV" }, { label: "Torque", value: "290 Nm" }, { label: "Transmisión", value: "7DCT" }, { label: "Tracción", value: "AWD" }] },
  ],
  colors: [{ name: "Platinum White", hex: "#F0ECE8" }, { name: "Titanium Grey", hex: "#5A5A5A" }, { name: "Sapphire Blue", hex: "#1A3A6A" }, { name: "Volcanic Black", hex: "#0D0D0D" }],
  powertrainOptions: [{ name: "1.6T Turbo", type: "Nafta", power: "186 CV", torque: "290 Nm", acceleration: "8.5s (0-100)", consumption: "7.5 L/100km", transmission: "7DCT Automática" }],
  price: "Desde USD 38.990",
};

const jaecoo7: ModelPageData = {
  slug: "jaecoo-7",
  name: "JAECOO 7",
  brand: "JAECOO",
  tagline: "El insignia",
  heroDescription: "El SUV insignia de JAECOO. Máximo espacio, máxima tecnología, máximo confort en cada kilómetro.",
  heroImage: "/images/models/jaecoo-7-hero.jpg",
  keyStats: [
    { value: "254", unit: "CV", label: "Potencia" },
    { value: "390", unit: "Nm", label: "Torque" },
    { value: "7.5", unit: "s", label: "0–100 km/h" },
    { value: "4.780", unit: "mm", label: "Longitud" },
  ],
  exteriorHeading: "El lenguaje del insignia",
  exteriorDescription: "Proporciones imponentes, iluminación LED de firma exclusiva y una presencia que comunica liderazgo desde cualquier ángulo.",
  exteriorImages: ["/images/models/jaecoo-7-ext-1.jpg", "/images/models/jaecoo-7-ext-2.jpg"],
  exteriorHighlights: ["Iluminación LED de firma exclusiva", "Proporciones SUV full-size", "Doble escape cromado", "Llantas de 20\""],
  interiorHeading: "Lujo que se vive",
  interiorDescription: "Asientos ventilados y calefaccionados, materiales nobles en cada superficie, sistema de sonido premium y una experiencia sensorial completa.",
  interiorImages: ["/images/models/jaecoo-7-int-1.jpg", "/images/models/jaecoo-7-int-2.jpg"],
  interiorHighlights: ["Asientos de cuero Nappa ventilados", "HUD Head-Up Display", "Audio premium 12 parlantes", "Fragancia inteligente a bordo"],
  technologyFeatures: [
    { icon: "Monitor", title: "Triple Display", description: "Instrumentos + central 15.6\" + HUD proyectado en el parabrisas." },
    { icon: "Mic", title: "AI Natural Voice", description: "Asistente de voz con IA que entiende contexto y conversación natural." },
    { icon: "Smartphone", title: "Llave Digital NFC", description: "Abrí y encendé tu vehículo solo con tu smartphone." },
    { icon: "Wind", title: "Fragancia Inteligente", description: "Sistema de aromatización con cápsulas intercambiables." },
  ],
  safetyFeatures: [
    { icon: "ShieldCheck", title: "ADAS L2+ Completo", description: "La suite más completa: autopilot de autopista, estacionamiento remoto, frenado autónomo." },
    { icon: "Eye", title: "DMS + OMS", description: "Monitoreo del conductor y los ocupantes con cámara infrarroja." },
    { icon: "Lock", title: "Carrocería Ultra-HSSE", description: "Acero de ultra alta resistencia > 1500 MPa en zonas críticas." },
    { icon: "Heart", title: "8 Airbags + Cortina", description: "Sistema integral de protección pasiva con 8 bolsas de aire." },
  ],
  specs: [
    { category: "Dimensiones", items: [{ label: "Largo", value: "4.780 mm" }, { label: "Ancho", value: "1.920 mm" }, { label: "Alto", value: "1.750 mm" }, { label: "Dist. entre ejes", value: "2.820 mm" }, { label: "Baúl", value: "530 L" }] },
    { category: "Motor", items: [{ label: "Tipo", value: "2.0T Turbo" }, { label: "Potencia", value: "254 CV" }, { label: "Torque", value: "390 Nm" }, { label: "Transmisión", value: "9AT" }, { label: "Tracción", value: "AWD Inteligente" }] },
  ],
  colors: [{ name: "Pearl White", hex: "#F5F5F0" }, { name: "Graphite Black", hex: "#1A1A1A" }, { name: "Royal Blue", hex: "#1E3A6E" }, { name: "Burgundy Red", hex: "#6B1F2A" }, { name: "Desert Gold", hex: "#A68B5C" }],
  powertrainOptions: [
    { name: "2.0T Turbo", type: "Nafta", power: "254 CV", torque: "390 Nm", acceleration: "7.5s (0-100)", consumption: "8.2 L/100km", transmission: "9AT Automática" },
    { name: "1.5T Super Hybrid", type: "Híbrido", power: "326 CV (combinados)", torque: "525 Nm", consumption: "1.5 L/100km", range: "1.200 km total", transmission: "DHT Híbrida" },
  ],
  price: "Desde USD 44.990",
};

// ---------------------------------------------------------------------------
// Export all models indexed by slug
// ---------------------------------------------------------------------------
export const MODEL_PAGES: Record<string, ModelPageData> = {
  "omoda-5": omoda5,
  "omoda-e5": omodaE5,
  "jaecoo-5": jaecoo5,
  "jaecoo-6": jaecoo6,
  "jaecoo-7": jaecoo7,
};

export const ALL_MODEL_SLUGS = Object.keys(MODEL_PAGES);
