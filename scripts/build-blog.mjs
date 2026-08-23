/**
 * build-blog.mjs
 * Gera dist/blog/{slug}/index.html a partir de content/blog/{slug}.md
 *
 * Regras:
 * - H1 vem do frontmatter (title). O corpo do .md deve começar em ##.
 * - Build QUEBRA se qualquer .md tiver "# " no início de linha (H1 no corpo).
 * - Build QUEBRA se frontmatter obrigatório estiver ausente.
 * - HTML embutido no .md é preservado pelo marked (sem transformação).
 * - Article JSON-LD + FAQPage JSON-LD (se faq: no frontmatter) injetados.
 * - Entrada no sitemap.xml adicionada/verificada.
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

// ── Frontmatter obrigatório ───────────────────────────────────────────────────
const REQUIRED_FIELDS = ['slug', 'title', 'description', 'canonical', 'date', 'category', 'readingTime', 'author']

// ── Meses em português para exibição ─────────────────────────────────────────
const MONTHS_PT = ['janeiro','fevereiro','março','abril','maio','junho',
                   'julho','agosto','setembro','outubro','novembro','dezembro']

function isoToDisplayDate(iso) {
  // gray-matter parses dates as JS Date; normalise to string
  if (iso instanceof Date) iso = iso.toISOString().slice(0, 10)
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} de ${MONTHS_PT[m - 1]} de ${y}`
}

// ── Validação ─────────────────────────────────────────────────────────────────
function validateFrontmatter(fm, file) {
  const errors = []
  for (const f of REQUIRED_FIELDS) {
    if (!fm[f]) errors.push(`campo obrigatório ausente: "${f}"`)
  }
  if (errors.length) {
    throw new Error(`[blog-build] ERRO em ${file}:\n  ${errors.join('\n  ')}`)
  }
}

function validateNoH1InBody(body, file) {
  const lines = body.split('\n')
  const h1Lines = lines.filter((l, i) => /^#\s/.test(l))
  if (h1Lines.length) {
    throw new Error(
      `[blog-build] ERRO em ${file}: corpo contém H1 ("# "). ` +
      `O H1 vem do frontmatter. Use "## " para seções.\n` +
      `  Linhas: ${h1Lines.slice(0, 3).join(' | ')}`
    )
  }
}

// ── JSON-LD schemas ───────────────────────────────────────────────────────────
function buildArticleSchema(fm) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    author: { '@type': 'Person', name: fm.author, jobTitle: 'Especialista em Seguro Garantia' },
    publisher: { '@type': 'Organization', name: 'F&G Seguro Garantia',
      url: BASE_URL, logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-shield.png` } },
    datePublished: fm.date,
    dateModified: fm.updated || fm.date,
    url: fm.canonical,
    image: `${BASE_URL}/og-image.jpg`,
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

// ── Render one .md → HTML ─────────────────────────────────────────────────────
function renderArticle(mdPath) {
  const raw  = readFileSync(mdPath, 'utf-8')
  const file = mdPath.split('/').pop()

  let parsed
  try {
    parsed = matter(raw)
  } catch (e) {
    throw new Error(`[blog-build] ERRO ao parsear frontmatter de ${file}: ${e.message}`)
  }

  const fm   = parsed.data
  const body = parsed.content.trim()

  validateFrontmatter(fm, file)
  validateNoH1InBody(body, file)

  // Render markdown → HTML (marked preserves embedded HTML as-is)
  const bodyHtml = marked.parse(body)

  // Schemas
  const articleSchema = buildArticleSchema(fm)
  const faqSchema     = fm.faq && fm.faq.length ? buildFAQSchema(fm.faq) : null

  const schemas = [
    `  <script type="application/ld+json">\n${articleSchema}\n  </script>`,
    faqSchema ? `  <script type="application/ld+json">\n${faqSchema}\n  </script>` : '',
  ].filter(Boolean).join('\n')

  // Lead paragraph (styled)
  const leadHtml = fm.lead
    ? `\n  <p class="article-lead">${fm.lead}</p>\n`
    : ''

  // Fill template
  const authorKey = fm.author.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const html = TEMPLATE
    .replace(/\{\{TITLE\}\}/g, fm.title)
    .replace(/\{\{DESCRIPTION\}\}/g, fm.description)
    .replace(/\{\{KEYWORDS\}\}/g, fm.keywords || '')
    .replace(/\{\{CANONICAL\}\}/g, fm.canonical)
    .replace(/\{\{CATEGORY\}\}/g, fm.category)
    .replace(/\{\{DATE_DISPLAY\}\}/g, isoToDisplayDate(fm.date))
    .replace(/\{\{READING_TIME\}\}/g, String(fm.readingTime))
    .replace(/\{\{AUTHOR_KEY\}\}/g, authorKey)
    .replace(/\{\{BREADCRUMB_TITLE\}\}/g, fm.title.length > 50 ? fm.title.slice(0, 50) + '…' : fm.title)
    .replace(/\{\{SCHEMA_JSON_LD\}\}/g, schemas)
    .replace(/\{\{BODY\}\}/g, `<h1>${fm.title}</h1>${leadHtml}\n${bodyHtml}`)
    .replace(/\{\{WA_URL\}\}/g, WA_URL)

  return { slug: fm.slug, html, fm }
}

// ── Generate blog listing HTML ────────────────────────────────────────────────
function buildBlogListing(articles) {
  // Sort: newest first
  articles.sort((a, b) => {
    const da = a.fm.date instanceof Date ? a.fm.date.toISOString() : String(a.fm.date)
    const db = b.fm.date instanceof Date ? b.fm.date.toISOString() : String(b.fm.date)
    return db.localeCompare(da)
  })

  const featured = articles[0]
  const rest     = articles.slice(1)

  const listingTemplate = readFileSync(join(__dirname, 'blog-listing-template.html'), 'utf-8')

  const featuredHtml = `
    <section class="featured" aria-label="Artigo em destaque">
      <p class="featured-label">Artigo em destaque</p>
      <a href="/blog/${featured.fm.slug}/">
        <p class="art-cat">${featured.fm.category}</p>
        <h2 class="featured-title">${featured.fm.title}</h2>
        <p class="featured-summary">${featured.fm.description}</p>
        <p class="featured-meta">Por ${featured.fm.author} · ${isoToDisplayDate(featured.fm.date)} · ${featured.fm.readingTime} min de leitura</p>
        <span class="featured-link">Ler artigo →</span>
      </a>
    </section>`

  const restHtml = rest.map(a => `
    <div class="art-item">
      <a href="/blog/${a.fm.slug}/">
        <p class="art-cat">${a.fm.category}</p>
        <h2 class="art-title">${a.fm.title}</h2>
        <p class="art-summary">${a.fm.description}</p>
        <p class="art-meta">Por ${a.fm.author} · ${isoToDisplayDate(a.fm.date)} · ${a.fm.readingTime} min de leitura</p>
      </a>
    </div>`).join('\n')

  return listingTemplate
    .replace('{{FEATURED}}', featuredHtml)
    .replace('{{ARTICLES}}', restHtml)
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
  if (!existsSync(CONTENT)) { console.log('ℹ️  content/blog/ não encontrado, pulando'); return }

  const mdFiles = readdirSync(CONTENT).filter(f => f.endsWith('.md') && !f.startsWith('modelo'))
  if (!mdFiles.length) { console.log('ℹ️  Nenhum .md em content/blog/'); return }

  const articles = []
  for (const file of mdFiles) {
    const { slug, html, fm } = renderArticle(join(CONTENT, file))
    const outDir = join(DIST_BLOG, slug)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), html)
    console.log(`✅ /blog/${slug}/ (MD)`)
    articles.push({ slug, fm })
  }

  // Generate blog listing from .md metadata
  const listingHtml = buildBlogListing(articles)
  mkdirSync(DIST_BLOG, { recursive: true })
  writeFileSync(join(DIST_BLOG, 'index.html'), listingHtml)
  console.log(`✅ /blog/ listing gerado de ${articles.length} artigos (MD)`)

  updateSitemapWithArticles(articles.map(a => a.slug))
}
