/**
 * build-blog.mjs
 * Gera dist/blog/{slug}/index.html a partir de content/blog/{slug}.md
 * e dist/blog/index.html com a nova listagem visual.
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const matter  = require('gray-matter')
const { marked } = require('marked')

const __dirname = dirname(fileURLToPath(import.meta.url))
const CONTENT   = join(__dirname, '..', 'content', 'blog')
const DIST_BLOG = join(__dirname, '..', 'dist', 'blog')
const SITEMAP   = join(__dirname, '..', 'dist', 'sitemap.xml')
const TEMPLATE  = readFileSync(join(__dirname, 'blog-template.html'), 'utf-8')
const WA_URL    = 'https://wa.me/5515998618659?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20gratuita%20de%20Seguro%20Garantia.'
const BASE_URL  = 'https://fegsegurogarantia.com.br'

// ── Categorias validas (build quebra se valor divergir) ───────────────────────
export const VALID_CATEGORIES = [
  'Licitação',
  'Execução de Contrato',
  'Judicial',
  'Trabalhista',
  'Locatício',
  'Responsabilidade Civil',
  'Cyber',
  'Para o seu negócio',
]

// ── Cores dos selos de categoria ──────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Licitação':             { bg: '#DBEAFE', text: '#1E3A8A' },
  'Execução de Contrato':  { bg: '#DCFCE7', text: '#14532D' },
  'Judicial':              { bg: '#EDE9FE', text: '#4C1D95' },
  'Trabalhista':           { bg: '#FEF3C7', text: '#78350F' },
  'Locatício':             { bg: '#CCFBF1', text: '#134E4A' },
  'Responsabilidade Civil':{ bg: '#FFE4E6', text: '#881337' },
  'Cyber':                 { bg: '#F3E8FF', text: '#581C87' },
  'Para o seu negócio':    { bg: '#E0E7FF', text: '#1E1B4B' },
}

// ── Conteudos ricos (editavel aqui) ──────────────────────────────────────────
const RICH_CONTENTS = [
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8572A" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    title: 'Simulador de garantia da Lei 14.133',
    desc: 'Calcule o valor da garantia exigida pelo edital em poucos cliques.',
    link: '/blog/garantia-de-proposta-lei-14133/',
    ativo: true,
  },
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8572A" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    title: 'Qual modalidade de Seguro Garantia voce precisa?',
    desc: 'Responda 3 perguntas e descubra a apolice certa para o seu contrato.',
    link: '/blog/o-que-e-seguro-garantia/',
    ativo: true,
  },
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8572A" stroke-width="2" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    title: 'Checklist do licitante',
    desc: 'Lista completa de documentos e etapas antes de enviar a proposta.',
    link: '/materiais/checklist-licitante/',
    ativo: false,
  },
  {
    icon: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8572A" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    title: 'Planilha de controle de licitacoes',
    desc: 'Organize processos e prazos em uma planilha pronta para uso.',
    link: '/materiais/planilha-licitacoes/',
    ativo: false,
  },
]

// ── Frontmatter obrigatorio ───────────────────────────────────────────────────
const REQUIRED_FIELDS = ['slug', 'title', 'description', 'canonical', 'date', 'category', 'readingTime', 'author']

// ── Meses em portugues ────────────────────────────────────────────────────────
const MONTHS_PT = ['janeiro','fevereiro','março','abril','maio','junho',
                   'julho','agosto','setembro','outubro','novembro','dezembro']

function isoToDisplayDate(iso) {
  if (iso instanceof Date) iso = iso.toISOString().slice(0, 10)
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MONTHS_PT[m - 1]} de ${y}`
}

function isoString(iso) {
  if (iso instanceof Date) return iso.toISOString().slice(0, 10)
  return String(iso)
}

// ── Validacoes ────────────────────────────────────────────────────────────────
function validateFrontmatter(fm, file) {
  const errors = []
  for (const f of REQUIRED_FIELDS) {
    if (!fm[f]) errors.push(`campo obrigatorio ausente: "${f}"`)
  }
  if (!VALID_CATEGORIES.includes(fm.category)) {
    errors.push(`category invalida: "${fm.category}". Validas: ${VALID_CATEGORIES.join(', ')}`)
  }
  if (errors.length) {
    throw new Error(`[blog-build] ERRO em ${file}:\n  ${errors.join('\n  ')}`)
  }
}

function validateNoH1InBody(body, file) {
  const h1Lines = body.split('\n').filter(l => /^# /.test(l))
  if (h1Lines.length) {
    console.warn('[blog] AVISO ' + file + ': corpo tem "# " (H1). Use ## para secoes.')
  }
}

// ── Capa SVG automatica ───────────────────────────────────────────────────────
function generateCoverSVG(slug, title, category) {
  const color = CATEGORY_COLORS[category] || { bg: '#DBEAFE', text: '#1E3A8A' }

  // Split title into up to 3 lines of ~36 chars
  const words = title.replace(/"/g, '&quot;').split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 36 && line) {
      lines.push(line.trim())
      line = w
    } else {
      line = (line + ' ' + w).trim()
    }
    if (lines.length === 2) { line = words.slice(words.indexOf(w) + 1).join(' ') || ''; break }
  }
  if (line) lines.push(line.trim())

  const titleY = lines.length === 1 ? 310 : lines.length === 2 ? 290 : 270
  const lineH = 64

  const titleSVG = lines.map((l, i) =>
    `<text x="72" y="${titleY + i * lineH}" font-family="Georgia,serif" font-size="52" font-weight="700" fill="white">${l}</text>`
  ).join('\n  ')

  const catText = category.toUpperCase()

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1C3A5E"/>
      <stop offset="100%" stop-color="#0F2035"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="0" y="0" width="12" height="630" fill="#E8572A"/>
  <rect x="0" y="530" width="1200" height="100" fill="rgba(0,0,0,0.25)"/>
  <rect x="56" y="72" width="auto" height="36" rx="6" fill="${color.bg}"/>
  <text x="72" y="98" font-family="Arial,sans-serif" font-size="22" font-weight="700" fill="${color.text}" letter-spacing="2">${catText}</text>
  ${titleSVG}
  <text x="72" y="578" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.7)">fegsegurogarantia.com.br</text>
  <text x="1128" y="578" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="rgba(255,255,255,0.5)" text-anchor="end">F&amp;G</text>
</svg>`
}

// ── JSON-LD schemas ───────────────────────────────────────────────────────────
function buildArticleSchema(fm, ogImage) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    author: { '@type': 'Person', name: fm.author, jobTitle: 'Especialista em Seguro Garantia' },
    publisher: { '@type': 'Organization', name: 'F&G Seguro Garantia',
      url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-shield.png` } },
    datePublished: isoString(fm.date),
    dateModified: fm.updated ? isoString(fm.updated) : isoString(fm.date),
    url: fm.canonical,
    image: ogImage,
    mainEntityOfPage: fm.canonical,
  }, null, 2)
}

function buildFAQSchema(faqItems) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }, null, 2)
}

// ── Render one .md -> HTML ────────────────────────────────────────────────────
function renderArticle(mdPath) {
  const raw  = readFileSync(mdPath, 'utf-8')
  const file = mdPath.split('/').pop()

  let parsed
  try { parsed = matter(raw) }
  catch (e) { throw new Error(`[blog-build] ERRO ao parsear ${file}: ${e.message}`) }

  const fm   = parsed.data
  const body = parsed.content.trim()

  validateFrontmatter(fm, file)
  validateNoH1InBody(body, file)

  // og:image: PNG/JPG para redes sociais (WhatsApp, LinkedIn, Facebook nao renderizam SVG)
  // cardImage: SVG gerado automaticamente ou imagem do autor para os cards da listagem
  let ogImage
  let cardImage
  // Gera sempre a capa SVG (usada nos cards da listagem)
  const capaDir = join(DIST_BLOG, 'capas')
  mkdirSync(capaDir, { recursive: true })
  writeFileSync(join(capaDir, `${fm.slug}.svg`), generateCoverSVG(fm.slug, fm.title, fm.category))

  if (fm.image && fm.image.trim()) {
    const imgFull = fm.image.startsWith('http') ? fm.image : `${BASE_URL}${fm.image}`
    ogImage   = imgFull  // autor forneceu PNG/JPG: usa nos dois contextos
    cardImage = imgFull
  } else {
    ogImage   = `${BASE_URL}/logo-shield.png`             // og:image: PNG seguro para redes sociais
    cardImage = `/blog/capas/${fm.slug}.svg`              // card: SVG gerado
  }

  const bodyHtml    = marked.parse(body)
  const articleSchema = buildArticleSchema(fm, ogImage)
  const faqSchema   = fm.faq && fm.faq.length ? buildFAQSchema(fm.faq) : null
  const schemas = [
    `  <script type="application/ld+json">\n${articleSchema}\n  </script>`,
    faqSchema ? `  <script type="application/ld+json">\n${faqSchema}\n  </script>` : '',
  ].filter(Boolean).join('\n')

  const leadHtml = fm.lead ? `\n  <p class="article-lead">${fm.lead}</p>\n` : ''
  const authorKey = fm.author.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const html = TEMPLATE
    .replace(/\{\{TITLE\}\}/g,           fm.title)
    .replace(/\{\{DESCRIPTION\}\}/g,     fm.description)
    .replace(/\{\{KEYWORDS\}\}/g,        fm.keywords || '')
    .replace(/\{\{CANONICAL\}\}/g,       fm.canonical)
    .replace(/\{\{OG_IMAGE\}\}/g,        ogImage)
    .replace(/\{\{CATEGORY\}\}/g,        fm.category)
    .replace(/\{\{DATE_DISPLAY\}\}/g,    isoToDisplayDate(fm.date))
    .replace(/\{\{READING_TIME\}\}/g,    String(fm.readingTime))
    .replace(/\{\{AUTHOR_KEY\}\}/g,      authorKey)
    .replace(/\{\{CTA_TITULO\}\}/g,      fm.cta_titulo || 'Precisa de Seguro Garantia?')
    .replace(/\{\{CTA_TEXTO\}\}/g,       fm.cta_texto  || 'Analise gratuita e emissao em ate 2 horas.')
    .replace(/\{\{BREADCRUMB_TITLE\}\}/g,fm.title.length > 50 ? fm.title.slice(0, 50) + '...' : fm.title)
    .replace(/\{\{SCHEMA_JSON_LD\}\}/g,  schemas)
    .replace(/\{\{BODY\}\}/g,            `<h1>${fm.title}</h1>${leadHtml}\n${bodyHtml}`)
    .replace(/\{\{WA_URL\}\}/g,          WA_URL)

  return { slug: fm.slug, html, fm, ogImage, cardImage }
}

// ── Selos de categoria ────────────────────────────────────────────────────────
function categoryBadge(cat) {
  const c = CATEGORY_COLORS[cat] || { bg: '#E0E7FF', text: '#1E1B4B' }
  return `<span class="badge" style="background:${c.bg};color:${c.text}">${cat}</span>`
}

// ── Card de artigo ────────────────────────────────────────────────────────────
function articleCard(a, hidden) {
  const display = hidden ? ' data-hidden="true"' : ''
  return `
<article class="card" data-cat="${a.fm.category}"${display}>
  <a href="/blog/${a.fm.slug}/" class="card-link">
    <div class="card-img-wrap">
      <img src="${a.cardImage}" alt="${a.fm.title}" loading="lazy" width="400" height="225"/>
    </div>
    <div class="card-body">
      ${categoryBadge(a.fm.category)}
      <h3 class="card-title">${a.fm.title}</h3>
      <p class="card-desc">${a.fm.description}</p>
      <p class="card-meta">${isoToDisplayDate(a.fm.date)} &middot; ${a.fm.readingTime} min</p>
    </div>
  </a>
</article>`
}

// ── Nova listagem do blog ─────────────────────────────────────────────────────
function buildBlogListing(articles) {
  articles.sort((a, b) => isoString(b.fm.date).localeCompare(isoString(a.fm.date)))

  // Featured: articles with featured:true (max 3), fallback to 3 most recent
  let featuredList = articles.filter(a => a.fm.featured === true).slice(0, 3)
  if (featuredList.length < 3) {
    const ids = new Set(featuredList.map(a => a.slug))
    const extra = articles.filter(a => !ids.has(a.slug)).slice(0, 3 - featuredList.length)
    featuredList = [...featuredList, ...extra]
  }

  const [f1, f2, f3] = featuredList

  // Featured main card (2/3 width)
  const featuredMain = f1 ? `
<article class="feat-main">
  <a href="/blog/${f1.fm.slug}/">
    <div class="feat-main-img">
      <img src="${f1.cardImage}" alt="${f1.fm.title}" width="760" height="427"/>
    </div>
    <div class="feat-main-body">
      ${categoryBadge(f1.fm.category)}
      <h2 class="feat-main-title">${f1.fm.title}</h2>
      <p class="feat-main-desc">${f1.fm.description}</p>
      <p class="feat-meta">${f1.fm.author} &middot; ${isoToDisplayDate(f1.fm.date)} &middot; ${f1.fm.readingTime} min</p>
    </div>
  </a>
</article>` : ''

  const featuredSide = [f2, f3].filter(Boolean).map(a => `
<article class="feat-side">
  <a href="/blog/${a.fm.slug}/">
    <div class="feat-side-img">
      <img src="${a.cardImage}" alt="${a.fm.title}" width="380" height="213"/>
    </div>
    <div class="feat-side-body">
      ${categoryBadge(a.fm.category)}
      <h3 class="feat-side-title">${a.fm.title}</h3>
      <p class="feat-meta">${isoToDisplayDate(a.fm.date)} &middot; ${a.fm.readingTime} min</p>
    </div>
  </a>
</article>`).join('')

  // Category filter buttons (only categories that have articles)
  const presentCats = [...new Set(articles.map(a => a.fm.category))]
  const catButtons = presentCats.map(c =>
    `<button class="cat-btn" data-cat="${c}">${c}</button>`
  ).join('\n        ')

  // Rich contents
  const richCards = RICH_CONTENTS.filter(r => r.ativo !== false).map(r => `
<div class="rich-card">
  <div class="rich-icon">${r.icon}</div>
  <h3 class="rich-title">${r.title}</h3>
  <p class="rich-desc">${r.desc}</p>
  <a href="${r.link}" class="rich-btn">Acessar</a>
</div>`).join('\n')

  // All article cards (first 9 visible, rest hidden)
  const cardItems = articles.map((a, i) => articleCard(a, i >= 9)).join('\n')

  const hasMore = articles.length > 9

  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <title>Blog | Seguro Garantia, Licitacoes e Lei 14.133 | F&amp;G</title>
  <meta name="description" content="Artigos e guias sobre Seguro Garantia para empresas em licitacoes, contratos publicos e processos judiciais. Conteudo atualizado por especialistas F&amp;G." />
  <link rel="canonical" href="https://fegsegurogarantia.com.br/blog/" />
  <meta property="og:title" content="Blog F&amp;G | Seguro Garantia" />
  <meta property="og:description" content="Artigos e guias sobre Seguro Garantia para licitacoes e contratos publicos." />
  <meta property="og:url" content="https://fegsegurogarantia.com.br/blog/" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="https://fegsegurogarantia.com.br/og-image.jpg" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#1C3A5E" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --navy: #1C3A5E; --orange: #E8572A; --bg: #FAFAF8;
      --text: #1F2937; --muted: #6B7280; --border: #E5E7EB;
      --radius: 10px; --shadow: 0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06);
    }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); line-height: 1.65; }
    a { text-decoration: none; color: inherit; }
    img { display: block; width: 100%; height: auto; }

    /* NAV */
    nav { background: #fff; border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100; }
    .nav-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { display: flex; align-items: center; gap: 10px; }
    .nav-logo-box { width: 38px; height: 38px; background: var(--navy); border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .nav-logo-box img { width: 30px; height: 30px; object-fit: contain; }
    .nav-brand-name { font-weight: 700; color: var(--navy); font-size: 14px; line-height: 1; }
    .nav-brand-sub { font-size: 10px; color: var(--muted); font-weight: 500; }
    .nav-cta { background: var(--orange); color: #fff; font-weight: 600; font-size: 13px; padding: 9px 18px; border-radius: 7px; transition: opacity .15s; }
    .nav-cta:hover { opacity: .88; }

    /* BLOG HEADER */
    .blog-header { background: var(--navy); padding: 64px 24px 56px; text-align: center; }
    .blog-header-title { font-family: 'Lora', serif; font-size: clamp(36px, 5vw, 58px); font-weight: 700; color: #fff; margin-bottom: 14px; }
    .blog-header-sub { color: rgba(255,255,255,.75); font-size: 17px; max-width: 540px; margin: 0 auto 32px; }
    .blog-search { max-width: 520px; margin: 0 auto; position: relative; }
    .blog-search input { width: 100%; padding: 14px 20px 14px 48px; border-radius: 10px; border: none; font-size: 15px; color: var(--text); outline: none; }
    .blog-search::before { content: ''; position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 18px; height: 18px; background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E") center/contain no-repeat; }

    /* CONTAINER */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* FEATURED */
    .section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--muted); margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
    .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
    .featured-section { padding: 56px 0 48px; background: #fff; }
    .feat-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
    .feat-main a, .feat-side a { display: block; height: 100%; }
    .feat-main { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow .2s; }
    .feat-main:hover { box-shadow: 0 8px 30px rgba(28,58,94,.15); }
    .feat-main:hover .feat-main-title { color: var(--orange); }
    .feat-main-img { aspect-ratio: 16/9; overflow: hidden; }
    .feat-main-img img { height: 100%; object-fit: cover; transition: transform .35s; }
    .feat-main:hover .feat-main-img img { transform: scale(1.03); }
    .feat-main-body { padding: 28px; }
    .feat-main-title { font-family: 'Lora', serif; font-size: clamp(20px, 2.5vw, 28px); font-weight: 700; color: var(--navy); margin: 10px 0 12px; line-height: 1.25; transition: color .2s; }
    .feat-main-desc { color: #4B5563; font-size: 15px; line-height: 1.6; margin-bottom: 14px; }
    .feat-meta { font-size: 12px; color: var(--muted); }
    .feat-side-list { display: flex; flex-direction: column; gap: 16px; }
    .feat-side { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); transition: box-shadow .2s; }
    .feat-side:hover { box-shadow: 0 6px 20px rgba(28,58,94,.12); }
    .feat-side:hover .feat-side-title { color: var(--orange); }
    .feat-side-img { aspect-ratio: 16/9; overflow: hidden; }
    .feat-side-img img { height: 100%; object-fit: cover; transition: transform .35s; }
    .feat-side:hover .feat-side-img img { transform: scale(1.03); }
    .feat-side-body { padding: 16px; }
    .feat-side-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 700; color: var(--navy); margin: 8px 0 6px; line-height: 1.3; transition: color .2s; }

    /* BADGE */
    .badge { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }

    /* RICH CONTENTS */
    .rich-section { background: var(--navy); padding: 56px 0; }
    .rich-section-title { font-family: 'Lora', serif; font-size: clamp(22px, 3vw, 32px); font-weight: 700; color: #fff; margin-bottom: 32px; }
    .rich-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .rich-card { background: #fff; border-radius: var(--radius); padding: 28px 24px; display: flex; flex-direction: column; gap: 12px; }
    .rich-icon { width: 48px; height: 48px; background: #FFF7ED; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .rich-title { font-family: 'Lora', serif; font-size: 16px; font-weight: 700; color: var(--navy); line-height: 1.35; }
    .rich-desc { font-size: 14px; color: var(--muted); line-height: 1.55; flex: 1; }
    .rich-btn { display: inline-block; background: var(--orange); color: #fff; font-size: 13px; font-weight: 600; padding: 9px 18px; border-radius: 7px; text-align: center; transition: opacity .15s; margin-top: 4px; }
    .rich-btn:hover { opacity: .88; }

    /* ALL ARTICLES */
    .all-section { padding: 56px 0; background: var(--bg); }
    .all-section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 28px; }
    .all-section-title { font-family: 'Lora', serif; font-size: clamp(22px, 3vw, 30px); font-weight: 700; color: var(--navy); }
    .cat-filter { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
    .cat-btn { background: #fff; border: 1px solid var(--border); border-radius: 999px; padding: 6px 16px; font-size: 13px; font-weight: 500; cursor: pointer; transition: all .15s; color: var(--text); }
    .cat-btn:hover, .cat-btn.active { background: var(--navy); color: #fff; border-color: var(--navy); }
    .articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
    .card { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: #fff; box-shadow: var(--shadow); transition: box-shadow .2s, transform .2s; }
    .card:hover { box-shadow: 0 8px 24px rgba(28,58,94,.13); transform: translateY(-2px); }
    .card:hover .card-title { color: var(--orange); }
    .card-link { display: block; height: 100%; }
    .card-img-wrap { aspect-ratio: 16/9; overflow: hidden; }
    .card-img-wrap img { height: 100%; object-fit: cover; transition: transform .35s; }
    .card:hover .card-img-wrap img { transform: scale(1.04); }
    .card-body { padding: 20px; display: flex; flex-direction: column; gap: 8px; }
    .card-title { font-family: 'Lora', serif; font-size: 17px; font-weight: 700; color: var(--navy); line-height: 1.3; transition: color .2s; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-desc { font-size: 13px; color: var(--muted); line-height: 1.55; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .card-meta { font-size: 12px; color: #9CA3AF; }
    .load-more-wrap { text-align: center; margin-top: 40px; }
    .load-more-btn { background: #fff; border: 1.5px solid var(--navy); color: var(--navy); font-size: 14px; font-weight: 600; padding: 12px 32px; border-radius: 8px; cursor: pointer; transition: all .15s; }
    .load-more-btn:hover { background: var(--navy); color: #fff; }

    /* NEWSLETTER */
    .newsletter-section { background: #F3F4F6; padding: 56px 0; }
    .newsletter-inner { max-width: 520px; margin: 0 auto; text-align: center; }
    .newsletter-title { font-family: 'Lora', serif; font-size: clamp(22px, 3vw, 28px); font-weight: 700; color: var(--navy); margin-bottom: 10px; }
    .newsletter-sub { font-size: 15px; color: var(--muted); margin-bottom: 24px; }
    .newsletter-form { display: flex; gap: 10px; }
    .newsletter-form input { flex: 1; padding: 13px 16px; border: 1px solid var(--border); border-radius: 8px; font-size: 15px; outline: none; }
    .newsletter-form input:focus { border-color: var(--navy); }
    .newsletter-form button { background: var(--orange); color: #fff; font-weight: 600; font-size: 14px; padding: 13px 22px; border: none; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: opacity .15s; }
    .newsletter-form button:hover { opacity: .88; }
    .newsletter-note { font-size: 12px; color: #9CA3AF; margin-top: 12px; }

    /* CTA FINAL */
    .cta-section { background: var(--navy); padding: 64px 24px; text-align: center; }
    .cta-title { font-family: 'Lora', serif; font-size: clamp(24px, 3.5vw, 36px); font-weight: 700; color: #fff; margin-bottom: 12px; }
    .cta-sub { color: rgba(255,255,255,.75); font-size: 16px; margin-bottom: 32px; }
    .cta-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--orange); color: #fff; font-weight: 700; font-size: 16px; padding: 14px 28px; border-radius: 10px; transition: opacity .15s; }
    .cta-btn:hover { opacity: .9; }

    /* FOOTER */
    footer { background: var(--navy); color: #94A3B8; padding: 40px 24px; }
    .footer-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 32px; }
    .footer-brand { font-weight: 700; color: #fff; font-size: 15px; margin-bottom: 6px; }
    .footer-info { font-size: 13px; line-height: 1.7; }
    .footer-col h4 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: #fff; margin-bottom: 12px; }
    .footer-col a { display: block; font-size: 13px; color: #94A3B8; margin-bottom: 6px; transition: color .15s; }
    .footer-col a:hover { color: #fff; }
    .footer-bottom { max-width: 1200px; margin: 28px auto 0; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.1); font-size: 12px; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px; }

    /* RESPONSIVE */
    @media (max-width: 1024px) {
      .rich-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .feat-grid { grid-template-columns: 1fr; }
      .articles-grid { grid-template-columns: repeat(2, 1fr); }
      .newsletter-form { flex-direction: column; }
      .footer-inner { grid-template-columns: 1fr; }
    }
    @media (max-width: 480px) {
      .articles-grid { grid-template-columns: 1fr; }
      .rich-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="F&G Seguro Garantia - pagina inicial">
      <div class="nav-logo-box">
        <img src="/logo-nav.webp" alt="" width="30" height="30" aria-hidden="true" />
      </div>
      <div>
        <div class="nav-brand-name">F&amp;G</div>
        <div class="nav-brand-sub">Seguro Garantia</div>
      </div>
    </a>
    <a href="${WA_URL}" class="nav-cta" target="_blank" rel="noopener">Analise gratuita</a>
  </div>
</nav>

<header class="blog-header">
  <h1 class="blog-header-title">Blog F&amp;G</h1>
  <p class="blog-header-sub">Tudo sobre Seguro Garantia para empresas que licitam e contratam com o poder publico</p>
  <div class="blog-search">
    <input type="text" id="blog-search-input" placeholder="Buscar artigos..." aria-label="Buscar artigos" autocomplete="off" />
  </div>
</header>

<section class="featured-section">
  <div class="container">
    <p class="section-label">Destaques</p>
    <div class="feat-grid">
      ${featuredMain}
      <div class="feat-side-list">
        ${featuredSide}
      </div>
    </div>
  </div>
</section>

<section class="rich-section">
  <div class="container">
    <h2 class="rich-section-title">Ferramentas e materiais gratuitos</h2>
    <div class="rich-grid">
      ${richCards}
    </div>
  </div>
</section>

<section class="all-section">
  <div class="container">
    <div class="all-section-header">
      <h2 class="all-section-title">Todos os artigos</h2>
    </div>
    <div class="cat-filter" id="cat-filter">
      <button class="cat-btn active" data-cat="all">Todos</button>
      ${catButtons}
    </div>
    <div class="articles-grid" id="articles-grid">
      ${cardItems}
    </div>
    ${hasMore ? `<div class="load-more-wrap"><button class="load-more-btn" id="load-more-btn">Carregar mais artigos</button></div>` : ''}
  </div>
</section>

<section class="newsletter-section">
  <div class="newsletter-inner">
    <h2 class="newsletter-title">Receba os novos artigos</h2>
    <p class="newsletter-sub">Novidades sobre Seguro Garantia, licitacoes e contratos direto no seu e-mail.</p>
    <form class="newsletter-form" action="" data-supabase-endpoint="/api/newsletter" novalidate>
      <input type="email" name="email" placeholder="Seu e-mail profissional" autocomplete="email" required />
      <button type="submit">Cadastrar</button>
    </form>
    <p class="newsletter-note">Sem spam. Cancele quando quiser.</p>
  </div>
</section>

<section class="cta-section">
  <h2 class="cta-title">Precisa de Seguro Garantia?</h2>
  <p class="cta-sub">Analise gratuita e emissao em ate 2 horas. Nossa equipe atende pelo WhatsApp.</p>
  <a href="${WA_URL}" class="cta-btn" target="_blank" rel="noopener">
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
    Falar pelo WhatsApp
  </a>
</section>

<footer>
  <div class="footer-inner">
    <div>
      <div class="nav-logo-box" style="margin-bottom:14px;width:42px;height:42px;">
        <img src="/logo-nav.webp" alt="" width="32" height="32" />
      </div>
      <p class="footer-brand">F&amp;G Seguro Garantia</p>
      <p class="footer-info">Corretora autorizada SUSEP<br>Boituva, SP - Brasil<br>CNPJ/SUSEP K7E4NJ</p>
    </div>
    <div class="footer-col">
      <h4>Modalidades</h4>
      <a href="/seguro-garantia-licitante/">Seguro Licitante</a>
      <a href="/seguro-garantia-execucao-contrato/">Execucao de Contrato</a>
      <a href="/seguro-garantia-judicial/">Seguro Judicial</a>
      <a href="/seguro-garantia-locaticia/">Garantia Locaticia</a>
      <a href="/seguro-garantia-adicional/">Garantia Adicional</a>
    </div>
    <div class="footer-col">
      <h4>Links</h4>
      <a href="/">Inicio</a>
      <a href="/blog/">Blog</a>
      <a href="/perguntas-frequentes/">Perguntas Frequentes</a>
      <a href="/seguro-cyber/">Seguro Cyber</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2026 F&amp;G Seguro Garantia. Todos os direitos reservados.</p>
    <p>SUSEP autorizada · Boituva, SP</p>
  </div>
</footer>

<script>
(function () {
  'use strict';

  var grid    = document.getElementById('articles-grid');
  var loadBtn = document.getElementById('load-more-btn');
  var catFilter = document.getElementById('cat-filter');
  var searchInput = document.getElementById('blog-search-input');
  var allCards = Array.from(grid ? grid.querySelectorAll('.card') : []);
  var PAGE_SIZE = 9;
  var visibleHidden = [];

  function getCards() {
    return allCards;
  }

  function applyFilters() {
    var activeCat = catFilter ? (catFilter.querySelector('.cat-btn.active') || {}).dataset.cat || 'all' : 'all';
    var q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var shown = 0;
    visibleHidden = [];
    allCards.forEach(function (card) {
      var matchCat = activeCat === 'all' || card.dataset.cat === activeCat;
      var title = card.querySelector('.card-title');
      var matchQ  = !q || (title && title.textContent.toLowerCase().includes(q));
      var visible = matchCat && matchQ;
      if (visible) {
        shown++;
        if (shown <= PAGE_SIZE) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
          visibleHidden.push(card);
        }
      } else {
        card.style.display = 'none';
      }
    });
    if (loadBtn) {
      loadBtn.parentElement.style.display = visibleHidden.length ? '' : 'none';
    }
  }

  // Restore initially hidden cards on page load
  allCards.forEach(function (card) {
    if (card.dataset.hidden) card.style.display = 'none';
  });

  if (catFilter) {
    catFilter.addEventListener('click', function (e) {
      if (!e.target.classList.contains('cat-btn')) return;
      catFilter.querySelectorAll('.cat-btn').forEach(function (b) { b.classList.remove('active'); });
      e.target.classList.add('active');
      applyFilters();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  if (loadBtn) {
    loadBtn.addEventListener('click', function () {
      var toShow = visibleHidden.splice(0, PAGE_SIZE);
      toShow.forEach(function (c) { c.style.display = ''; });
      if (visibleHidden.length === 0) loadBtn.parentElement.style.display = 'none';
    });
  }

  // Initial state: first PAGE_SIZE already visible, rest hidden
  applyFilters();
})();
</script>

</body>
</html>`
}

// ── Update sitemap ────────────────────────────────────────────────────────────
function updateSitemapWithArticles(slugs) {
  if (!existsSync(SITEMAP)) return
  let sitemap = readFileSync(SITEMAP, 'utf-8')
  let added = 0
  for (const slug of slugs) {
    const url = `${BASE_URL}/blog/${slug}/`
    if (!sitemap.includes(`<loc>${url}</loc>`)) {
      sitemap = sitemap.replace('</urlset>',
        `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`)
      added++
    }
  }
  writeFileSync(SITEMAP, sitemap)
  if (added) console.log(`✅ sitemap.xml +${added} artigo(s) do blog (MD)`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function buildBlogFromMarkdown() {
  if (!existsSync(CONTENT)) { console.log('ℹ️  content/blog/ nao encontrado, pulando'); return }

  const mdFiles = readdirSync(CONTENT).filter(f => f.endsWith('.md') && !f.startsWith('modelo'))
  if (!mdFiles.length) { console.log('ℹ️  Nenhum .md em content/blog/'); return }

  const articles = []
  for (const file of mdFiles) {
    const result = renderArticle(join(CONTENT, file))
    const outDir = join(DIST_BLOG, result.slug)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), result.html)
    console.log(`✅ /blog/${result.slug}/ (MD)`)
    articles.push(result)
  }

  const listingHtml = buildBlogListing(articles)
  mkdirSync(DIST_BLOG, { recursive: true })
  writeFileSync(join(DIST_BLOG, 'index.html'), listingHtml)
  console.log(`✅ /blog/ nova listagem visual com ${articles.length} artigos`)

  updateSitemapWithArticles(articles.map(a => a.slug))
}
