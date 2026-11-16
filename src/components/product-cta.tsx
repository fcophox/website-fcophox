import { getTranslations } from "next-intl/server";
import { ArrowUpRight, PlayCircle } from "lucide-react";

import type { Product } from "@/data/v3-products";

const GithubMark = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.1 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
  </svg>
);

const SECONDARY =
  "px-8 py-3 rounded-full bg-surface text-foreground font-medium border border-border flex items-center justify-center gap-2";

/**
 * Cierre de la página de un producto propio: en lugar de pedir un «me gusta»,
 * invita a usar el producto. «Ver demo» queda desactivado hasta que exista, y
 * «Ver GitHub» aparece sólo en los productos con `github` definido.
 */
export async function ProductCta({ product }: { product: Product }) {
  const t = await getTranslations("ProductCasePage.cta");

  return (
    <div className="w-full mt-24 flex flex-col items-center text-center gap-5">
      <h3 className="text-title-subsection font-medium text-foreground text-balance">
        {t(`${product.id}.title`)}
      </h3>
      <p className="text-subtitle text-muted max-w-xl text-pretty">{t(`${product.id}.text`)}</p>

      <div className="mt-4 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {product.url && (
          <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-primary text-background font-medium hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            {t("viewProduct")}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </a>
        )}
        <button
          type="button"
          disabled
          title={t("demoSoon")}
          className={`${SECONDARY} opacity-50 cursor-not-allowed`}
        >
          <PlayCircle className="w-4 h-4" aria-hidden />
          {t("viewDemo")}
        </button>
        {product.github === null && (
          <button
            type="button"
            disabled
            title={t("githubSoon")}
            className={`${SECONDARY} opacity-50 cursor-not-allowed`}
          >
            <GithubMark className="w-4 h-4" />
            {t("viewGithub")}
          </button>
        )}
        {product.github && (
          <a
            href={product.github}
            target="_blank"
            rel="noopener noreferrer"
            className={`${SECONDARY} hover:scale-105 transition-transform duration-200`}
          >
            <GithubMark className="w-4 h-4" />
            {t("viewGithub")}
          </a>
        )}
      </div>
    </div>
  );
}
