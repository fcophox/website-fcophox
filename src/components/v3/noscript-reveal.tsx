/*
 * Sin JavaScript, los bloques que framer-motion revela al entrar en pantalla se
 * quedan con la opacidad 0 que el servidor les escribió inline, y las secciones
 * afectadas aparecen vacías (el hero, sobre todo). Este <noscript> lo parsea el
 * navegador sólo cuando no ejecuta scripts; con scripts su contenido es texto
 * plano y no aplica. El `!important` es obligatorio: lo que hay que ganar son
 * estilos inline. Lo usan la home y las páginas de producto.
 */
export function NoscriptReveal() {
  return (
    <noscript>
      <style
        dangerouslySetInnerHTML={{
          __html: "[data-reveal]{opacity:1 !important;transform:none !important}",
        }}
      />
    </noscript>
  );
}
