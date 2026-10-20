import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER } from "@/data/v3-products";

/**
 * Productos construidos. Es el ancla `#productos` del CTA principal del hero.
 * La tarjeta sólo resume (imagen, nombre, descripción y enlaces); el estado,
 * el problema, la IA y el stack están en la página de cada producto.
 * Sin captura real se muestra una imagen genérica hasta subir la del producto.
 */
export async function FeaturedProductsV3() {
  const t = await getTranslations("V3.Products");

  return (
    <section id="productos" className="w-full relative z-10 bg-background py-16 md:py-24 scroll-mt-24">
      <div className="dm-container">
        <p className="text-label font-mono uppercase text-foreground/80 mb-4">{t("label")}</p>
        <h2 className="text-title-section font-normal text-foreground md:max-w-[750px] mb-4">
          {t("title")}
        </h2>
        <p className="text-subtitle text-muted md:max-w-[750px] mb-12 text-pretty">{t("description")}</p>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRODUCTS.map((product) => {
            const key = `items.${product.id}` as const;
            return (
              <li key={product.id} className="rounded-3xl bg-surface overflow-hidden flex flex-col">
                <div className="relative aspect-[16/9] bg-background/40">
                  <Image
                    src={product.image ?? PRODUCT_IMAGE_PLACEHOLDER}
                    alt={product.image ? product.name : ""}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 lg:p-8 flex flex-col gap-4 flex-1">
                  <h3 className="text-title-subsection font-normal text-foreground">
                    <Link href={`/v3/products/${product.id}`} className="hover:text-primary transition-colors">
                      {product.name}
                    </Link>
                  </h3>

                  <p className="text-foreground/90">{t(`${key}.description`)}</p>

                  <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-4">
                    <Link
                      href={`/v3/products/${product.id}`}
                      className="group inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                    >
                      {t("learnMore")}
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </Link>
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-foreground hover:text-primary transition-colors"
                      >
                        {t("visit")} {product.name}
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          aria-hidden
                        />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
