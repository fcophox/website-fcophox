import { getTranslations } from "next-intl/server";
import { ArrowUpRight, PlayCircle } from "lucide-react";

import type { Product } from "@/data/v3-products";

/**
 * Cierre de la página de un producto propio: en lugar de pedir un «me gusta»,
 * invita a usar el producto. «Ver demo» queda desactivado hasta que exista.
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
          className="px-8 py-3 rounded-full bg-surface text-foreground font-medium border border-border flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
        >
          <PlayCircle className="w-4 h-4" aria-hidden />
          {t("viewDemo")}
        </button>
      </div>
    </div>
  );
}
