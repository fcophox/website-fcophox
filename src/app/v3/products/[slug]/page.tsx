import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { MotionDiv, MotionH1, MotionP, MotionSpan } from "@/components/motion-wrapper";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { SphereMesh } from "@/components/v3/sphere-mesh";
import {
  PRODUCTS,
  PRODUCT_IMAGE_PLACEHOLDER,
  PRODUCT_STATUS_STYLE,
  getProduct,
} from "@/data/v3-products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  const t = await getTranslations("V3.Products");
  return {
    title: { absolute: `${product.name} | Fcophox` },
    description: t(`items.${product.id}.description`),
  };
}

/** `data-reveal`: sin JS, el <noscript> del layout de v3 deja visibles estos bloques. */
const reveal = (delay = 0) => ({
  "data-reveal": true,
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay },
});

const revealInView = {
  "data-reveal": true,
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5 },
};

/**
 * Página de cada producto de la home v3, con la estructura de las páginas de
 * capabilities. Sólo usa los datos de la tarjeta (v3-products + mensajes): no
 * se agrega contenido que no esté verificado.
 */
export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("V3.Products");
  const key = `items.${product.id}` as const;

  const currentIndex = PRODUCTS.indexOf(product);
  const prev = PRODUCTS[(currentIndex - 1 + PRODUCTS.length) % PRODUCTS.length];
  const next = PRODUCTS[(currentIndex + 1) % PRODUCTS.length];

  return (
    <>
      <ReadingProgressBar />
      <main className="min-h-screen relative py-8 md:py-20">
        {/* Fondo: la malla de una esfera vista desde dentro, fundida hacia abajo. */}
        <SphereMesh className="pointer-events-none absolute inset-x-0 top-0 h-[100svh] w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-12">
            <Link
              href="/v3#productos"
              className="inline-flex items-center gap-2 text-muted hover:text-foreground text-body-sm font-medium transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              {t("detail.back")}
            </Link>

            <div className="flex flex-col gap-4">
              <MotionSpan
                {...reveal()}
                className={`self-start px-3.5 py-1.5 rounded-full border text-label font-mono uppercase ${PRODUCT_STATUS_STYLE[product.status]}`}
              >
                {t(`status.${product.status}`)}
              </MotionSpan>
              <MotionH1 {...reveal(0.1)} className="text-title-page font-normal text-foreground">
                {product.name}
              </MotionH1>
              <MotionP {...reveal(0.2)} className="text-subtitle text-muted font-normal max-w-3xl mt-2">
                {t(`${key}.tagline`)}
              </MotionP>

              {product.url && (
                <MotionDiv {...reveal(0.25)} className="mt-4">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/25"
                  >
                    {t("visit")} {product.name}
                    <ArrowUpRight size={16} aria-hidden />
                  </a>
                </MotionDiv>
              )}
            </div>
          </div>

          {/* Hero Image */}
          <MotionDiv
            data-reveal
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl md:rounded-[2rem] overflow-hidden border border-border/40 bg-surface shadow-lg mb-10 md:mb-16"
          >
            <Image
              src={product.image ?? PRODUCT_IMAGE_PLACEHOLDER}
              alt={product.image ? product.name : ""}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </MotionDiv>

          {/* Descripción */}
          <MotionDiv {...reveal(0.4)} className="max-w-3xl mx-auto mb-14 md:mb-20">
            <h2 className="text-title-section font-normal text-foreground mb-4">{t("detail.aboutTitle")}</h2>
            <p className="text-body text-muted">{t(`${key}.description`)}</p>
            {product.hasNote && <p className="mt-6 text-body-sm text-primary">{t(`${key}.note`)}</p>}
          </MotionDiv>

          {/* Problema e IA — dos columnas */}
          <MotionDiv
            {...revealInView}
            className={`grid grid-cols-1 gap-8 md:gap-12 mb-16 md:mb-24 ${product.usesAi ? "md:grid-cols-2" : "max-w-3xl mx-auto"}`}
          >
            <div>
              <h3 className="text-title-subsection font-normal text-foreground mb-4">{t("detail.problemTitle")}</h3>
              <p className="text-body-sm text-muted">{t(`${key}.problem`)}</p>
            </div>
            {product.usesAi && (
              <div>
                <h3 className="flex items-center gap-2 text-title-subsection font-normal text-foreground mb-4">
                  <Sparkles size={20} className="text-primary" aria-hidden />
                  {t("detail.aiTitle")}
                </h3>
                <p className="text-body-sm text-muted">{t(`${key}.ai`)}</p>
              </div>
            )}
          </MotionDiv>

          {/* Stack */}
          <MotionDiv {...revealInView} className="max-w-3xl mx-auto">
            <h2 className="text-title-section font-normal text-foreground mb-6">{t("detail.stackTitle")}</h2>
            <ul className="flex flex-wrap gap-3">
              {product.stack.map((tech) => (
                <li
                  key={tech}
                  className="px-4 py-2 rounded-full border border-border/60 bg-surface text-body-sm font-mono text-muted"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </MotionDiv>

          {/* Anterior / Siguiente */}
          <div className="mt-20 md:mt-32 border-t border-border/30 pt-12 md:pt-16">
            <p className="text-label font-semibold uppercase tracking-[0.2em] text-muted mb-8">
              {t("detail.explore")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {[
                { item: prev, label: t("detail.previous") },
                { item: next, label: t("detail.next") },
              ].map(({ item, label }) => (
                <Link key={label} href={`/v3/products/${item.id}`} className="group block no-underline">
                  <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-4 border border-border/30 bg-surface">
                    <Image
                      src={item.image ?? PRODUCT_IMAGE_PLACEHOLDER}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <span className="text-label font-semibold uppercase tracking-[0.15em] text-muted mb-1 block">
                    {label}
                  </span>
                  <h3 className="text-title-card font-normal text-foreground group-hover:text-primary transition-colors mb-1">
                    {item.name}
                  </h3>
                  <p className="text-body-sm text-muted line-clamp-2">{t(`items.${item.id}.tagline`)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
