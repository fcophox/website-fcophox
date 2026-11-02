/**
 * Productos destacados de la home v3.
 *
 * Aquí sólo va lo que no se traduce (enlace, imagen, logo); los textos están
 * en messages/v3.{es,en}.json bajo `V3.Products.items.<id>`.
 */

export type Product = {
  id: "kontororu" | "tanzo" | "bijon";
  name: string;
  /** Sitio del producto; la tarjeta enlaza aquí con el botón «Visitar». */
  url?: string;
  /**
   * Captura real del producto, p. ej. "/products/tanzo.png" (16:9, guardada en
   * public/products/). Sin ella, la tarjeta usa PRODUCT_IMAGE_PLACEHOLDER.
   */
  image?: string;
  /**
   * Logotipo rectangular en SVG (proporción 4:1, 160×40), p. ej.
   * "/products/logos/tanzo.svg". Sin él, la tarjeta usa PRODUCT_LOGO_PLACEHOLDER.
   */
  logo?: string;
  /** Oculto en la home; sus datos se conservan. */
  hidden?: boolean;
};

/** Imagen genérica para las tarjetas sin captura propia. */
export const PRODUCT_IMAGE_PLACEHOLDER = "/products/placeholder.svg";

/** Rectángulo de reserva para las tarjetas sin logotipo propio. */
export const PRODUCT_LOGO_PLACEHOLDER = "/products/logo-placeholder.svg";

const ALL_PRODUCTS: Product[] = [
  {
    id: "kontororu",
    name: "Kontorōru",
    url: "https://kontororu.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio-v3",
    image: "/products/kontororu.png",
    logo: "/products/kontororu.svg",
  },
  {
    id: "tanzo",
    name: "Tanzō",
    url: "https://tanzo.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio-v3",
    image: "/products/tanzo.png",
    logo: "/tanzo/tanzo-logotipo.svg",
  },
  {
    id: "bijon",
    name: "Bijon",
    logo: "/products/bijon.svg",
    hidden: true,
  },
];

/** Productos visibles en el sitio. */
export const PRODUCTS = ALL_PRODUCTS.filter((p) => !p.hidden);
