"use client";

import { Suspense, useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { GoogleAnalytics } from "@next/third-parties/google";

import { GoogleAnalyticsPageview } from "@/components/google-analytics-pageview";
import { onOpenConsentPreferences, saveConsent, useConsent } from "@/utils/consent";

const GA_ID = "G-N30VCBN4MR";

/**
 * Google Analytics sólo se monta con consentimiento explícito. Antes se cargaba
 * siempre, lo que bajo el RGPD/ePrivacy y la Ley 21.719 exige consentimiento
 * previo: una cookie analítica no es "estrictamente necesaria".
 */
export function ConsentedAnalytics() {
  const consent = useConsent();
  if (!consent?.analytics) return null;

  return (
    <>
      <GoogleAnalytics gaId={GA_ID} />
      <Suspense fallback={null}>
        <GoogleAnalyticsPageview />
      </Suspense>
    </>
  );
}

/**
 * Aviso de cookies como toast inferior.
 *
 * Reglas que cumple (RGPD, guía EDPB 03/2022 sobre patrones engañosos, Ley
 * chilena 21.719): nada opcional se activa antes de elegir; "Rechazar" está al
 * mismo nivel y con el mismo esfuerzo que "Aceptar"; sin casillas premarcadas;
 * y la elección se puede cambiar en cualquier momento desde el footer.
 */
export function CookieConsent() {
  const t = useTranslations("CookieConsent");
  const consent = useConsent();
  const [forcedOpen, setForcedOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const titleId = useId();
  const descId = useId();

  useEffect(
    () =>
      onOpenConsentPreferences(() => {
        setAnalytics(consent?.analytics ?? false);
        setShowSettings(true);
        setForcedOpen(true);
      }),
    [consent],
  );

  // `undefined` = aún hidratando: no se pinta para no parpadear.
  const open = consent !== undefined && (consent === null || forcedOpen);

  const decide = (value: boolean) => {
    setForcedOpen(false);
    setShowSettings(false);
    saveConsent(value);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.section
          role="dialog"
          aria-modal="false"
          aria-labelledby={titleId}
          aria-describedby={descId}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", duration: 0.45, bounce: 0.15 }}
          /* z-40: por encima del ChromaticEdge (z-30) para que no lo distorsione. */
          className="fixed z-40 bottom-4 inset-x-4 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:w-[26rem] rounded-2xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/40 p-5 text-foreground"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
              <Cookie className="h-4 w-4" aria-hidden />
            </span>
            <div className="flex-1 min-w-0">
              <h2 id={titleId} className="text-sm font-semibold">
                {t("title")}
              </h2>
              <p id={descId} className="mt-1.5 text-[13px] leading-relaxed text-muted text-pretty">
                {t.rich("description", {
                  cookies: (chunks) => (
                    <Link href="/legal/cookies" className="underline underline-offset-2 hover:text-foreground">
                      {chunks}
                    </Link>
                  ),
                  privacy: (chunks) => (
                    <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-foreground">
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            </div>
            {consent && (
              <button
                type="button"
                onClick={() => setForcedOpen(false)}
                aria-label={t("close")}
                className="-mr-1 -mt-1 rounded-full p-1.5 text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <AnimatePresence initial={false}>
            {showSettings && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden"
              >
                <ul className="mt-4 flex flex-col gap-2">
                  <li className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-surface/40 p-3">
                    <div>
                      <p className="text-[13px] font-medium">{t("necessaryTitle")}</p>
                      <p className="mt-0.5 text-xs text-muted leading-relaxed">{t("necessaryDesc")}</p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-muted">{t("alwaysOn")}</span>
                  </li>
                  <li className="flex items-start justify-between gap-4 rounded-xl border border-border/40 bg-surface/40 p-3">
                    <label htmlFor={`${titleId}-analytics`} className="cursor-pointer">
                      <span className="block text-[13px] font-medium">{t("analyticsTitle")}</span>
                      <span className="mt-0.5 block text-xs text-muted leading-relaxed">{t("analyticsDesc")}</span>
                    </label>
                    <button
                      id={`${titleId}-analytics`}
                      type="button"
                      role="switch"
                      aria-checked={analytics}
                      onClick={() => setAnalytics((v) => !v)}
                      className={`relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors ${analytics ? "bg-primary" : "bg-border"}`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${analytics ? "translate-x-4" : ""}`}
                      />
                    </button>
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {showSettings ? (
              <button
                type="button"
                onClick={() => decide(analytics)}
                className="flex-1 rounded-full bg-primary px-4 py-2 text-[13px] font-medium text-white hover:bg-primary/90 transition-colors"
              >
                {t("save")}
              </button>
            ) : (
              <>
                {/* Mismo tamaño y peso visual: rechazar no puede costar más que aceptar. */}
                <button
                  type="button"
                  onClick={() => decide(false)}
                  className="flex-1 rounded-full border border-border/80 px-4 py-2 text-[13px] font-medium hover:bg-surface transition-colors"
                >
                  {t("reject")}
                </button>
                <button
                  type="button"
                  onClick={() => decide(true)}
                  className="flex-1 rounded-full border border-primary bg-primary px-4 py-2 text-[13px] font-medium text-white hover:bg-primary/90 transition-colors"
                >
                  {t("accept")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAnalytics(consent?.analytics ?? false);
                    setShowSettings(true);
                  }}
                  className="w-full pt-1 text-xs text-muted underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  {t("customize")}
                </button>
              </>
            )}
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  );
}
