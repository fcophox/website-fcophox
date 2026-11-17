/**
 * Productos destacados de la home v3.
 *
 * Aquí sólo va lo que no se traduce (enlace, imagen, logo); los textos están
 * en messages/v3.{es,en}.json bajo `V3.Products.items.<id>`.
 */

export type Product = {
  id: "kanri" | "tanzo" | "bijon" | "mozo" | "mawaru";
  name: string;
  /** Sitio del producto; la tarjeta enlaza aquí con el botón «Visitar». */
  url?: string;
  /**
   * Captura real del producto, p. ej. "/products/tanzo.webp" (16:9, guardada en
   * public/products/). Sin ella, la tarjeta usa PRODUCT_IMAGE_PLACEHOLDER.
   */
  image?: string;
  /**
   * Logotipo rectangular en SVG (proporción 4:1, 160×40), p. ej.
   * "/products/logos/tanzo.svg". Sin él, la tarjeta usa PRODUCT_LOGO_PLACEHOLDER.
   */
  logo?: string;
  /**
   * Icono cuadrado de app (p. ej. "/products/isotipos/mozo.svg"). Si lo tiene, la
   * tarjeta de la home pasa a formato horizontal (icono + texto) en una columna.
   */
  icon?: string;
  /**
   * Isotipo circular (SVG) que se superpone en la esquina de la imagen en
   * /case-studies. A diferencia de `icon`, no cambia el formato de la tarjeta
   * de la home.
   */
  mark?: string;
  /**
   * Repositorio en GitHub para el botón «Ver GitHub» de su página en
   * /case-studies. `null` muestra el botón desactivado («próximamente»); sin
   * definir, no hay botón.
   */
  github?: string | null;
  /** Oculto en todo el sitio; sus datos se conservan. */
  hidden?: boolean;
  /**
   * Sólo en /case-studies (Productos propios), no en la home. Para productos
   * sin sitio público ni tarjeta de home.
   */
  caseStudyOnly?: boolean;
};

/** Imagen genérica para las tarjetas sin captura propia. */
export const PRODUCT_IMAGE_PLACEHOLDER = "/products/placeholder.svg";

/** Rectángulo de reserva para las tarjetas sin logotipo propio. */
export const PRODUCT_LOGO_PLACEHOLDER = "/products/logo-placeholder.svg";

const ALL_PRODUCTS: Product[] = [
  {
    id: "kanri",
    name: "Kanri",
    url: "https://www.kanri.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio-v3",
    image: "/products/kanri.webp",
    logo: "/products/isotipos/kanri.svg",
    mark: "/products/isotipos/kanri.svg",
  },
  {
    id: "tanzo",
    name: "Tanzō",
    url: "https://tanzo.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio-v3",
    image: "/products/tanzo.webp",
    logo: "/tanzo/tanzo-logotipo.svg",
    mark: "/products/isotipos/tanzo.svg",
  },
  {
    id: "mawaru",
    name: "Mawaru",
    icon: "/products/isotipos/mawaru.svg",
    github: null,
  },
  {
    id: "mozo",
    name: "Mozō",
    url: "https://mozo.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio-v3",
    icon: "/products/isotipos/mozo.svg",
    github: null,
  },
  {
    id: "bijon",
    name: "Bijon",
    logo: "/products/bijon.svg",
    hidden: true,
  },
];

/** Productos visibles en el sitio (Productos propios de /case-studies). */
export const PRODUCTS = ALL_PRODUCTS.filter((p) => !p.hidden);

/** Productos de la home: los visibles menos los que son sólo de casos de estudio. */
export const HOME_PRODUCTS = PRODUCTS.filter((p) => !p.caseStudyOnly);
