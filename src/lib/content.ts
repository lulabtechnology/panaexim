export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export type EventItem = {
  id: "jewellery" | "cosmetica" | "defensa" | "energy";
  number: string;
  name: string;
  kicker: string;
  description: string;
  categories: string[];
  cta: string;
  url: string;
  image: string;
  mobileImage: string;
  heroImage: string;
  logo: string;
  accent: string;
  accentSoft: string;
};

export type SiteContent = {
  locale: Locale;
  navigation: {
    about: string;
    events: string;
    participants: string;
    venue: string;
    contact: string;
    exhibitor: string;
    menu: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    tagline: string;
    description: string;
    date: string;
    venue: string;
    primaryCta: string;
    secondaryCta: string;
    countdown: [string, string, string, string];
    scroll: string;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    stats: Array<{ value: string; label: string }>;
  };
  eventsHeading: {
    eyebrow: string;
    title: string;
    description: string;
    instruction: string;
  };
  events: EventItem[];
  opportunities: {
    eyebrow: string;
    title: string;
    description: string;
    items: Array<{ number: string; title: string; body: string }>;
    primaryCta: string;
    secondaryCta: string;
  };
  leadership: {
    eyebrow: string;
    title: string;
    body: string;
    pillars: string[];
  };
  participants: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  venue: {
    eyebrow: string;
    title: string;
    body: string;
    airportTitle: string;
    airportBody: string;
    cityTitle: string;
    cityBody: string;
    lodgingTitle: string;
    lodgingBody: string;
    mapCta: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    panama: string;
    turkey: string;
    accounting: string;
    address: string;
    formTitle: string;
    name: string;
    company: string;
    country: string;
    email: string;
    phone: string;
    interest: string;
    message: string;
    submit: string;
    interests: string[];
  };
  footer: {
    description: string;
    explore: string;
    legal: string;
    privacy: string;
    terms: string;
    credit: string;
    rights: string;
  };
};

const sharedEvents = {
  jewellery: {
    id: "jewellery" as const,
    number: "01",
    url: "https://panamajewelryshow.com/",
    image: "/media/phase8/events/jewellery.webp",
    mobileImage: "/media/phase8/events/jewellery-mobile.webp",
    heroImage: "/media/phase8/hero/jewellery-strip.webp",
    logo: "/media/phase8/logos/pjs-gold.png",
    accent: "#dfbd67",
    accentSoft: "rgba(223,189,103,.24)",
  },
  cosmetica: {
    id: "cosmetica" as const,
    number: "02",
    url: "https://panacosmetica.com/",
    image: "/media/phase8/events/cosmetica.webp",
    mobileImage: "/media/phase8/events/cosmetica-mobile.webp",
    heroImage: "/media/phase8/hero/cosmetica-strip.webp",
    logo: "/media/phase8/logos/panacosmetica-light.svg",
    accent: "#d7a4b2",
    accentSoft: "rgba(215,164,178,.24)",
  },
  defensa: {
    id: "defensa" as const,
    number: "03",
    url: "https://panasecurityexpo.com/",
    image: "/media/phase8/events/defensa.webp",
    mobileImage: "/media/phase8/events/defensa-mobile.webp",
    heroImage: "/media/phase8/hero/defensa-strip.webp",
    logo: "/media/phase8/logos/panadefensa.png",
    accent: "#3484ff",
    accentSoft: "rgba(52,132,255,.24)",
  },
  energy: {
    id: "energy" as const,
    number: "04",
    url: "https://panaenergyexpo.com/",
    image: "/media/phase8/events/energy.webp",
    mobileImage: "/media/phase8/events/energy-mobile.webp",
    heroImage: "/media/phase8/hero/energy-strip.webp",
    logo: "/media/phase8/logos/panaenergy.png",
    accent: "#3fc5cd",
    accentSoft: "rgba(63,197,205,.24)",
  },
};

export const content: Record<Locale, SiteContent> = {
  es: {
    locale: "es",
    navigation: {
      about: "PanaEXIM",
      events: "Eventos",
      participants: "Participantes",
      venue: "Ubicación",
      contact: "Contacto",
      exhibitor: "Participar como exhibidor",
      menu: "Abrir menú",
    },
    hero: {
      eyebrow: "Panamá · 23–26 noviembre 2026",
      title: "PanaEXIM 2026",
      tagline: "4 Events. Infinite Opportunities.",
      description:
        "Cuatro exposiciones internacionales convergen en Panamá para conectar industrias, empresas, compradores, instituciones y líderes globales.",
      date: "23–26 de noviembre de 2026 · 10:00 a. m.–6:00 p. m.",
      venue: "Panama Convention Center · Amador, Ciudad de Panamá",
      primaryCta: "Participar como exhibidor",
      secondaryCta: "Explorar los eventos",
      countdown: ["Días", "Horas", "Minutos", "Segundos"],
      scroll: "Descubrir PanaEXIM",
    },
    about: {
      eyebrow: "Una plataforma. Cuatro industrias.",
      title: "El punto de encuentro internacional para nuevas oportunidades.",
      body:
        "PanaEXIM es la organización líder detrás de cuatro exposiciones internacionales que reúnen sectores estratégicos en una misma sede durante cuatro días. Conectamos mercados, impulsamos oportunidades comerciales y posicionamos a Panamá como un destino global para los negocios, la innovación y la inversión.",
      stats: [
        { value: "04", label: "Eventos internacionales" },
        { value: "04", label: "Días de conexiones" },
        { value: "01", label: "Destino global" },
      ],
    },
    eventsHeading: {
      eyebrow: "El ecosistema PanaEXIM",
      title: "Cuatro experiencias. Una visión internacional.",
      description:
        "Explore cada feria mediante una experiencia visual inmersiva diseñada para mostrar su industria, audiencia y oportunidades.",
      instruction: "Deslice, arrastre o use las flechas",
    },
    events: [
      {
        ...sharedEvents.jewellery,
        name: "Panama Jewellery Show",
        kicker: "Joyería, gemas, relojería y lujo",
        description:
          "Una plataforma internacional para fabricantes, marcas, compradores, mayoristas, diseñadores y profesionales de la industria joyera.",
        categories: ["Metales preciosos", "Gemas", "Relojería", "Diseño y tecnología"],
        cta: "Descubrir el evento",
      },
      {
        ...sharedEvents.cosmetica,
        name: "PanaCosmetica",
        kicker: "Beauty. Science. Confidence.",
        description:
          "Belleza, ciencia, estética e innovación convergen en una experiencia internacional para marcas, especialistas y profesionales del sector.",
        categories: ["Skincare", "Cosmética", "Estética", "Beauty tech"],
        cta: "Descubrir el evento",
      },
      {
        ...sharedEvents.defensa,
        name: "PanaDefensa International",
        kicker: "Seguridad, tecnología y protección estratégica",
        description:
          "Soluciones internacionales para seguridad pública, control fronterizo, ciberseguridad, vigilancia e infraestructura crítica.",
        categories: ["Seguridad pública", "Ciberseguridad", "Fronteras", "Infraestructura crítica"],
        cta: "Descubrir el evento",
      },
      {
        ...sharedEvents.energy,
        name: "PanaEnergy",
        kicker: "El futuro de la energía conecta en Panamá",
        description:
          "Una plataforma internacional para innovación, inversión y alianzas en energía, tecnologías limpias, sostenibilidad e infraestructura.",
        categories: ["Energía limpia", "Redes inteligentes", "Movilidad", "Inversión"],
        cta: "Descubrir el evento",
      },
    ],
    opportunities: {
      eyebrow: "4 Events. Infinite Opportunities.",
      title: "Diseñado para exhibir, descubrir y conectar.",
      description:
        "PanaEXIM reúne en un mismo destino a quienes presentan soluciones y a quienes buscan nuevas oportunidades de crecimiento.",
      items: [
        {
          number: "01",
          title: "Exhibir",
          body: "Presente su marca, productos y capacidades ante mercados, compradores e instituciones internacionales.",
        },
        {
          number: "02",
          title: "Visitar",
          body: "Descubra proveedores, tendencias, tecnologías y soluciones especializadas en cuatro industrias estratégicas.",
        },
        {
          number: "03",
          title: "Conectar",
          body: "Construya relaciones con empresas, inversionistas, distribuidores, líderes y responsables de decisión.",
        },
      ],
      primaryCta: "Solicitar información",
      secondaryCta: "Acceso de participantes",
    },
    leadership: {
      eyebrow: "La organización líder",
      title: "Una visión común detrás de cuatro eventos especializados.",
      body:
        "PanaEXIM lidera la planificación, organización y desarrollo de las cuatro exposiciones. Cada evento conserva su identidad y audiencia, mientras PanaEXIM conecta sus oportunidades dentro de un ecosistema comercial más amplio.",
      pillars: ["Organización integral", "Alcance internacional", "Conexiones estratégicas", "Panamá como hub regional"],
    },
    participants: {
      eyebrow: "Área privada",
      title: "Participantes confirmados",
      body:
        "Acceda al directorio protegido de marcas y organizaciones participantes mediante la contraseña autorizada por PanaEXIM.",
      cta: "Ingresar al área privada",
    },
    venue: {
      eyebrow: "Un destino conectado con el mundo",
      title: "Panama Convention Center",
      body:
        "Una sede moderna en Amador, Ciudad de Panamá, preparada para recibir exposiciones internacionales, reuniones profesionales y grandes montajes.",
      airportTitle: "Desde Tocumen",
      airportBody: "Taxi, transporte por aplicación o traslado privado. El tiempo estimado depende del tráfico.",
      cityTitle: "Desde la ciudad",
      cityBody: "Acceso por las principales vías hacia Amador y el área del Canal.",
      lodgingTitle: "Zonas recomendadas",
      lodgingBody: "Casco Antiguo, Punta Pacífica, Paitilla, Obarrio, San Francisco y áreas céntricas.",
      mapCta: "Abrir en Google Maps",
    },
    contact: {
      eyebrow: "Contacto oficial",
      title: "Construyamos su participación en PanaEXIM 2026.",
      body:
        "Solicite información sobre exhibición, visitas profesionales, alianzas, prensa o documentación de los eventos.",
      panama: "Contacto Panamá",
      turkey: "Contacto Turquía",
      accounting: "Contabilidad",
      address: "Dirección",
      formTitle: "Enviar una consulta",
      name: "Nombre completo",
      company: "Empresa u organización",
      country: "País",
      email: "Correo electrónico",
      phone: "Teléfono / WhatsApp",
      interest: "Motivo de contacto",
      message: "Cuéntenos qué necesita",
      submit: "Enviar por WhatsApp",
      interests: [
        "Participar como exhibidor",
        "Registrarse como visitante",
        "Patrocinio o alianza",
        "Prensa",
        "Información general",
      ],
    },
    footer: {
      description:
        "La organización líder detrás de cuatro exposiciones internacionales en Panamá.",
      explore: "Explorar",
      legal: "Legal",
      privacy: "Privacidad",
      terms: "Términos",
      credit: "Technology Partner & Web Development · LulabTech",
      rights: "Todos los derechos reservados.",
    },
  },
  en: {
    locale: "en",
    navigation: {
      about: "PanaEXIM",
      events: "Events",
      participants: "Participants",
      venue: "Venue",
      contact: "Contact",
      exhibitor: "Become an exhibitor",
      menu: "Open menu",
    },
    hero: {
      eyebrow: "Panama · November 23–26, 2026",
      title: "PanaEXIM 2026",
      tagline: "4 Events. Infinite Opportunities.",
      description:
        "Four international exhibitions converge in Panama to connect industries, companies, buyers, institutions and global leaders.",
      date: "November 23–26, 2026 · 10:00 a.m.–6:00 p.m.",
      venue: "Panama Convention Center · Amador, Panama City",
      primaryCta: "Become an exhibitor",
      secondaryCta: "Explore the events",
      countdown: ["Days", "Hours", "Minutes", "Seconds"],
      scroll: "Discover PanaEXIM",
    },
    about: {
      eyebrow: "One platform. Four industries.",
      title: "The international meeting point for new opportunities.",
      body:
        "PanaEXIM is the leading organization behind four international exhibitions bringing strategic sectors together in one venue for four days. We connect markets, accelerate commercial opportunities and position Panama as a global destination for business, innovation and investment.",
      stats: [
        { value: "04", label: "International events" },
        { value: "04", label: "Days of connections" },
        { value: "01", label: "Global destination" },
      ],
    },
    eventsHeading: {
      eyebrow: "The PanaEXIM ecosystem",
      title: "Four experiences. One international vision.",
      description:
        "Explore every exhibition through an immersive visual experience designed around its industry, audience and opportunities.",
      instruction: "Swipe, drag or use the arrows",
    },
    events: [
      {
        ...sharedEvents.jewellery,
        name: "Panama Jewellery Show",
        kicker: "Jewellery, gemstones, watches and luxury",
        description:
          "An international platform for manufacturers, brands, buyers, wholesalers, designers and jewellery-industry professionals.",
        categories: ["Precious metals", "Gemstones", "Watches", "Design and technology"],
        cta: "Discover the event",
      },
      {
        ...sharedEvents.cosmetica,
        name: "PanaCosmetica",
        kicker: "Beauty. Science. Confidence.",
        description:
          "Beauty, science, aesthetics and innovation converge in an international experience for brands, specialists and industry professionals.",
        categories: ["Skincare", "Cosmetics", "Aesthetics", "Beauty tech"],
        cta: "Discover the event",
      },
      {
        ...sharedEvents.defensa,
        name: "PanaDefensa International",
        kicker: "Security, technology and strategic protection",
        description:
          "International solutions for public security, border control, cybersecurity, surveillance and critical infrastructure.",
        categories: ["Public security", "Cybersecurity", "Borders", "Critical infrastructure"],
        cta: "Discover the event",
      },
      {
        ...sharedEvents.energy,
        name: "PanaEnergy",
        kicker: "The future of energy connects in Panama",
        description:
          "An international platform for innovation, investment and partnerships in energy, clean technologies, sustainability and infrastructure.",
        categories: ["Clean energy", "Smart grids", "Mobility", "Investment"],
        cta: "Discover the event",
      },
    ],
    opportunities: {
      eyebrow: "4 Events. Infinite Opportunities.",
      title: "Designed to exhibit, discover and connect.",
      description:
        "PanaEXIM brings together those presenting solutions and those seeking new growth opportunities in one global destination.",
      items: [
        {
          number: "01",
          title: "Exhibit",
          body: "Present your brand, products and capabilities to international markets, buyers and institutions.",
        },
        {
          number: "02",
          title: "Visit",
          body: "Discover suppliers, trends, technologies and specialized solutions across four strategic industries.",
        },
        {
          number: "03",
          title: "Connect",
          body: "Build relationships with companies, investors, distributors, leaders and decision-makers.",
        },
      ],
      primaryCta: "Request information",
      secondaryCta: "Participant access",
    },
    leadership: {
      eyebrow: "The leading organization",
      title: "One shared vision behind four specialized events.",
      body:
        "PanaEXIM leads the planning, organization and delivery of all four exhibitions. Each event maintains its own identity and audience, while PanaEXIM connects their opportunities within a broader commercial ecosystem.",
      pillars: ["End-to-end organization", "International reach", "Strategic connections", "Panama as a regional hub"],
    },
    participants: {
      eyebrow: "Private area",
      title: "Confirmed participants",
      body:
        "Access the protected directory of participating brands and organizations with the password authorized by PanaEXIM.",
      cta: "Enter the private area",
    },
    venue: {
      eyebrow: "A destination connected to the world",
      title: "Panama Convention Center",
      body:
        "A modern venue in Amador, Panama City, prepared for international exhibitions, professional meetings and large-scale installations.",
      airportTitle: "From Tocumen",
      airportBody: "Taxi, ride-hailing service or private transfer. Estimated travel time depends on traffic.",
      cityTitle: "From the city",
      cityBody: "Access through the main roads leading to Amador and the Canal area.",
      lodgingTitle: "Recommended areas",
      lodgingBody: "Casco Antiguo, Punta Pacifica, Paitilla, Obarrio, San Francisco and central districts.",
      mapCta: "Open in Google Maps",
    },
    contact: {
      eyebrow: "Official contact",
      title: "Let us build your participation in PanaEXIM 2026.",
      body:
        "Request information about exhibiting, professional visits, partnerships, media or event documentation.",
      panama: "Panama contact",
      turkey: "Turkey contact",
      accounting: "Accounting",
      address: "Address",
      formTitle: "Send an inquiry",
      name: "Full name",
      company: "Company or organization",
      country: "Country",
      email: "Email address",
      phone: "Phone / WhatsApp",
      interest: "Reason for contact",
      message: "Tell us what you need",
      submit: "Send via WhatsApp",
      interests: [
        "Become an exhibitor",
        "Register as a visitor",
        "Sponsorship or partnership",
        "Media",
        "General information",
      ],
    },
    footer: {
      description:
        "The leading organization behind four international exhibitions in Panama.",
      explore: "Explore",
      legal: "Legal",
      privacy: "Privacy",
      terms: "Terms",
      credit: "Technology Partner & Web Development · LulabTech",
      rights: "All rights reserved.",
    },
  },
};
