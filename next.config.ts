import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { SLUG_REDIRECTS } from "./src/data/slug-redirects";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    /*
     * Ajustes para no agotar la cuota de Image Optimization de Vercel, que
     * cuenta cada variante generada (transformación) y sus KB escritos en caché:
     *
     * - `deviceSizes` sin 2048 ni 3840: en un `fill` sin `sizes` Next ofrecía
     *   hasta 3840 px, y cada variante de ese tamaño son cientos de KB escritos.
     * - `minimumCacheTTL` de 31 días: las imágenes locales se indexan por su
     *   contenido, así que cambiar el archivo ya invalida la caché por sí solo.
     *   Las portadas firmadas del CMS no pasan por el optimizador (ver
     *   `isSignedStorageUrl`), así que este valor no choca con su caducidad.
     * - `localPatterns` con `search: ''`: sin query strings, cada `?v=` distinto
     *   sería otra entrada en caché.
     *
     * `qualities` ([75]) y `formats` (webp) ya son los valores por defecto de
     * Next 16.
     */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    minimumCacheTTL: 2678400,
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        // Biblioteca de medios de Kontorōru: portadas e imágenes del contenido.
        // URLs firmadas con 24 h de validez, no rutas permanentes.
        protocol: 'https',
        hostname: 'glepekbxevoowijfzywe.supabase.co',
      },
    ],
  },
  /**
   * Los slugs cambiaron al migrar a Kontorōru y las URLs anteriores están
   * indexadas. Sin esto quedan 12 páginas en 404.
   *
   * Van aquí y no en src/middleware.ts a propósito: se resuelven antes de que
   * el middleware corra, así que una redirección no arrastra la comprobación
   * de sesión de Supabase.
   */
  async redirects() {
    return [
      ...SLUG_REDIRECTS.map(({ base, from, to }) => ({
        source: `${base}/${from}`,
        destination: `${base}/${to}`,
        permanent: true,
      })),
      // La v3 pasó a ser la home; los enlaces viejos a /v3 siguen funcionando.
      { source: "/v3", destination: "/", permanent: true },
      { source: "/v3/products/:slug", destination: "/products/:slug", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
