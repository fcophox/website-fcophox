/**
 * Contenido de /portfolio. Por ahora son datos de ejemplo: reemplaza cliente,
 * rubro e imagen de cada proyecto por los reales.
 *
 * - `image`: ruta en public/ (p. ej. "/portfolio/planvital.webp"). Sin ella se
 *   usa PORTFOLIO_IMAGE_PLACEHOLDER.
 * - `sector`: el rubro, en los dos idiomas.
 *
 * Los títulos de las secciones están en messages/*.json, bajo `PortfolioPage`.
 */

export type PortfolioProject = {
  id: string;
  client: string;
  sector: { es: string; en: string };
  image?: string;
};

export type PortfolioShot = {
  id: string;
  /** Título que se ve bajo la imagen en el lightbox. */
  title: string;
  /** Texto alternativo; vacío si la imagen es solo decorativa. */
  alt: string;
  image?: string;
  /**
   * Proporción de la imagen en el masonry (clase de Tailwind, literal para que
   * Tailwind la detecte). Con una imagen real, usa la proporción de la imagen.
   */
  aspect: string;
};

/** Imagen genérica mientras un proyecto no tenga la suya. */
export const PORTFOLIO_IMAGE_PLACEHOLDER = "/products/placeholder.svg";

/** Proyecto destacado: imagen a todo el ancho. */
export const FEATURED_PROJECT: PortfolioProject = {
  id: "planvital",
  client: "AFP PlanVital",
  sector: { es: "Pensiones y finanzas", en: "Pensions and finance" },
};

/** Proyectos en dos columnas, bajo el destacado. */
export const MAIN_PROJECTS: PortfolioProject[] = [
  { id: "cliente-2", client: "Cliente 2", sector: { es: "Banca", en: "Banking" } },
  { id: "cliente-3", client: "Cliente 3", sector: { es: "Retail", en: "Retail" } },
  { id: "cliente-4", client: "Cliente 4", sector: { es: "Salud", en: "Healthcare" } },
  { id: "cliente-5", client: "Cliente 5", sector: { es: "Educación", en: "Education" } },
];

/** «Otros proyectos de diseño», en tres columnas. */
export const OTHER_PROJECTS: PortfolioProject[] = [
  { id: "cliente-6", client: "Cliente 6", sector: { es: "Seguros", en: "Insurance" } },
  { id: "cliente-7", client: "Cliente 7", sector: { es: "Logística", en: "Logistics" } },
  { id: "cliente-8", client: "Cliente 8", sector: { es: "Fintech", en: "Fintech" } },
  { id: "cliente-9", client: "Cliente 9", sector: { es: "Ecommerce", en: "Ecommerce" } },
  { id: "cliente-10", client: "Cliente 10", sector: { es: "Tecnología", en: "Technology" } },
  { id: "cliente-11", client: "Cliente 11", sector: { es: "Educación", en: "Education" } },
];

/** «Más diseños»: solo imágenes, en masonry. */
export const MORE_SHOTS: PortfolioShot[] = [
  { id: "shot-1", title: "Diseño 1", alt: "", aspect: "aspect-[4/5]" },
  { id: "shot-2", title: "Diseño 2", alt: "", aspect: "aspect-[4/3]" },
  { id: "shot-3", title: "Diseño 3", alt: "", aspect: "aspect-square" },
  { id: "shot-4", title: "Diseño 4", alt: "", aspect: "aspect-[16/9]" },
  { id: "shot-5", title: "Diseño 5", alt: "", aspect: "aspect-[3/4]" },
  { id: "shot-6", title: "Diseño 6", alt: "", aspect: "aspect-[4/3]" },
  { id: "shot-7", title: "Diseño 7", alt: "", aspect: "aspect-square" },
  { id: "shot-8", title: "Diseño 8", alt: "", aspect: "aspect-[4/5]" },
  { id: "shot-9", title: "Diseño 9", alt: "", aspect: "aspect-[16/9]" },
];
