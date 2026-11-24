/**
 * ¿Es una URL firmada de Supabase Storage?
 *
 * El optimizador de Vercel indexa su caché por la URL de origen. Las portadas
 * del CMS llegan firmadas y la firma se renueva cada hora, así que cada
 * renovación es una imagen "nueva": se vuelve a transformar y a escribir en
 * caché en todos sus anchos sin que nadie la haya vuelto a leer. Eso era lo que
 * agotaba la cuota de Image Optimization del plan Hobby.
 *
 * Estas imágenes se sirven tal cual (`unoptimized`): Supabase ya las entrega
 * comprimidas y su CDN las cachea.
 */
export function isSignedStorageUrl(src: unknown): boolean {
  if (typeof src !== "string" || !/^https?:\/\//.test(src)) return false;
  try {
    const url = new URL(src);
    return url.pathname.includes("/storage/v1/object/sign/") || url.searchParams.has("token");
  } catch {
    return false;
  }
}
