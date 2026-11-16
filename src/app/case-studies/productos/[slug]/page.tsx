import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";

import { ArticleLayout } from "@/components/article-layout";
import { ProductCta } from "@/components/product-cta";
import { PRODUCTS, PRODUCT_IMAGE_PLACEHOLDER } from "@/data/v3-products";
import { porSlugLocalizado } from "@/utils/kontororu-i18n";
import { resumenDe } from "@/utils/kontororu-adapter";

export const revalidate = 3600; // el webhook invalida antes; ver blog/page.tsx

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Página interna de un producto propio (Kanri, Tanzō, Mozo…).
 *
 * El contenido se escribe en Kontorōru como una entrada cuyo slug es el `id`
 * del producto en src/data/v3-products.ts (`kanri`, `tanzo`, `mozo`). Conviene
 * ponerla en una categoría propia y no en «casos-de-estudio», para que no se
 * repita en el listado de arriba de /case-studies.
 *
 * Mientras esa entrada no exista (o siga en borrador) se muestra un aviso de
 * «en preparación» con los datos del producto, en vez de un 404.
 */
async function cargar(slug: string) {
  const product = PRODUCTS.find((p) => p.id === slug.toLowerCase());
  if (!product) return null;

  /*
   * Si Kontorōru no responde (Render dormido, red caída) se muestra el aviso
   * en vez de un 500: la página tiene contenido propio de sobra para eso. El
   * error queda en el log para no esconder, p. ej., una API Key caducada.
   */
  let post: Awaited<ReturnType<typeof porSlugLocalizado>> = null;
  try {
    post = await porSlugLocalizado(product.id);
  } catch (error) {
    console.error(`[productos/${product.id}] No se pudo leer Kontorōru:`, error);
  }
  return { product, post };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await cargar(slug);
  const t = await getTranslations("ProductCasePage");

  if (!data) return { title: t("notFoundTitle") };

  const { product, post } = data;
  const tp = await getTranslations("V3.Products.items");
  const description = post ? resumenDe(post) : tp(`${product.id}.description`);

  return {
    title: post?.seo?.title || post?.title || product.name,
    description,
    openGraph: {
      title: post?.title || product.name,
      description,
      url: `/case-studies/productos/${product.id}`,
      type: "article",
      siteName: "Fcophox",
      images: post?.cover ? [{ url: post.cover.url, alt: post.cover.alt ?? post.title }] : undefined,
    },
  };
}

export default async function ProductCasePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await cargar(slug);
  if (!data) notFound();

  const { product, post } = data;
  const t = await getTranslations("ProductCasePage");
  const tp = await getTranslations("V3.Products.items");

  const common = {
    category: t("category"),
    gradient: "from-primary/20 via-secondary/5 to-transparent",
    backHref: "/case-studies#productos-propios",
    backLabel: t("back"),
  };

  if (post) {
    return (
      <ArticleLayout
        {...common}
        title={post.title}
        description={resumenDe(post)}
        date={new Date(post.publishedAt).getFullYear().toString()}
        imageUrl={post.cover?.url}
        slug={post.slug}
        footerSection={<ProductCta product={product} />}
      >
        {/* HTML saneado por Kontorōru al guardar; ver case-studies/[slug]/page.tsx. */}
        <div
          className="tiptap-content tiptap-sections max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />
      </ArticleLayout>
    );
  }

  return (
    <ArticleLayout
      {...common}
      title={product.name}
      description={tp(`${product.id}.description`)}
      date=""
      imageUrl={product.image ?? PRODUCT_IMAGE_PLACEHOLDER}
    >
      <div className="max-w-[760px] mx-auto w-full">
        <p className="text-subtitle text-muted mb-12 text-pretty">{tp(`${product.id}.description`)}</p>

        <div className="rounded-3xl bg-surface p-6 md:p-10">
          <p className="text-label font-mono uppercase text-foreground/80 mb-4">{t("comingSoonLabel")}</p>
          <h2 className="text-title-subsection font-normal text-foreground mb-4">{t("comingSoonTitle")}</h2>
          <p className="text-muted mb-6">{t("comingSoonText")}</p>
          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
            >
              {t("visit")} {product.name}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </ArticleLayout>
  );
}
