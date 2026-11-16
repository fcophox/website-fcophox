import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { GradientField } from "@/components/gradient-field";
import { PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER } from "@/data/v3-products";

/** Ruta de la página interna de un producto propio. */
export const productCaseHref = (id: string) => `/case-studies/productos/${id}`;

/**
 * Productos propios creados como Senior Product Designer – IA, al final de
 * /case-studies. Cada tarjeta lleva a su página interna, cuyo contenido se
 * carga desde Kontorōru (ver case-studies/productos/[slug]/page.tsx).
 *
 * Sólo se muestran los productos que ya tienen su entrada publicada en el CMS
 * (`publishedIds`): un producto aparece solo en cuanto se publica. Si la
 * lectura del CMS falló llega `null` y se muestran todos, cada uno con su
 * página de «en preparación».
 */
export async function OwnProductsSection({ publishedIds }: { publishedIds: string[] | null }) {
  const t = await getTranslations("CaseStudiesPage.ownProducts");
  const tp = await getTranslations("V3.Products.items");
  const visibles = publishedIds ? PRODUCTS.filter((p) => publishedIds.includes(p.id)) : PRODUCTS;
  if (visibles.length === 0) return null;

  return (
    <section id="productos-propios" className="relative mt-24 md:mt-32 pt-24 md:pt-32 pb-16 scroll-mt-24">
      {/*
        El mismo fondo animado que el bloque de contacto de la home: fundido
        largo arriba, para que el campo nazca desde la grilla de casos, y corto
        abajo, para entregar al pie sin línea. Sale del contenedor a todo el
        ancho de la ventana; el body ya recorta el desborde horizontal.
      */}
      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/10 to-background" />
        <GradientField className="absolute inset-0" params={{ topFade: 0.7, bottomFade: 0.25 }} />
      </div>

      <div className="relative z-10">
      <p className="text-label font-mono uppercase text-foreground/80 mb-4">{t("label")}</p>
      <h2 className="text-title-section font-normal text-foreground md:max-w-[750px] mb-4 text-balance">
        {t.rich("title", {
          accent: (chunks) => (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{chunks}</span>
          ),
        })}
      </h2>
      <p className="text-subtitle text-muted md:max-w-[750px] mb-12 text-pretty">{t("description")}</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {visibles.map((product) => (
          <li key={product.id}>
            <Link
              href={productCaseHref(product.id)}
              className="group flex flex-col h-full cursor-none"
              data-custom-cursor="true"
            >
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-4 bg-surface">
                {product.icon && !product.image ? (
                  <div className="absolute inset-0 flex items-center justify-center hover-zoom">
                    <Image src={product.icon} alt="" width={96} height={96} className="size-20 rounded-full" />
                  </div>
                ) : (
                  <Image
                    src={product.image ?? PRODUCT_IMAGE_PLACEHOLDER}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover hover-zoom"
                  />
                )}

                {/* Decorativo: el nombre del producto va justo debajo. */}
                {product.image && (product.mark ?? product.icon) && (
                  <Image
                    src={(product.mark ?? product.icon)!}
                    alt=""
                    width={48}
                    height={48}
                    className="absolute top-4 left-4 z-10 size-10 md:size-12 rounded-full shadow-lg shadow-black/40"
                  />
                )}
              </div>

              <h3 className="text-title-subsection font-normal text-foreground mb-3 group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <p className="text-body-sm text-muted line-clamp-3 mb-4">{tp(`${product.id}.description`)}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 text-body-sm text-primary">
                {t("viewCase")}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
