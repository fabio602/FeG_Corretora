/**
 * Converte qualquer slug ou path interno em URL navegável com barra final.
 * Use em TODO destino de <Link to>, navigate() e href que aponte para rota interna.
 *
 * routePath('/seguro-garantia-licitante') → '/seguro-garantia-licitante/'
 * routePath('/')                           → '/'   (home já tem barra)
 * routePath('/blog/')                      → '/blog/' (idempotente)
 */
export const routePath = (slug: string): string =>
  slug.endsWith('/') ? slug : slug + '/'
