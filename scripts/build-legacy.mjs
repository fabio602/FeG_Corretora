/**
 * build-legacy.mjs
 *
 * Monta dist/ a partir do bundle compilado "perfeito" (sem recompilar via Vite).
 * Usado como script "build" no package.json.
 *
 * Para trocar o ID do GA4: altere GA_ID abaixo e reimplante.
 */

import {
  readFileSync, writeFileSync, mkdirSync, copyFileSync,
  existsSync, readdirSync, rmSync, statSync
} from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT    = join(__dirname, '..')
const DIST    = join(ROOT, 'dist')
const PUBLIC  = join(ROOT, 'public')
const LEGACY  = join(ROOT, 'legacy')

// ── Google Analytics 4 ───────────────────────────────────────────────────────
// Troque G-XXXXXXXXXX pelo seu Measurement ID real e reimplante.
const GA_ID = 'G-XXXXXXXXXX'

const GA4_SNIPPET = `
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_ID}', {send_page_view: false});
  </script>
  <script src="/ga4-spa.js" defer></script>`

/** Injeta o snippet GA4 antes de </head> em qualquer HTML que ainda não o tenha. */
function injectGA4(html) {
  if (html.includes('gtag(') || html.includes('googletagmanager')) return html
  return html.replace('</head>', GA4_SNIPPET + '\n</head>')
}

/** Percorre um diretório e injeta GA4 em todos os .html encontrados. */
function injectGA4InDir(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry)
    if (statSync(p).isDirectory()) {
      injectGA4InDir(p)
    } else if (entry.endsWith('.html')) {
      const original = readFileSync(p, 'utf-8')
      const updated  = injectGA4(original)
      if (updated !== original) writeFileSync(p, updated)
    }
  }
}

// ── 1. Limpa e recria dist/ ─────────────────────────────────────────────────
console.log('🗑️  Limpando dist/…')
if (existsSync(DIST)) rmSync(DIST, { recursive: true })
mkdirSync(join(DIST, 'assets'), { recursive: true })

// ── 2. Copia bundle antigo ──────────────────────────────────────────────────
console.log('📦 Copiando bundle legado…')
copyFileSync(join(LEGACY, 'assets', 'index-NhH1a0sw.js'),  join(DIST, 'assets', 'index-NhH1a0sw.js'))
copyFileSync(join(LEGACY, 'assets', 'index-WV0uOuMe.css'), join(DIST, 'assets', 'index-WV0uOuMe.css'))

// ── 3. Copia scripts de injeção ─────────────────────────────────────────────
for (const f of ['hero-v4.js', 'reviews.js', 'ui-fixes.js', 'scroll-top.js']) {
  copyFileSync(join(LEGACY, f), join(DIST, f))
}
console.log('✅ Scripts de injeção copiados')

// ── 4. Copia public/ recursivamente ─────────────────────────────────────────
function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const s = join(src, entry)
    const d = join(dest, entry)
    statSync(s).isDirectory() ? copyDir(s, d) : copyFileSync(s, d)
  }
}
copyDir(PUBLIC, DIST)
console.log('✅ public/ copiado para dist/')

// ── 5. Escreve dist/index.html (home) ───────────────────────────────────────
const homeHtml = readFileSync(join(LEGACY, 'index.html'), 'utf-8')
writeFileSync(join(DIST, 'index.html'), injectGA4(homeHtml))
console.log('✅ dist/index.html (home)')

// ── 6. Gera dist/<rota>/index.html com SEO + GA4 ───────────────────────────
const routes = JSON.parse(readFileSync(join(__dirname, 'seo-routes.json'), 'utf-8'))

const ASSET_BLOCK = `  <script src="/scroll-top.js" defer></script>
  <script type="module" crossorigin src="/assets/index-NhH1a0sw.js"></script>
  <link rel="preload" as="style" href="/assets/index-WV0uOuMe.css">
  <link rel="stylesheet" crossorigin href="/assets/index-WV0uOuMe.css">
  <script src="/hero-v4.js" defer></script>
  <script src="/reviews.js" defer></script>
  <script src="/ui-fixes.js" defer></script>`

function buildRouteHtml({ title, description, canonical, og_title, og_description, og_image }) {
  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${og_title}" />
  <meta property="og:description" content="${og_description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="F&amp;G Seguro Garantia" />
  <meta property="og:image" content="${og_image}" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#1C3A5E" />

  <!-- Preconnect -->
  <link rel="preconnect" href="https://images.unsplash.com" />
  <link rel="preconnect" href="https://formsubmit.co" />
  <link rel="dns-prefetch" href="https://hub.fegsegurogarantia.com" />
  <link rel="dns-prefetch" href="https://wa.me" />

  <!-- Preload logo (LCP) -->
  <link rel="preload" href="/logo-shield.webp" as="image" type="image/webp" />

  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/png" href="/favicon.png" sizes="64x64" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
${GA4_SNIPPET}

${ASSET_BLOCK}
</head>
<body>
  <div id="root"></div>
</body>
</html>
`
}

for (const [, route] of Object.entries(routes)) {
  if (!route.slug) continue
  const dir = join(DIST, route.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), buildRouteHtml(route))
  console.log(`✅ dist/${route.slug}/index.html`)
}

// ── Blog listing ─────────────────────────────────────────────────────────────
const blogListing = join(LEGACY, 'blog-index.html')
if (existsSync(blogListing)) {
  mkdirSync(join(DIST, 'blog'), { recursive: true })
  const listing = readFileSync(blogListing, 'utf-8')
  writeFileSync(join(DIST, 'blog', 'index.html'), injectGA4(listing))
  console.log('✅ dist/blog/index.html (listing)')
}

// ── 7. Injeta GA4 em todos os HTMLs estáticos (artigos do blog, etc.) ────────
injectGA4InDir(DIST)
console.log('✅ GA4 injetado em todos os HTMLs')

console.log('\n🎉 Build legado concluído com sucesso!')
