import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";

import { PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER, PRODUCT_STATUS_STYLE } from "@/data/v3-products";

/**
 * Productos construidos. Es el ancla `#productos` del CTA principal del hero.
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

                <div className="p-6 lg:p-8 flex flex-col gap-5 flex-1">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                    <div>
                      <h3 className="text-title-subsection font-normal text-foreground">
                        <Link href={`/v3/products/${product.id}`} className="hover:text-primary transition-colors">
                          {product.name}
                        </Link>
                      </h3>
                      <p className="text-body-sm text-muted">{t(`${key}.tagline`)}</p>
                    </div>
                    <span
                      className={`self-start shrink-0 px-3 py-1 rounded-full border text-label font-mono uppercase ${PRODUCT_STATUS_STYLE[product.status]}`}
                    >
                      {t(`status.${product.status}`)}
                    </span>
                  </div>

                  <p className="text-foreground/90">{t(`${key}.description`)}</p>

                  <div>
                    <p className="text-label font-mono uppercase text-muted mb-1">{t("problemLabel")}</p>
                    <p className="text-body-sm text-muted">{t(`${key}.problem`)}</p>
                  </div>

                  {product.usesAi && (
                    <p className="flex items-start gap-2 text-body-sm text-foreground/90">
                      <Sparkles size={16} className="text-primary mt-0.5 shrink-0" aria-label={t("aiLabel")} />
                      {t(`${key}.ai`)}
                    </p>
                  )}

                  {product.hasNote && <p className="text-body-sm text-primary">{t(`${key}.note`)}</p>}

                  <div className="mt-auto pt-2 flex flex-col gap-4">
                    <ul className="flex flex-wrap gap-2" aria-label={t("stackLabel")}>
                      {product.stack.map((tech) => (
                        <li
                          key={tech}
                          className="px-2.5 py-1 rounded-full border border-border/60 text-label font-mono text-muted"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap items-center justify-between gap-4">
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
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
