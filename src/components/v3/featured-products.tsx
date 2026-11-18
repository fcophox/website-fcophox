import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { HoverField } from "@/components/hover-field";
import { RevealImage } from "@/components/reveal-image";
import { HOME_PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER } from "@/data/v3-products";
import { leerProductosPublicados } from "@/utils/productos-cms";

const FIELD_PARAMS = { bottomFade: 0.15 };

/**
 * Productos construidos. Es el ancla `#productos` del CTA principal del hero.
 * Mismo formato que Capacidades de la home anterior (/org): en escritorio el
 * título queda fijo a la izquierda mientras los productos pasan a la derecha.
 * Cada producto muestra imagen, nombre y descripción, y enlaza a su sitio
 * cuando lo tiene.
 *
 * La imagen es la misma que en Productos propios de /case-studies: la captura
 * local del producto (`image`) y, si no la tiene, la portada de su entrada en
 * Kontorōru. Sólo si no hay ninguna de las dos se usa la tarjeta con icono.
 * Sin captura real se muestra una imagen genérica hasta subir la del producto.
 */
export async function FeaturedProductsV3() {
  const t = await getTranslations("V3.Products");
  const publicados = await leerProductosPublicados("home");

  return (
    <section
      id="productos"
      className="w-full relative z-10 bg-background py-16 md:py-24 scroll-mt-24 overflow-visible"
    >
      <div className="dm-container">
        <div className="dm-grid items-start gap-y-12">
          {/* Columna fija: el texto espera mientras pasan los productos. */}
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:sticky lg:top-32 h-fit">
            <p className="text-label font-mono uppercase text-foreground/80 mb-4">{t("label")}</p>
            <h2 className="text-title-section font-normal text-foreground mb-4">
              {t.rich("title", {
                hl: (chunks) => (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    {chunks}
                  </span>
                ),
              })}
            </h2>
            <p className="text-subtitle text-muted max-w-md text-pretty">{t("description")}</p>
          </div>

          <ul className="col-span-4 md:col-span-8 lg:col-span-7 flex flex-col gap-16 lg:gap-24">
            {HOME_PRODUCTS.map((product) => {
              const key = `items.${product.id}` as const;
              const cover = publicados?.[product.id]?.cover ?? null;
              const image = product.image ?? cover;
              const isotipo = product.mark ?? product.icon;
              const visitLink = product.url && (
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
              );

              // Sin captura ni portada en el CMS: tarjeta horizontal con el icono.
              if (!image && product.icon) {
                return (
                  <HoverField
                    key={product.id}
                    as="li"
                    className="group/card relative rounded-3xl bg-surface overflow-hidden"
                  >
                    <div className="relative p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center gap-6">
                      <Image
                        src={product.icon}
                        alt=""
                        width={96}
                        height={96}
                        className="shrink-0 size-20 rounded-full"
                      />
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <h3 className="text-title-subsection font-normal text-foreground">
                          {product.name}
                        </h3>
                        <p className="text-body-sm text-muted">{t(`${key}.description`)}</p>
                        {visitLink && <div className="pt-2">{visitLink}</div>}
                      </div>
                    </div>
                  </HoverField>
                );
              }

              return (
                <li key={product.id} className="flex flex-col items-start">
                  <HoverField
                    // La imagen tapa la parte alta, donde el efecto es más intenso.
                    fieldParams={FIELD_PARAMS}
                    className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden bg-surface mb-6"
                  >
                    <RevealImage
                      src={image ?? PRODUCT_IMAGE_PLACEHOLDER}
                      alt={image ? product.name : ""}
                      fill
                      sizes="(min-width: 1024px) 55vw, 100vw"
                      // La portada del CMS es una URL firmada que caduca a las 24 h: se sirve tal cual.
                      unoptimized={!product.image && !!cover}
                      className="object-cover"
                      revealColor="var(--surface)"
                    />
                  </HoverField>

                  <div className="flex items-center gap-3 mb-3">
                    {/* Decorativo: el nombre del producto va al lado. */}
                    {isotipo && (
                      <Image
                        src={isotipo}
                        alt=""
                        width={40}
                        height={40}
                        className="shrink-0 size-10 rounded-full"
                      />
                    )}
                    <h3 className="text-title-subsection font-normal text-foreground">
                      {product.name}
                    </h3>
                  </div>
                  <p className="text-body-sm text-muted max-w-xl mb-4">{t(`${key}.description`)}</p>
                  {visitLink}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
