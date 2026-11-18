import { CATEGORIA } from "@/utils/kontororu";
import { listarLocalizado } from "@/utils/kontororu-i18n";

/** Lo que se usa de la entrada de un producto propio en Kontorōru. */
export type ProductoPublicado = {
  title: string;
  excerpt: string | null;
  /** URL firmada (caduca a las 24 h): hay que servirla sin optimizar. */
  cover: string | null;
};

/**
 * Entradas publicadas de la categoría «productos», indexadas por slug (= id del
 * producto en data/v3-products.ts). Devuelve `null` si la lectura falla, para
 * que quien la use pueda seguir con los datos locales.
 *
 * La comparten Productos propios de /case-studies y Productos de la home, así
 * las dos muestran la misma imagen.
 */
export async function leerProductosPublicados(
  origen: string,
): Promise<Record<string, ProductoPublicado> | null> {
  try {
    const productos = await listarLocalizado({ categoria: CATEGORIA.productos, limit: 100 });
    return Object.fromEntries(
      productos.map((p) => [
        p.slug,
        { title: p.title, excerpt: p.excerpt?.trim() || null, cover: p.cover?.url ?? null },
      ]),
    );
  } catch (error) {
    console.error(`[${origen}] No se pudieron leer los productos de Kontorōru:`, error);
    return null;
  }
}
