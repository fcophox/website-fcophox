/**
 * Productos destacados de la home v3.
 *
 * Aquí sólo va lo que no se traduce (stack, estado, enlaces, imagen); los
 * textos están en messages/v3.{es,en}.json bajo `V3.Products.items.<id>`.
 *
 * Cada dato salió del repositorio del producto (package.json, README, docs).
 * Lo marcado `verificar` está pendiente de confirmar antes de publicar.
 */
export type ProductStatus = "concept" | "prototype" | "mvp" | "beta" | "production";

export type Product = {
  id: "kontororu" | "tanzo" | "bijon";
  name: string;
  status: ProductStatus;
  stack: string[];
  /** Hay texto `ai` en los mensajes para este producto. */
  usesAi?: boolean;
  /** Tiene texto `note` en los mensajes. */
  hasNote?: boolean;
  url?: string;
  /**
   * Captura real del producto, p. ej. "/products/tanzo.png" (16:9, guardada en
   * public/products/). Sin ella, la tarjeta usa PRODUCT_IMAGE_PLACEHOLDER.
   */
  image?: string;
};

/** Color de la etiqueta de estado, compartido por la tarjeta y la página del producto. */
export const PRODUCT_STATUS_STYLE: Record<ProductStatus, string> = {
  production: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
  beta: "bg-primary/10 text-primary border-primary/20",
  mvp: "bg-secondary/10 text-secondary border-secondary/20",
  prototype: "bg-muted/10 text-muted border-border",
  concept: "bg-muted/10 text-muted border-border",
};

/** Imagen genérica para las tarjetas sin captura propia. */
export const PRODUCT_IMAGE_PLACEHOLDER = "/products/placeholder.svg";

export const PRODUCTS: Product[] = [
  {
    id: "kontororu",
    name: "Kontorōru",
    // En producción: sirve el contenido de fcophox.com.
    status: "production",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Supabase", "Tiptap"],
    hasNote: true,
  },
  {
    id: "tanzo",
    name: "Tanzō",
    status: "production",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "React Flow", "Convex"],
    url: "https://tanzo.fcophox.com/?utm_source=fcophox.com&utm_medium=referral&utm_campaign=portfolio-v3",
    // verificar: falta captura real. /tanzo/bg-tanzo.png es un fondo, no el producto.
  },
  {
    id: "bijon",
    name: "Bijon",
    // verificar: estado real dentro de Tanzō.
    status: "beta",
    stack: ["Next.js", "TypeScript", "Gemini API"],
    usesAi: true,
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
