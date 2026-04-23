export interface ModelFAQ {
  question: string;
  answer: string;
}

interface FaqInput {
  name: string;
  brand: "OMODA" | "JAECOO";
  price: string;
  fuelType?: string;
}

/**
 * Build SEO-friendly FAQs for a model page.
 * Generic but data-driven — pulls from the model's existing fields so copy
 * stays in sync with price/fuel/brand changes.
 */
export function getModelFaqs(m: FaqInput): ModelFAQ[] {
  const isEV = /eléctric|electric|ev/i.test(m.fuelType || "") || /e5|ev/i.test(m.name);
  const isHybrid = /híbrid|hibrid|hybrid|phev/i.test(m.fuelType || "") || /phev/i.test(m.name);

  const faqs: ModelFAQ[] = [
    {
      question: `¿Cuánto cuesta el ${m.name} en Uruguay?`,
      answer: `El ${m.name} está disponible ${m.price ? m.price.toLowerCase() : "a consultar"}. El precio puede variar según la versión, equipamiento y disponibilidad. Consultá con nuestros asesores para una cotización personalizada.`,
    },
    {
      question: `¿Dónde puedo hacer un test drive del ${m.name}?`,
      answer: `Podés agendar tu test drive en cualquiera de nuestros concesionarios autorizados en todo Uruguay. Llamanos al +598 99 100 331 o completá el formulario de contacto y un asesor coordina la prueba de manejo.`,
    },
    {
      question: `¿Qué garantía tiene el ${m.name}?`,
      answer: `Todos los vehículos ${m.brand} en Uruguay cuentan con garantía oficial del fabricante, respaldada por nuestra red de talleres autorizados con técnicos certificados y repuestos originales.`,
    },
    {
      question: `¿Dónde puedo hacer el service del ${m.name}?`,
      answer: `Contamos con una red de talleres autorizados ${m.brand} en Montevideo y el interior del país. Todos los mantenimientos son realizados por técnicos certificados con diagnóstico oficial y repuestos originales. Podés ver la lista completa en nuestra página de talleres.`,
    },
  ];

  if (isEV) {
    faqs.push({
      question: `¿Qué autonomía tiene el ${m.name}?`,
      answer: `El ${m.name} es 100% eléctrico con una autonomía excepcional en ciclo WLTP, ideal para uso urbano y viajes largos en Uruguay. Consultá las especificaciones técnicas para los valores exactos de autonomía, tiempo de carga y consumo.`,
    });
    faqs.push({
      question: `¿Dónde puedo cargar el ${m.name}?`,
      answer: `El ${m.name} se puede cargar en tu hogar con un cargador doméstico o en estaciones públicas compatibles. También soporta carga rápida en DC para recargas en viaje. Desde la app podés monitorear el estado de carga de forma remota.`,
    });
  } else if (isHybrid) {
    faqs.push({
      question: `¿Cómo funciona el sistema híbrido del ${m.name}?`,
      answer: `El ${m.name} combina un motor de combustión eficiente con un sistema eléctrico, optimizando consumo y autonomía. Podés manejarlo en modo eléctrico para trayectos cortos o en modo híbrido para viajes largos sin preocuparte por la carga.`,
    });
  } else {
    faqs.push({
      question: `¿Cuál es el consumo del ${m.name}?`,
      answer: `El ${m.name} cuenta con una motorización eficiente optimizada para el uso urbano y en ruta. Consultá la sección de especificaciones técnicas para ver el consumo combinado exacto y las opciones de motor disponibles.`,
    });
  }

  return faqs;
}

export function faqsJsonLd(faqs: ModelFAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
