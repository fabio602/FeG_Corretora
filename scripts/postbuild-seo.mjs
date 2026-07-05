/**
 * postbuild-seo.mjs
 * Roda automaticamente após `vite build` (hook "postbuild" no package.json).
 *
 * O que faz:
 *  1. Lê dist/index.html gerado pelo Vite (tem os hashes atuais nos assets)
 *  2. Injeta SEO completo na home (dist/index.html)
 *  3. Para cada rota em seo-routes.json, gera dist/<rota>/index.html
 *     copiando os <script>/<link> do build atual + SEO específico da rota
 *  4. Garante que .htaccess, robots.txt e sitemap.xml estão em dist/
 *
 * Para adicionar uma nova rota: edite apenas scripts/seo-routes.json.
 */

import { readFileSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const DIST = join(ROOT, 'dist')
const PUBLIC = join(ROOT, 'public')

// ── 1. Carrega configuração de rotas ────────────────────────────────────────
const routes = JSON.parse(readFileSync(join(__dirname, 'seo-routes.json'), 'utf-8'))

// ── 2. Lê o index.html gerado pelo Vite ─────────────────────────────────────
const viteBuild = readFileSync(join(DIST, 'index.html'), 'utf-8')

// Extrai os <link> e <script> injetados pelo Vite (com hashes atuais)
const headTagsMatch = viteBuild.match(/<head>([\s\S]*?)<\/head>/)
const viteHeadContent = headTagsMatch ? headTagsMatch[1] : ''

// Captura apenas as tags de asset (link modulepreload, link stylesheet, scripts)
const assetTagsRegex = /<link[^>]+(?:rel="modulepreload"|rel="stylesheet")[^>]*>|<script[^>]+src="\/assets\/[^"]*"[^>]*><\/script>/g
const assetTags = (viteHeadContent.match(assetTagsRegex) || []).join('\n    ')

// ── 3. Função que monta um HTML completo ─────────────────────────────────────
function buildHtml(route) {
  const { title, description, canonical, og_title, og_description, og_image } = route

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO primário -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${og_title}" />
    <meta property="og:description" content="${og_description}" />
    <meta property="og:image" content="${og_image}" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="F&amp;G Corretora de Seguros" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${og_title}" />
    <meta name="twitter:description" content="${og_description}" />
    <meta name="twitter:image" content="${og_image}" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Assets do build Vite (hashes atuais) -->
    ${assetTags}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`
}

// ── 4. Injeta SEO na home (dist/index.html) ──────────────────────────────────
console.log('📄 Injetando SEO em dist/index.html (home)…')
writeFileSync(join(DIST, 'index.html'), buildHtml(routes.home))

// ── 5. Gera dist/<rota>/index.html para cada rota ────────────────────────────
for (const [key, route] of Object.entries(routes)) {
  if (!route.slug) continue // home já tratada acima
  const dir = join(DIST, route.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), buildHtml(route))
  console.log(`✅ dist/${route.slug}/index.html`)
}

// ── 6. Garante arquivos estáticos críticos em dist/ ─────────────────────────
const staticFiles = ['.htaccess', 'robots.txt', 'sitemap.xml', 'llms.txt']
for (const file of staticFiles) {
  const src = join(PUBLIC, file)
  const dest = join(DIST, file)
  if (existsSync(src)) {
    copyFileSync(src, dest)
    console.log(`📁 Copiado: ${file}`)
  } else {
    console.warn(`⚠️  Não encontrado em public/: ${file}`)
  }
}

console.log('\n🎉 postbuild-seo concluído!')
