"use client";

import { useSyncExternalStore } from "react";

/**
 * Consentimiento de cookies del visitante.
 *
 * Vive en localStorage, no en una cookie: sólo lo lee el navegador y así no
 * viaja en cada petición. Guardar la elección es una operación "estrictamente
 * necesaria", por lo que no requiere consentimiento previo.
 *
 * `version` permite volver a preguntar si cambian las categorías o la política:
 * al subirla, cualquier elección anterior se trata como inexistente.
 */
const STORAGE_KEY = "cookie-consent";
const VERSION = 1;
const CHANGE_EVENT = "cookie-consent-change";
const OPEN_EVENT = "cookie-consent-open";

export type Consent = {
  version: number;
  analytics: boolean;
  /** ISO: sirve de prueba de cuándo se dio o retiró el consentimiento. */
  updatedAt: string;
};

function read(): Consent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Consent;
    return parsed.version === VERSION ? parsed : null;
  } catch {
    return null;
  }
}

// useSyncExternalStore compara por identidad: se cachea la lectura por texto.
let cachedRaw: string | null | undefined;
let cachedValue: Consent | null = null;

function getSnapshot(): Consent | null {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = read();
  }
  return cachedValue;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  // Otra pestaña cambió la elección.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * `undefined` durante el render de servidor e hidratación (aún no se sabe),
 * `null` si el visitante no ha elegido, o la elección guardada.
 */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, getSnapshot, () => undefined);
}

export function saveConsent(analytics: boolean) {
  const hadAnalytics = read()?.analytics === true;
  const value: Consent = { version: VERSION, analytics, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {}
  window.dispatchEvent(new Event(CHANGE_EVENT));

  /*
   * Retirar el consentimiento debe ser tan efectivo como darlo. gtag.js ya
   * cargado no se puede descargar de la página, así que se borran sus cookies
   * y se recarga: en la recarga Analytics ya no se monta.
   */
  if (hadAnalytics && !analytics) {
    clearAnalyticsCookies();
    window.location.reload();
  }
}

/** Reabre el panel de preferencias (enlace del footer / política de cookies). */
export function openConsentPreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentPreferences(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

function clearAnalyticsCookies() {
  const host = window.location.hostname;
  // GA escribe en el dominio registrable (".fcophox.com"), no en "www".
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_") && name !== "_gid" && name !== "_gat") continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
