import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER } from "@/data/v3-products";

/** Ruta de la página interna de un producto propio. */
export const productCaseHref = (id: string) => `/case-studies/productos/${id}`;

/**
 * Productos propios creados como Senior Product Designer – IA, al final de
 * /case-studies. Cada tarjeta lleva a su página interna, cuyo contenido se
 * carga desde Kontorōru (ver case-studies/productos/[slug]/page.tsx).
 */
export async function OwnProductsSection() {
  const t = await getTranslations("CaseStudiesPage.ownProducts");
  const tp = await getTranslations("V3.Products.items");

  return (
    <section id="productos-propios" className="mt-32 md:mt-40 scroll-mt-24">
      <p className="text-label font-mono uppercase text-foreground/80 mb-4">{t("label")}</p>
      <h2 className="text-title-section font-normal text-foreground md:max-w-[750px] mb-4 text-balance">
        {t("title")}
      </h2>
      <p className="text-subtitle text-muted md:max-w-[750px] mb-12 text-pretty">{t("description")}</p>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
        {PRODUCTS.map((product) => (
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
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover hover-zoom"
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
    </section>
  );
}
