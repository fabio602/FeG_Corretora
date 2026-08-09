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
const GA_ID = 'G-ZER0B8WKQY'

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


// ── Conteúdo das modalidades para pré-renderização (SEO) ─────────────────────
const MODALIDADES_CONTENT = {
  '/seguro-garantia-licitante': {
    heading: 'Seguro Garantia',
    headingHighlight: 'Licitante (Proposta)',
    fullDesc: 'O Seguro Garantia Licitante garante que a empresa vencedora da licitação assina o contrato e cumpre as condições da proposta. Substitui a caução em dinheiro exigida pelos órgãos públicos.',
    benefits: ['Libera capital de giro', 'Aceito em todos os órgãos públicos', 'Emissão em até 2 horas', 'Custo a partir de R$ 150'],
  },
  '/seguro-garantia-execucao-contrato': {
    heading: 'Seguro Garantia de',
    headingHighlight: 'Execução de Contrato',
    fullDesc: 'Exigido após a assinatura do contrato público ou privado. Garante ao contratante que o contratado vai cumprir todas as obrigações previstas.',
    benefits: ['Exigido pela Lei 14.133/21', 'Valor: até 5% do contrato', 'Sem bloqueio de capital', 'Parceiros em todo o Brasil'],
  },
  '/seguro-garantia-judicial': {
    heading: 'Seguro Garantia',
    headingHighlight: 'Judicial',
    fullDesc: 'O Seguro Garantia Judicial substitui o depósito em dinheiro exigido em recursos e execuções fiscais. O art. 835, III do CPC garante o direito de usar o Seguro Garantia.',
    benefits: ['Libera o depósito recursal', 'Aceito na Receita Federal e SEFAZ', 'Capital disponível durante o processo', 'Emissão em horas'],
  },
  '/seguro-garantia-locaticia': {
    heading: 'Garantia',
    headingHighlight: 'Locatícia',
    fullDesc: 'A Garantia Locatícia substitui fiador e depósito caução em contratos de aluguel comercial. A Lei do Inquilinato (8.245/91) prevê o Seguro Garantia como modalidade aceita.',
    benefits: ['Sem imobilizar capital em caução', 'Sem precisar de fiador', 'Aprovação em horas', 'Aceito pelos principais imobiliários'],
  },
  '/seguro-garantia-adicional': {
    heading: 'Seguro Garantia',
    headingHighlight: 'Adicional',
    fullDesc: 'Quando a proposta vencedora fica abaixo de 85% do valor de referência do edital, a Lei 14.133/21 art. 59, § 5º exige Seguro Garantia Adicional. A F&G emite em até 2 horas.',
    benefits: ['Cumpre exigência do art. 59, § 5º', 'Emitido junto com o Licitante', 'Sem perder o contrato', 'Análise expressa'],
  },
  '/seguro-garantia-energia': {
    heading: 'Seguro Garantia de',
    headingHighlight: 'Compra e Venda de Energia (CCEE)',
    fullDesc: 'Para agentes habilitados na CCEE (mercado livre de energia). Garante operações de compra e venda de energia no mercado livre. Substitui o aporte de garantias financeiras exigido dos agentes.',
    benefits: ['Para agentes CCEE', 'Substitui depósito de margem', 'Libera capital operacional', 'Análise especializada'],
  },
}

function buildPrerender(slug) {
  const m = MODALIDADES_CONTENT['/' + slug] || MODALIDADES_CONTENT[slug]
  if (!m) return '<div id="root"></div>'
  const liItems = m.benefits.map(b => `<li style="padding:6px 0;color:#374151;font-size:15px;">✔ ${b}</li>`).join('\n        ')
  return `<div id="root"><div style="font-family:system-ui,sans-serif;max-width:960px;margin:0 auto;padding:48px 24px;">
  <h1 style="font-size:clamp(26px,3vw,40px);font-weight:800;color:#1C3A5E;line-height:1.2;margin:0 0 16px;">${m.heading} <span style="color:#E8572A;">${m.headingHighlight}</span></h1>
  <p style="font-size:16px;color:#4B5563;line-height:1.65;max-width:600px;margin:0 0 24px;">${m.fullDesc}</p>
  <ul style="margin:0;padding:0;list-style:none;">
        ${liItems}
  </ul>
</div></div>`
}

function buildRouteHtml({ title, description, canonical, og_title, og_description, og_image, slug }) {
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
  ${buildPrerender(slug)}
</body>
</html>
`
}

for (const [, route] of Object.entries(routes)) {
  if (!route.slug) continue
  const dir = join(DIST, route.slug)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.html'), buildRouteHtml({ ...route, slug: route.slug }))
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

// ── 8. FAQPage schema JSON-LD para artigos do blog ───────────────────────────
function stripHtmlTags(s) {
  return s
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ').trim()
}

function injectFAQSchema(html) {
  if (html.includes('"FAQPage"')) return html

  const faqs = []
  const detailsRe = /<details[\s\S]*?<\/details>/gi
  let m
  while ((m = detailsRe.exec(html)) !== null) {
    const block = m[0]
    const qm = /<summary[^>]*>([\s\S]*?)<\/summary>/i.exec(block)
    const am = /<div class="faq-body"[^>]*>([\s\S]*?)<\/div>/i.exec(block)
    if (qm && am) {
      const q = stripHtmlTags(qm[1])
      const a = stripHtmlTags(am[1])
      if (q && a) faqs.push({ q, a })
    }
  }
  if (faqs.length === 0) return html

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
    }))
  }, null, 2)

  const tag = `  <script type="application/ld+json">\n${schema}\n  </script>`
  return html.replace('</head>', tag + '\n</head>')
}

function injectFAQInBlogDir() {
  const blogDir = join(DIST, 'blog')
  if (!existsSync(blogDir)) return
  for (const slug of readdirSync(blogDir)) {
    const p = join(blogDir, slug, 'index.html')
    if (!existsSync(p)) continue
    const original = readFileSync(p, 'utf-8')
    const updated = injectFAQSchema(original)
    if (updated !== original) {
      writeFileSync(p, updated)
      console.log(`✅ FAQPage schema → /blog/${slug}/`)
    }
  }
}
injectFAQInBlogDir()

// ── 9. Sitemap: auto-incluir artigos do blog ──────────────────────────────────
function updateSitemapWithBlog() {
  const sitemapPath = join(DIST, 'sitemap.xml')
  if (!existsSync(sitemapPath)) { console.warn('⚠️  sitemap.xml não encontrado'); return }

  const blogDir = join(DIST, 'blog')
  if (!existsSync(blogDir)) return

  let sitemap = readFileSync(sitemapPath, 'utf-8')
  const newEntries = []

  for (const slug of readdirSync(blogDir)) {
    const articleHtml = join(blogDir, slug, 'index.html')
    if (!existsSync(articleHtml)) continue
    const html = readFileSync(articleHtml, 'utf-8')
    const cm = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)
    if (!cm) continue
    const url = cm[1]
    if (sitemap.includes(`<loc>${url}</loc>`)) continue
    newEntries.push(`  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
  }

  if (newEntries.length > 0) {
    sitemap = sitemap.replace('</urlset>', newEntries.join('\n') + '\n</urlset>')
    writeFileSync(sitemapPath, sitemap)
    console.log(`✅ sitemap.xml +${newEntries.length} artigo(s) do blog`)
  } else {
    console.log('✅ sitemap.xml já está atualizado')
  }
}
updateSitemapWithBlog()

// ── 10. Article schema (JSON-LD) para artigos do blog ────────────────────────
// Para adicionar outro autor: inclua entrada em scripts/blog-authors.json
// e adicione <meta name="article:author" content="chave-do-autor"> no artigo.
const authors = JSON.parse(readFileSync(join(__dirname, 'blog-authors.json'), 'utf-8'))

function injectArticleSchema(html) {
  // Skip if already has Article schema
  if (html.includes('"@type": "Article"') || html.includes('"@type":"Article"')) return html

  // Extract metadata from HTML
  const titleM = html.match(/<title>([^<]+)<\/title>/)
  const dateM  = html.match(/<time[^>]+datetime="([^"]+)"/)
  const authM  = html.match(/<meta name="article:author" content="([^"]+)"/)
  const canonM = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/)
  const descM  = html.match(/<meta name="description" content="([^"]+)"/)

  if (!titleM || !dateM) return html

  const authorKey = authM ? authM[1] : 'fabio-lima'
  const author    = authors[authorKey] || authors['fabio-lima']

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': titleM[1].replace(/ \| F&G$/, '').replace(/ \| F&amp;G$/, ''),
    'description': descM ? descM[1] : '',
    'datePublished': dateM[1],
    'dateModified':  dateM[1],
    'url': canonM ? canonM[1] : '',
    'author': {
      '@type': 'Person',
      'name': author.name,
      'jobTitle': author.jobTitle,
      'url': author.url
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'F&G Seguro Garantia',
      'url': 'https://fegsegurogarantia.com.br',
      'logo': { '@type': 'ImageObject', 'url': 'https://fegsegurogarantia.com.br/logo-shield.png' }
    },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': canonM ? canonM[1] : '' }
  }, null, 2)

  const tag = `  <script type="application/ld+json">\n${schema}\n  </script>`
  return html.replace('</head>', tag + '\n</head>')
}

function injectArticleSchemaInBlogDir() {
  const blogDir = join(DIST, 'blog')
  if (!existsSync(blogDir)) return
  for (const slug of readdirSync(blogDir)) {
    const p = join(blogDir, slug, 'index.html')
    if (!existsSync(p)) continue
    const original = readFileSync(p, 'utf-8')
    const updated = injectArticleSchema(original)
    if (updated !== original) {
      writeFileSync(p, updated)
      console.log(`✅ Article schema → /blog/${slug}/`)
    }
  }
}
injectArticleSchemaInBlogDir()
