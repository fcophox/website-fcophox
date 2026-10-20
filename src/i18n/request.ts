import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'es';

  /*
   * Los textos de la versión en construcción (/v3) viven aparte para no
   * mezclarse con los de producción. Al publicarla, se integran en el archivo
   * principal y esta fusión desaparece.
   */
  const [base, v3] = await Promise.all([
    import(`../../messages/${locale}.json`),
    import(`../../messages/v3.${locale}.json`),
  ]);

  return {
    locale,
    messages: {...base.default, V3: v3.default}
  };
});
