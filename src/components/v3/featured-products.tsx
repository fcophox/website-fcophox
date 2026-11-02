import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { HoverField } from "@/components/hover-field";
import { RevealImage } from "@/components/reveal-image";
import { PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER, PRODUCT_LOGO_PLACEHOLDER } from "@/data/v3-products";

const FIELD_PARAMS = { bottomFade: 0.15 };

/**
 * Productos construidos. Es el ancla `#productos` del CTA principal del hero.
 * Cada tarjeta muestra imagen, nombre y descripción, y enlaza al sitio del
 * producto cuando lo tiene; no hay páginas internas de producto.
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

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRODUCTS.map((product) => {
            const key = `items.${product.id}` as const;
            return (
              <HoverField
                key={product.id}
                as="li"
                // La imagen tapa la parte alta, donde el efecto es más intenso.
                fieldParams={FIELD_PARAMS}
                className="group/card relative rounded-3xl bg-surface overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[16/9] bg-background/40">
                  <RevealImage
                    src={product.image ?? PRODUCT_IMAGE_PLACEHOLDER}
                    alt={product.image ? product.name : ""}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    revealColor="var(--surface)"
                  />
                </div>

                <div className="relative p-6 lg:p-8 flex flex-col gap-4 flex-1">
                  {/* Decorativo: el nombre del producto va justo debajo. */}
                  <div className="relative h-10 w-40">
                    <Image
                      src={product.logo ?? PRODUCT_LOGO_PLACEHOLDER}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain object-left"
                    />
                  </div>

                  <h3 className="text-title-subsection font-normal text-foreground">
                    {product.name}
                  </h3>

                  <p className="text-muted">{t(`${key}.description`)}</p>

                  <div className="mt-auto pt-2 flex flex-wrap items-center justify-between gap-4">
                    {product.url && (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                      >
                        {t("visit")} {product.name}
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5"
                          aria-hidden
                        />
                      </a>
                    )}
                  </div>
                </div>
              </HoverField>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
