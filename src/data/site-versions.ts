/**
 * Versiones publicadas del sitio, de la más nueva a la más antigua.
 *
 * Se muestran en /design-system. Al lanzar una versión nueva:
 *   1. Etiqueta en git el último commit de la versión saliente
 *      (p. ej. `git tag -a v3-produccion-pre-v4 <sha>`).
 *   2. Busca la URL del deploy de Vercel de ese commit (la deja la
 *      integración en GitHub → Deployments, o en el panel de Vercel).
 *   3. Cambia `current` a la nueva entrada y agrega la saliente con su URL.
 *
 * Los textos visibles (periodo y descripción) están en messages/*.json bajo
 * `DesignSystemPage.versions.items.<id>`.
 */

export type SiteVersion = {
  /** Clave de los textos en messages/*.json. */
  id: string;
  /** Etiqueta corta que se muestra como insignia. */
  label: string;
  url: string;
  /** Tag o rama de git donde vive el código de esa versión. */
  gitRef?: string;
  current?: boolean;
  /**
   * El deploy está tras la protección de Vercel (pide iniciar sesión en
   * Vercel). Quítalo si se hace público o se le asigna un dominio propio.
   */
  protected?: boolean;
};

export const SITE_VERSIONS: SiteVersion[] = [
  {
    id: "v3",
    label: "v3",
    url: "https://www.fcophox.com",
    gitRef: "main",
    current: true,
  },
  {
    id: "v2",
    label: "v2",
    url: "https://supercms-website-fcophox-j9j8rguoe-fcophox.vercel.app",
    gitRef: "v2-produccion-pre-v3",
    protected: true,
  },
];
