import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { CookiePreferencesButton } from "@/components/cookie-preferences-button";
import { getLegalDoc, LEGAL_UPDATED, type LegalBlock, type LegalSlug } from "@/data/legal";

const URL_RE = /(https?:\/\/[^\s,]+[^\s,.])/g;

/** Convierte las URLs sueltas del texto en enlaces. */
function Text({ children }: { children: string }) {
  return children.split(URL_RE).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-foreground underline underline-offset-2 break-all">
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") {
    return <p className="text-muted leading-relaxed"><Text>{block}</Text></p>;
  }
  if ("list" in block) {
    return (
      <ul className="list-disc pl-5 flex flex-col gap-2 text-muted leading-relaxed marker:text-border">
        {block.list.map((item) => <li key={item}><Text>{item}</Text></li>)}
      </ul>
    );
  }
  return (
    <div className="-mx-6 px-6 overflow-x-auto sm:mx-0 sm:px-0">
      <table className="w-full min-w-[36rem] text-sm border-collapse">
        <thead>
          <tr>
            {block.table.head.map((h) => (
              <th key={h} className="text-left font-medium text-foreground border-b border-border/60 py-2 pr-4 align-bottom">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {block.table.rows.map((row) => (
            <tr key={row[0]} className="border-b border-border/30 last:border-0">
              {row.map((cell, i) => (
                <td key={i} className={`py-3 pr-4 align-top leading-relaxed ${i === 0 ? "text-foreground font-mono text-[13px]" : "text-muted"}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function LegalPage({ slug }: { slug: LegalSlug }) {
  const locale = await getLocale();
  const t = await getTranslations("Legal");
  const doc = getLegalDoc(slug, locale);

  const updated = new Date(`${LEGAL_UPDATED}T00:00:00`).toLocaleDateString(
    locale === "en" ? "en-US" : "es-ES",
    { day: "numeric", month: "long", year: "numeric" },
  );

  const others = (["privacy", "cookies", "terms"] as const).filter((s) => s !== slug);

  return (
    <main className="w-full overflow-x-hidden flex-1 flex flex-col items-center justify-start pt-8 pb-32">
      <div className="max-w-3xl mx-auto px-6 w-full">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("backHome")}
          </Link>
        </div>

        <header className="mb-14">
          <h1 className="text-4xl md:text-[3.5rem] font-normal text-foreground mb-6 leading-tight tracking-tight text-balance">
            {doc.title}
          </h1>
          <p className="text-sm text-muted mb-6">{t("updated", { date: updated })}</p>
          <p className="text-lg text-muted leading-relaxed text-pretty">{doc.intro}</p>
          {slug === "cookies" && (
            <CookiePreferencesButton className="mt-8 inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary/90 transition-colors" />
          )}
        </header>

        <div className="flex flex-col gap-12">
          {doc.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-4">
              <h2 className="text-xl font-medium text-foreground">{section.heading}</h2>
              {section.blocks.map((block, i) => <Block key={i} block={block} />)}
            </section>
          ))}
        </div>

        <nav className="mt-20 pt-8 border-t border-border/50 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {others.map((s) => (
            <Link key={s} href={`/legal/${s}`} className="text-muted hover:text-foreground transition-colors">
              {getLegalDoc(s, locale).title}
            </Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
