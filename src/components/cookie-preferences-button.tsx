"use client";

import { useTranslations } from "next-intl";
import { openConsentPreferences } from "@/utils/consent";

/** Reabre el toast de cookies en modo "preferencias". */
export function CookiePreferencesButton({ className }: { className?: string }) {
  const t = useTranslations("CookieConsent");
  return (
    <button type="button" onClick={openConsentPreferences} className={className}>
      {t("preferences")}
    </button>
  );
}
