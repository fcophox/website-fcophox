import { getTranslations } from "next-intl/server";
import { Code2, PenTool, Search } from "lucide-react";

const ICONS = [Search, PenTool, Code2];

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

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Code2;
            return (
              <li
                key={item.title}
                className="relative overflow-hidden rounded-3xl bg-surface p-8 flex flex-col gap-6 min-h-[260px]"
              >
                <div className="flex items-center justify-between">
                  <span className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                    <Icon size={20} aria-hidden />
                  </span>
                  <span className="text-label font-mono text-muted" aria-hidden>
                    0{i + 1}
                  </span>
                </div>
                <div className="mt-auto">
                  <h3 className="text-title-subsection font-normal text-foreground mb-3">{item.title}</h3>
                  <p className="text-body-sm text-muted">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
