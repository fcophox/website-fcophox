import { getTranslations } from "next-intl/server";

import { HoverField } from "@/components/hover-field";

type Pillar = { title: string; description: string };

/** Propuesta de valor: entender, diseñar, construir. */
export async function PillarsV3() {
  const t = await getTranslations("V3.Pillars");
  const items = t.raw("items") as Pillar[];

  return (
    <section className="w-full relative z-10 bg-background py-16 md:py-24">
      <div className="dm-container">
        <p className="text-label font-mono uppercase text-foreground/80 mb-4">{t("label")}</p>
        <h2 className="text-title-section font-normal text-foreground md:max-w-[750px] mb-12 text-balance">
          {t("title")}
        </h2>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <HoverField
              key={item.title}
              as="li"
              className="relative overflow-hidden rounded-3xl bg-surface text-foreground p-6 md:p-8 flex flex-col gap-16 min-h-[300px] md:min-h-[400px] transition-colors duration-300 hover:bg-border/60"
            >
              <div className="relative">
                <span className="block text-title-subsection font-normal opacity-70 mb-2" aria-hidden>
                  0{i + 1}
                </span>
                <h3 className="text-title-subsection font-normal">{item.title}</h3>
              </div>
              <p className="relative mt-auto text-muted">{item.description}</p>
            </HoverField>
          ))}
        </ol>
      </div>
    </section>
  );
}
