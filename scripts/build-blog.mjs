/**
 * build-blog.mjs
 * Gera dist/blog/{slug}/index.html a partir de content/blog/{slug}.md
 * e dist/blog/index.html com a listagem visual.
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
const WA_URL    = 'https://wa.me/5515998618659?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20gratuita%20de%20Seguro%20Garantia.'
const BASE_URL  = 'https://fegsegurogarantia.com.br'

// ── Autores (edite aqui para ajustar bio) ────────────────────────────────────
const AUTHORS = {
  'fabio-lima': {
    name:     'Fabio Lima',
    initials: 'FL',
    bio:      'Especialista em Seguro Garantia com mais de 10 anos atendendo empresas em licitacoes e contratos publicos. Fundador da F&G Corretora.',
    wa:       WA_URL,
  },
}

// ── CTA da sidebar (edite aqui) ──────────────────────────────────────────────
const SIDEBAR_CTA = {
  titulo: 'Precisa de Seguro Garantia?',
  subtitulo: 'Resposta em ate 2 horas uteis.',
  wa: WA_URL,
}

// ── Categorias validas ────────────────────────────────────────────────────────
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

// ── Conteudos ricos (ativo: false = nao renderiza) ────────────────────────────
const RICH_CONTENTS = [
  {
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    title: 'Simulador de garantia da Lei 14.133',
    link: '/blog/garantia-de-proposta-lei-14133/',
    ativo: true,
  },
  {
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    title: 'Qual modalidade voce precisa?',
    link: '/blog/o-que-e-seguro-garantia/',
    ativo: true,
  },
  {
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    title: 'Checklist do licitante',
    link: '/materiais/checklist-licitante/',
    ativo: true,
  },
  {
    icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    title: 'Planilha de controle de licitacoes',
    link: '/materiais/planilha-licitacoes/',
    ativo: true,
  },
]

// ── Config Supabase (preencha antes do build) ─────────────────────────────────
// URL do projeto: Supabase Dashboard > Project Settings > API > Project URL
// Anon key:       Supabase Dashboard > Project Settings > API > anon public
const SUPABASE = {
  url:     'https://hfjvwibucplyhsvnwfor.supabase.co', // ex: https://xyzxyz.supabase.co
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhmanZ3aWJ1Y3BseWhzdm53Zm9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzODA4NTIsImV4cCI6MjA4Nzk1Njg1Mn0.jCBS1YnDcKuVzJSVhGiJM0kyafPMZxFi52kszTJCxZQ', // anon key publica -- pode ficar no HTML
}

// ── Materiais para download com captura de lead ───────────────────────────────
// Edite aqui para adicionar ou ajustar materiais.
const MATERIAIS = [
  {
    slug:      'checklist-licitante',
    titulo:    'Checklist do Licitante: Lei 14.133',
    subtitulo: 'Tudo que sua empresa precisa conferir antes de entrar numa licitacao.',
    descricao: 'Lista completa em 8 blocos, do edital ao contrato assinado. PDF de 3 paginas para imprimir e marcar.',
    bullets: [
      'Decisao de participar e leitura do edital',
      'Habilitacao juridica, fiscal e qualificacao tecnica',
      'Proposta, garantia de proposta e recursos',
      'Assinatura do contrato e garantia contratual',
    ],
    arquivo:   '/materiais/checklist-do-licitante-FG.pdf',
    tipo:      'pdf',
    badge:     'PDF - 3 paginas',
    ogDesc:    'Checklist gratuito com tudo que conferir antes, durante e depois de uma licitacao pela Lei 14.133. Baixe agora.',
    sitemap:   true,
  },
  {
    slug:      'planilha-licitacoes',
    titulo:    'Planilha de Controle de Licitacoes',
    subtitulo: 'Gerencie editais, prazos e garantias num unico arquivo Excel.',
    descricao: 'Controle de editais com status, alertas de prazo, calculo automatico de garantias e aba de resumo com taxa de vitoria.',
    bullets: [
      'Controle de editais com status e datas de abertura',
      'Alerta automatico de prazo de entrega da proposta',
      'Calculo automatico de garantia de proposta e contratual',
      'Aba de resumo com taxa de vitoria e total de garantias',
    ],
    arquivo:   '/materiais/planilha-controle-licitacoes-FG.xlsx',
    tipo:      'xlsx',
    badge:     'Excel com instrucoes',
    ogDesc:    'Planilha gratuita para controlar licitacoes, prazos e calcular o valor das garantias exigidas. Baixe agora.',
    sitemap:   true,
  },
]

// ── Validacoes ────────────────────────────────────────────────────────────────
const REQUIRED_FIELDS = ['slug', 'title', 'description', 'canonical', 'date', 'category', 'readingTime', 'author']

const MONTHS_PT = ['janeiro','fevereiro','marco','abril','maio','junho',
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

function validateFrontmatter(fm, file) {
  const errors = []
  for (const f of REQUIRED_FIELDS) {
    if (!fm[f]) errors.push(`campo obrigatorio ausente: "${f}"`)
  }
  if (!VALID_CATEGORIES.includes(fm.category || '')) {
    errors.push(`category invalida: "${fm.category}". Validas: ${VALID_CATEGORIES.join(', ')}`)
  }
  if (errors.length) throw new Error(`[blog-build] ERRO em ${file}:\n  ${errors.join('\n  ')}`)
}

function validateNoH1InBody(body, file) {
  const h1Lines = body.split('\n').filter(l => /^# /.test(l))
  if (h1Lines.length) console.warn('[blog] AVISO ' + file + ': corpo tem "# " (H1). Use ## para secoes.')
}

// ── Capa SVG automatica ───────────────────────────────────────────────────────
function generateCoverSVG(slug, title, category) {
  const color = CATEGORY_COLORS[category] || { bg: '#DBEAFE', text: '#1E3A8A' }
  const words = title.replace(/"/g, '&quot;').split(' ')
  const lines = []
  let line = ''
  for (const w of words) {
    if ((line + ' ' + w).trim().length > 36 && line) {
      lines.push(line.trim()); line = w
    } else { line = (line + ' ' + w).trim() }
    if (lines.length === 2) { line = words.slice(words.indexOf(w) + 1).join(' ') || ''; break }
  }
  if (line) lines.push(line.trim())
  const titleY = lines.length === 1 ? 310 : lines.length === 2 ? 290 : 270
  const titleSVG = lines.map((l, i) =>
    `<text x="72" y="${titleY + i * 64}" font-family="Georgia,serif" font-size="52" font-weight="700" fill="white">${l}</text>`
  ).join('\n  ')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1C3A5E"/><stop offset="100%" stop-color="#0F2035"/></linearGradient></defs><rect width="1200" height="630" fill="url(#g)"/><rect x="0" y="0" width="12" height="630" fill="#E8572A"/><rect x="0" y="530" width="1200" height="100" fill="rgba(0,0,0,0.25)"/><rect x="56" y="60" width="220" height="38" rx="6" fill="${color.bg}"/><text x="72" y="87" font-family="Arial,sans-serif" font-size="20" font-weight="700" fill="${color.text}" letter-spacing="2">${category.toUpperCase()}</text>${titleSVG}<text x="72" y="578" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.7)">fegsegurogarantia.com.br</text></svg>`
}

// ── JSON-LD schemas ───────────────────────────────────────────────────────────
function buildArticleSchema(fm, ogImage) {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: fm.title, description: fm.description,
    author: { '@type': 'Person', name: fm.author, jobTitle: 'Especialista em Seguro Garantia' },
    publisher: { '@type': 'Organization', name: 'F&G Seguro Garantia', url: BASE_URL,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo-shield.png` } },
    datePublished: isoString(fm.date), dateModified: fm.updated ? isoString(fm.updated) : isoString(fm.date),
    url: fm.canonical, image: ogImage, mainEntityOfPage: fm.canonical,
  }, null, 2)
}

function buildFAQSchema(faqItems) {
  return JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: faqItems.map(({ q, a }) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }, null, 2)
}

// ── Sumario (TOC) a partir dos H2 do HTML ────────────────────────────────────
function buildTOC(bodyHtml) {
  const h2matches = [...bodyHtml.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
  if (h2matches.length < 2) return { toc: '', bodyWithIds: bodyHtml }
  let i = 0
  const bodyWithIds = bodyHtml.replace(/<h2([^>]*)>/g, (_, attrs) =>
    `<h2${attrs} id="toc-${i++}">`
  )
  const items = h2matches.map((m, idx) => {
    const text = m[1].replace(/<[^>]+>/g, '').trim()
    return `<li><a href="#toc-${idx}" class="toc-link">${text}</a></li>`
  }).join('\n    ')
  const tocInner = `<ul class="toc-list">\n    ${items}\n  </ul>`
  const toc = `<div class="sidebar-card">\n  <h3 class="sidebar-card-title">Neste artigo</h3>\n  ${tocInner}\n</div>`
  return { toc, bodyWithIds }
}

// ── Artigos relacionados ──────────────────────────────────────────────────────
function getRelatedArticles(currentFm, allArticles) {
  const others = allArticles.filter(a => a.fm.slug !== currentFm.slug)
  const samecat = others.filter(a => a.fm.category === currentFm.category)
  const diff    = others.filter(a => a.fm.category !== currentFm.category)
  return [...samecat, ...diff]
    .sort((a, b) => isoString(b.fm.date).localeCompare(isoString(a.fm.date)))
    .slice(0, 3)
}

// ── Ferramentas compactas da sidebar ─────────────────────────────────────────
function buildSidebarTools(currentSlug) {
  const items = RICH_CONTENTS.filter(r => r.ativo && r.link !== `/blog/${currentSlug}/`)
  if (!items.length) return ''
  const cards = items.map(r => `
<a href="${r.link}" class="tool-item">
  <span class="tool-icon">${r.icon}</span>
  <span class="tool-title">${r.title}</span>
</a>`).join('')
  return `<div class="sidebar-card tools-card">
  <h3 class="sidebar-card-title">Ferramentas gratuitas</h3>
  <div class="tool-list">${cards}
  </div>
</div>`
}

// ── Newsletter e rodape compartilhados ────────────────────────────────────────
function buildNewsletterFooter() {
  const SB_URL = SUPABASE.url
  const SB_KEY = SUPABASE.anonKey

  return `<section class="newsletter-section">
  <div class="newsletter-inner">
    <h2 class="newsletter-title">Receba os novos artigos</h2>
    <p class="newsletter-sub">Novidades sobre Seguro Garantia, licitacoes e contratos direto no seu e-mail.</p>
    <form id="nl-form" class="newsletter-form" novalidate>
      <div class="nl-row">
        <input type="text" name="nl_nome" id="nl-nome" placeholder="Seu nome (opcional)" autocomplete="name" class="nl-input"/>
        <input type="email" name="nl_email" id="nl-email" placeholder="Seu e-mail profissional" autocomplete="email" required class="nl-input"/>
      </div>
      <label class="nl-lgpd">
        <input type="checkbox" name="nl_lgpd" id="nl-lgpd" required/>
        Aceito receber conteudos da F&amp;G por e-mail
      </label>
      <button type="submit" class="nl-btn" id="nl-btn">Cadastrar</button>
    </form>
    <p class="nl-msg" id="nl-msg" aria-live="polite" role="status"></p>
    <p class="newsletter-note">Sem spam. Cancele quando quiser.</p>
  </div>
</section>

<footer class="site-footer">
  <div class="footer-inner">
    <div>
      <p class="footer-brand">F&amp;G Seguro Garantia</p>
      <p class="footer-info">Corretora autorizada SUSEP<br>Boituva, SP - Brasil<br>CNPJ 56.123.874/0001-90<br>SUSEP 242160653</p>
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
    <p>&copy; 2026 F&amp;G Seguro Garantia. Todos os direitos reservados.</p>
    <p>SUSEP autorizada &middot; Boituva, SP</p>
  </div>
</footer>

<script>
(function(){
  'use strict';
  var SB_URL = '${SB_URL}';
  var SB_KEY = '${SB_KEY}';
  var form   = document.getElementById('nl-form');
  if (!form || !SB_URL || SB_URL === 'COLOQUE_AQUI') return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var email = (document.getElementById('nl-email')||{}).value||'';
    var nome  = (document.getElementById('nl-nome') ||{}).value||'';
    var lgpd  = (document.getElementById('nl-lgpd') ||{}).checked;
    email = email.trim();
    if(!email || !lgpd) return;
    var btn = document.getElementById('nl-btn');
    var msg = document.getElementById('nl-msg');
    btn.textContent = 'Enviando...';
    btn.disabled = true;
    fetch(SB_URL + '/rest/v1/newsletter_inscritos', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify({
        email:  email,
        nome:   nome || null,
        origem: window.location.pathname
      })
    }).then(function(r){
      if (r.ok || r.status === 409) {
        form.style.display = 'none';
        msg.textContent    = 'Pronto, voce recebera os proximos artigos.';
        msg.style.color    = '#166534';
      } else {
        msg.textContent = 'Erro ao cadastrar. Tente novamente.';
        msg.style.color = '#991B1B';
        btn.textContent = 'Cadastrar';
        btn.disabled    = false;
      }
    }).catch(function(){
      msg.textContent = 'Erro de conexao. Tente novamente.';
      msg.style.color = '#991B1B';
      btn.textContent = 'Cadastrar';
      btn.disabled    = false;
    });
  });
})();
</script>`
}

// ── Secao de artigos relacionados ─────────────────────────────────────────────
function buildRelatedSection(related) {
  if (!related.length) return ''
  const cards = related.map(a => {
    const color = CATEGORY_COLORS[a.fm.category] || { bg: '#E0E7FF', text: '#1E1B4B' }
    return `
<article class="related-card">
  <a href="/blog/${a.fm.slug}/" class="related-link">
    <div class="related-img">
      <img src="${a.cardImage}" alt="${a.fm.title}" loading="lazy" width="380" height="214"/>
    </div>
    <div class="related-body">
      <span class="badge" style="background:${color.bg};color:${color.text}">${a.fm.category}</span>
      <h3 class="related-title">${a.fm.title}</h3>
      <p class="related-meta">${isoToDisplayDate(a.fm.date)} &middot; ${a.fm.readingTime} min</p>
    </div>
  </a>
</article>`
  }).join('')
  return `<section class="related-section">
  <div class="container">
    <h2 class="related-heading">Continue lendo</h2>
    <div class="related-grid">${cards}
    </div>
  </div>
</section>`
}

// ── Compute image paths for an article fm ────────────────────────────────────
function computeImages(fm) {
  let ogImage, cardImage
  if (fm.image && String(fm.image).trim()) {
    const imgFull = String(fm.image).startsWith('http') ? fm.image : `${BASE_URL}${fm.image}`
    ogImage = cardImage = imgFull
  } else {
    ogImage   = `${BASE_URL}/logo-shield.png`
    cardImage = `/blog/capas/${fm.slug}.svg`
  }
  return { ogImage, cardImage }
}

// ── Render article HTML ───────────────────────────────────────────────────────
function renderArticle(parsed, allArticles, template) {
  const { fm, body, file } = parsed

  validateFrontmatter(fm, file)
  validateNoH1InBody(body, file)

  const { ogImage, cardImage } = computeImages(fm)

  // Generate SVG cover always (used for cards even when og uses PNG)
  const capaDir = join(DIST_BLOG, 'capas')
  mkdirSync(capaDir, { recursive: true })
  writeFileSync(join(capaDir, `${fm.slug}.svg`), generateCoverSVG(fm.slug, fm.title, fm.category))

  // Render markdown
  const rawBodyHtml = marked.parse(body)
  const { toc, bodyWithIds } = buildTOC(rawBodyHtml)

  // Related articles
  const related = getRelatedArticles(fm, allArticles)
  const relatedSection = buildRelatedSection(related)

  // Sidebar tools
  const sidebarTools = buildSidebarTools(fm.slug)

  // Author
  const authorKey = fm.author.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const author = AUTHORS[authorKey] || AUTHORS['fabio-lima']

  // Category colors
  const catColor = CATEGORY_COLORS[fm.category] || { bg: '#E0E7FF', text: '#1E1B4B' }

  // Schemas
  const articleSchema = buildArticleSchema(fm, ogImage)
  const faqSchema = fm.faq && fm.faq.length ? buildFAQSchema(fm.faq) : null
  const schemas = [
    `  <script type="application/ld+json">\n${articleSchema}\n  </script>`,
    faqSchema ? `  <script type="application/ld+json">\n${faqSchema}\n  </script>` : '',
  ].filter(Boolean).join('\n')

  const leadHtml = fm.lead ? fm.lead : ''
  const coverSrc = fm.image && String(fm.image).trim()
    ? (String(fm.image).startsWith('http') ? fm.image : fm.image)
    : `/blog/capas/${fm.slug}.svg`

  const authorBox = `<div class="author-box">
  <div class="author-avatar">${author.initials}</div>
  <div class="author-info">
    <p class="author-name">${author.name}</p>
    <p class="author-bio">${author.bio}</p>
    <a href="${author.wa}" class="author-wa" target="_blank" rel="noopener">Falar pelo WhatsApp</a>
  </div>
</div>`

  const articleUrl = `${BASE_URL}/blog/${fm.slug}/`

  const html = template
    .replace(/\{\{TITLE\}\}/g,           fm.title)
    .replace(/\{\{DESCRIPTION\}\}/g,     fm.description)
    .replace(/\{\{KEYWORDS\}\}/g,        fm.keywords || '')
    .replace(/\{\{CANONICAL\}\}/g,       fm.canonical)
    .replace(/\{\{OG_IMAGE\}\}/g,        ogImage)
    .replace(/\{\{AUTHOR_KEY\}\}/g,      authorKey)
    .replace(/\{\{SCHEMA_JSON_LD\}\}/g,  schemas)
    .replace(/\{\{BREADCRUMB_TITLE\}\}/g,fm.title.length > 48 ? fm.title.slice(0, 48) + '...' : fm.title)
    .replace(/\{\{CATEGORY\}\}/g,        fm.category)
    .replace(/\{\{CATEGORY_BG\}\}/g,     catColor.bg)
    .replace(/\{\{CATEGORY_TEXT\}\}/g,   catColor.text)
    .replace(/\{\{H1\}\}/g,              fm.title)
    .replace(/\{\{LEAD\}\}/g,            leadHtml)
    .replace(/\{\{DATE_DISPLAY\}\}/g,    isoToDisplayDate(fm.date))
    .replace(/\{\{READING_TIME\}\}/g,    String(fm.readingTime))
    .replace(/\{\{AUTHOR\}\}/g,          author.name)
    .replace(/\{\{AUTHOR_INITIALS\}\}/g, author.initials)
    .replace(/\{\{COVER_SRC\}\}/g,       coverSrc)
    .replace(/\{\{TOC\}\}/g,             toc)
    .replace(/\{\{BODY\}\}/g,            bodyWithIds)
    .replace(/\{\{CTA_TITULO\}\}/g,      fm.cta_titulo || 'Precisa de Seguro Garantia?')
    .replace(/\{\{CTA_TEXTO\}\}/g,       fm.cta_texto  || 'Analise gratuita e emissao em ate 2 horas.')
    .replace(/\{\{WA_URL\}\}/g,          WA_URL)
    .replace(/\{\{SIDEBAR_CTA_TITULO\}\}/g, SIDEBAR_CTA.titulo)
    .replace(/\{\{SIDEBAR_CTA_SUB\}\}/g,    SIDEBAR_CTA.subtitulo)
    .replace(/\{\{SIDEBAR_TOOLS\}\}/g,      sidebarTools)
    .replace(/\{\{AUTHOR_BOX\}\}/g,         authorBox)
    .replace(/\{\{RELATED_ARTICLES\}\}/g,   relatedSection)
    .replace(/\{\{NEWSLETTER_FOOTER\}\}/g,  buildNewsletterFooter())
    .replace(/\{\{ARTICLE_URL\}\}/g,        articleUrl)

  return { slug: fm.slug, html, fm, ogImage, cardImage }
}

// ── Card de artigo para a listagem ────────────────────────────────────────────
function categoryBadge(cat) {
  const c = CATEGORY_COLORS[cat] || { bg: '#E0E7FF', text: '#1E1B4B' }
  return `<span class="badge" style="background:${c.bg};color:${c.text}">${cat}</span>`
}

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

  let featuredList = articles.filter(a => a.fm.featured === true).slice(0, 3)
  if (featuredList.length < 3) {
    const ids = new Set(featuredList.map(a => a.slug))
    const extra = articles.filter(a => !ids.has(a.slug)).slice(0, 3 - featuredList.length)
    featuredList = [...featuredList, ...extra]
  }
  const [f1, f2, f3] = featuredList

  const featuredMain = f1 ? `
<article class="feat-main">
  <a href="/blog/${f1.fm.slug}/">
    <div class="feat-main-img"><img src="${f1.cardImage}" alt="${f1.fm.title}" width="760" height="427"/></div>
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
    <div class="feat-side-img"><img src="${a.cardImage}" alt="${a.fm.title}" width="380" height="213"/></div>
    <div class="feat-side-body">
      ${categoryBadge(a.fm.category)}
      <h3 class="feat-side-title">${a.fm.title}</h3>
      <p class="feat-meta">${isoToDisplayDate(a.fm.date)} &middot; ${a.fm.readingTime} min</p>
    </div>
  </a>
</article>`).join('')

  const presentCats = [...new Set(articles.map(a => a.fm.category))]
  const catButtons  = presentCats.map(c => `<button class="cat-btn" data-cat="${c}">${c}</button>`).join('\n        ')
  const richCards   = RICH_CONTENTS.filter(r => r.ativo !== false).map(r => `
<div class="rich-card">
  <div class="rich-icon">${r.icon}</div>
  <h3 class="rich-title">${r.title}</h3>
  <a href="${r.link}" class="rich-btn">Acessar</a>
</div>`).join('\n')

  const cardItems = articles.map((a, i) => articleCard(a, i >= 9)).join('\n')
  const hasMore   = articles.length > 9

  const newsletterFooter = buildNewsletterFooter()

  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <title>Blog | Seguro Garantia, Licitacoes e Lei 14.133 | F&amp;G</title>
  <meta name="description" content="Artigos e guias sobre Seguro Garantia para empresas em licitacoes, contratos publicos e processos judiciais." />
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
  <link rel="preload" href="/fonts/source-serif-4-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
  <style>
    @font-face{font-family:'Source Serif 4';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/source-serif-4-latin-700-normal.woff2') format('woff2');}
    @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/ibm-plex-sans-latin-400-normal.woff2') format('woff2');}
    @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:500;font-display:swap;src:url('/fonts/ibm-plex-sans-latin-500-normal.woff2') format('woff2');}
    @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/ibm-plex-sans-latin-600-normal.woff2') format('woff2');}
    @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/ibm-plex-sans-latin-700-normal.woff2') format('woff2');}
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --navy:#1C3A5E; --orange:#E8572A; --bg:#FAFAF8; --text:#1F2937; --muted:#6B7280; --border:#E5E7EB; --radius:10px; --shadow:0 1px 3px rgba(0,0,0,.08),0 4px 12px rgba(0,0,0,.06); }
    body { font-family:'IBM Plex Sans',system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text); line-height:1.65; }
    a { text-decoration:none; color:inherit; }
    img { display:block; width:100%; height:auto; }
    nav { background:#fff; border-bottom:1px solid var(--border); position:sticky; top:0; z-index:100; }
    .nav-inner { max-width:1200px; margin:0 auto; padding:0 24px; height:64px; display:flex; align-items:center; justify-content:space-between; }
    .nav-brand { display:flex; align-items:center; gap:10px; }
    .nav-logo-box { width:38px; height:38px; background:var(--navy); border-radius:7px; display:flex; align-items:center; justify-content:center; }
    .nav-logo-box img { width:30px; height:30px; object-fit:contain; }
    .nav-brand-name { font-weight:700; color:var(--navy); font-size:14px; line-height:1; }
    .nav-brand-sub { font-size:10px; color:var(--muted); font-weight:500; }
    .nav-cta { background:var(--orange); color:#fff; font-weight:600; font-size:13px; padding:9px 18px; border-radius:7px; }
    .nav-cta:hover { opacity:.88; }
    .blog-header { background:var(--navy); padding:64px 24px 56px; text-align:center; }
    .blog-header-title { font-family:'Source Serif 4',Georgia,serif; font-size:clamp(36px,5vw,58px); font-weight:700; color:#fff; margin-bottom:14px; }
    .blog-header-sub { color:rgba(255,255,255,.75); font-size:17px; max-width:540px; margin:0 auto 32px; }
    .blog-search { max-width:520px; margin:0 auto; position:relative; }
    .blog-search input { width:100%; padding:14px 20px 14px 48px; border-radius:10px; border:none; font-size:15px; color:var(--text); outline:none; }
    .blog-search::before { content:''; position:absolute; left:16px; top:50%; transform:translateY(-50%); width:18px; height:18px; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cline x1='21' y1='21' x2='16.65' y2='16.65'/%3E%3C/svg%3E") center/contain no-repeat; }
    .container { max-width:1200px; margin:0 auto; padding:0 24px; }
    .section-label { font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:.1em; color:var(--muted); margin-bottom:20px; display:flex; align-items:center; gap:10px; }
    .section-label::after { content:''; flex:1; height:1px; background:var(--border); }
    .featured-section { padding:56px 0 48px; background:#fff; }
    .feat-grid { display:grid; grid-template-columns:2fr 1fr; gap:24px; }
    .feat-main a,.feat-side a { display:block; height:100%; }
    .feat-main { border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow); transition:box-shadow .2s; }
    .feat-main:hover { box-shadow:0 8px 30px rgba(28,58,94,.15); }
    .feat-main:hover .feat-main-title { color:var(--orange); }
    .feat-main-img,.feat-side-img { aspect-ratio:16/9; overflow:hidden; }
    .feat-main-img img,.feat-side-img img { height:100%; object-fit:cover; transition:transform .35s; }
    .feat-main:hover .feat-main-img img,.feat-side:hover .feat-side-img img { transform:scale(1.03); }
    .feat-main-body { padding:28px; }
    .feat-main-title { font-family:'Source Serif 4',Georgia,serif; font-size:clamp(20px,2.5vw,28px); font-weight:700; color:var(--navy); margin:10px 0 12px; line-height:1.25; transition:color .2s; }
    .feat-main-desc { color:#4B5563; font-size:15px; line-height:1.6; margin-bottom:14px; }
    .feat-meta { font-size:12px; color:var(--muted); }
    .feat-side-list { display:flex; flex-direction:column; gap:16px; }
    .feat-side { border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow); transition:box-shadow .2s; }
    .feat-side:hover { box-shadow:0 6px 20px rgba(28,58,94,.12); }
    .feat-side:hover .feat-side-title { color:var(--orange); }
    .feat-side-body { padding:16px; }
    .feat-side-title { font-family:'Source Serif 4',Georgia,serif; font-size:16px; font-weight:700; color:var(--navy); margin:8px 0 6px; line-height:1.3; transition:color .2s; }
    .badge { display:inline-block; font-size:11px; font-weight:600; padding:3px 10px; border-radius:999px; }
    .rich-section { background:var(--navy); padding:56px 0; }
    .rich-section-title { font-family:'Source Serif 4',Georgia,serif; font-size:clamp(22px,3vw,32px); font-weight:700; color:#fff; margin-bottom:32px; }
    .rich-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .rich-card { background:#fff; border-radius:var(--radius); padding:28px 24px; display:flex; flex-direction:column; gap:12px; }
    .rich-icon { width:48px; height:48px; background:#FFF7ED; border-radius:10px; display:flex; align-items:center; justify-content:center; color:var(--orange); }
    .rich-title { font-family:'Source Serif 4',Georgia,serif; font-size:16px; font-weight:700; color:var(--navy); line-height:1.35; flex:1; }
    .rich-btn { display:inline-block; background:var(--orange); color:#fff; font-size:13px; font-weight:600; padding:9px 18px; border-radius:7px; text-align:center; }
    .rich-btn:hover { opacity:.88; }
    .all-section { padding:56px 0; background:var(--bg); }
    .all-section-title { font-family:'Source Serif 4',Georgia,serif; font-size:clamp(22px,3vw,30px); font-weight:700; color:var(--navy); margin-bottom:28px; }
    .cat-filter { display:flex; flex-wrap:wrap; gap:8px; margin-bottom:32px; }
    .cat-btn { background:#fff; border:1px solid var(--border); border-radius:999px; padding:6px 16px; font-size:13px; font-weight:500; cursor:pointer; transition:all .15s; color:var(--text); }
    .cat-btn:hover,.cat-btn.active { background:var(--navy); color:#fff; border-color:var(--navy); }
    .articles-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; }
    .card { border:1px solid var(--border); border-radius:var(--radius); overflow:hidden; background:#fff; box-shadow:var(--shadow); transition:box-shadow .2s,transform .2s; }
    .card:hover { box-shadow:0 8px 24px rgba(28,58,94,.13); transform:translateY(-2px); }
    .card:hover .card-title { color:var(--orange); }
    .card-link { display:block; height:100%; }
    .card-img-wrap { aspect-ratio:16/9; overflow:hidden; }
    .card-img-wrap img { height:100%; object-fit:cover; transition:transform .35s; }
    .card:hover .card-img-wrap img { transform:scale(1.04); }
    .card-body { padding:20px; display:flex; flex-direction:column; gap:8px; }
    .card-title { font-family:'Source Serif 4',Georgia,serif; font-size:17px; font-weight:700; color:var(--navy); line-height:1.3; transition:color .2s; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .card-desc { font-size:13px; color:var(--muted); line-height:1.55; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
    .card-meta { font-size:12px; color:#9CA3AF; }
    .load-more-wrap { text-align:center; margin-top:40px; }
    .load-more-btn { background:#fff; border:1.5px solid var(--navy); color:var(--navy); font-size:14px; font-weight:600; padding:12px 32px; border-radius:8px; cursor:pointer; transition:all .15s; }
    .load-more-btn:hover { background:var(--navy); color:#fff; }
    .newsletter-section { background:#F3F4F6; padding:56px 0; }
    .newsletter-inner { max-width:520px; margin:0 auto; text-align:center; }
    .newsletter-title { font-family:'Source Serif 4',Georgia,serif; font-size:clamp(22px,3vw,28px); font-weight:700; color:var(--navy); margin-bottom:10px; }
    .newsletter-sub { font-size:15px; color:var(--muted); margin-bottom:24px; }
    .newsletter-form { display:flex; gap:10px; }
    .newsletter-form input { flex:1; padding:13px 16px; border:1px solid var(--border); border-radius:8px; font-size:15px; outline:none; }
    .newsletter-form input:focus { border-color:var(--navy); }
    .newsletter-form button { background:var(--orange); color:#fff; font-weight:600; font-size:14px; padding:13px 22px; border:none; border-radius:8px; cursor:pointer; white-space:nowrap; }
    .newsletter-form button:hover { opacity:.88; }
    .newsletter-note { font-size:12px; color:#9CA3AF; margin-top:12px; }
    .nl-row{display:flex;gap:10px;flex-wrap:wrap;}
    .nl-input{flex:1;min-width:200px;padding:12px 16px;border:1px solid var(--border);border-radius:8px;font-size:15px;font-family:'IBM Plex Sans',system-ui,sans-serif;outline:none;}
    .nl-input:focus{border-color:var(--navy);}
    .nl-lgpd{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--muted);margin-top:4px;text-align:left;}
    .nl-lgpd input{margin-top:3px;flex-shrink:0;}
    .nl-btn{background:var(--orange);color:#fff;font-weight:600;font-size:15px;padding:13px 28px;border:none;border-radius:8px;cursor:pointer;font-family:'IBM Plex Sans',system-ui,sans-serif;width:100%;margin-top:4px;}
    .nl-btn:hover{opacity:.88;}
    .nl-msg{min-height:20px;font-size:14px;margin-top:8px;}
    .site-footer { background:var(--navy); color:#94A3B8; padding:40px 24px; }
    .footer-inner { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:1fr 1fr 1fr; gap:32px; }
    .footer-brand { font-weight:700; color:#fff; font-size:15px; margin-bottom:6px; }
    .footer-info { font-size:13px; line-height:1.7; }
    .footer-col h4 { font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#fff; margin-bottom:12px; }
    .footer-col a { display:block; font-size:13px; color:#94A3B8; margin-bottom:6px; }
    .footer-col a:hover { color:#fff; }
    .footer-bottom { max-width:1200px; margin:28px auto 0; padding-top:20px; border-top:1px solid rgba(255,255,255,.1); font-size:12px; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }
    @media(max-width:1024px){.rich-grid{grid-template-columns:repeat(2,1fr);}}
    @media(max-width:768px){.feat-grid{grid-template-columns:1fr;}.articles-grid{grid-template-columns:repeat(2,1fr);}.newsletter-form{flex-direction:column;}.footer-inner{grid-template-columns:1fr;}}
    @media(max-width:480px){.articles-grid{grid-template-columns:1fr;}.rich-grid{grid-template-columns:1fr;}}
  </style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-brand">
      <div class="nav-logo-box"><img src="/logo-nav.webp" alt="" width="30" height="30"/></div>
      <div><div class="nav-brand-name">F&amp;G</div><div class="nav-brand-sub">Seguro Garantia</div></div>
    </a>
    <a href="${WA_URL}" class="nav-cta" target="_blank" rel="noopener">Analise gratuita</a>
  </div>
</nav>
<header class="blog-header">
  <h1 class="blog-header-title">Blog F&amp;G</h1>
  <p class="blog-header-sub">Tudo sobre Seguro Garantia para empresas usarem seu capital de forma inteligente</p>
  <div class="blog-search"><input type="text" id="blog-search-input" placeholder="Buscar artigos..." aria-label="Buscar artigos" autocomplete="off"/></div>
</header>
<section class="featured-section">
  <div class="container">
    <p class="section-label">Destaques</p>
    <div class="feat-grid">
      ${featuredMain}
      <div class="feat-side-list">${featuredSide}</div>
    </div>
  </div>
</section>
<section class="rich-section">
  <div class="container">
    <h2 class="rich-section-title">Ferramentas e materiais gratuitos</h2>
    <div class="rich-grid">${richCards}</div>
  </div>
</section>
<section class="all-section">
  <div class="container">
    <h2 class="all-section-title">Todos os artigos</h2>
    <div class="cat-filter" id="cat-filter">
      <button class="cat-btn active" data-cat="all">Todos</button>
      ${catButtons}
    </div>
    <div class="articles-grid" id="articles-grid">${cardItems}</div>
    ${hasMore ? '<div class="load-more-wrap"><button class="load-more-btn" id="load-more-btn">Carregar mais artigos</button></div>' : ''}
  </div>
</section>
${newsletterFooter}
<script>
(function(){
  'use strict';
  var grid=document.getElementById('articles-grid');
  var loadBtn=document.getElementById('load-more-btn');
  var catFilter=document.getElementById('cat-filter');
  var searchInput=document.getElementById('blog-search-input');
  var allCards=Array.from(grid?grid.querySelectorAll('.card'):[]);
  var PAGE_SIZE=9;
  var visibleHidden=[];
  function applyFilters(){
    var activeCat=catFilter?(catFilter.querySelector('.cat-btn.active')||{}).dataset.cat||'all':'all';
    var q=searchInput?searchInput.value.toLowerCase().trim():'';
    var shown=0;visibleHidden=[];
    allCards.forEach(function(card){
      var matchCat=activeCat==='all'||card.dataset.cat===activeCat;
      var title=card.querySelector('.card-title');
      var matchQ=!q||(title&&title.textContent.toLowerCase().includes(q));
      if(matchCat&&matchQ){shown++;if(shown<=PAGE_SIZE){card.style.display='';}else{card.style.display='none';visibleHidden.push(card);}}else{card.style.display='none';}
    });
    if(loadBtn)loadBtn.parentElement.style.display=visibleHidden.length?'':'none';
  }
  allCards.forEach(function(card){if(card.dataset.hidden)card.style.display='none';});
  if(catFilter)catFilter.addEventListener('click',function(e){if(!e.target.classList.contains('cat-btn'))return;catFilter.querySelectorAll('.cat-btn').forEach(function(b){b.classList.remove('active');});e.target.classList.add('active');applyFilters();});
  if(searchInput)searchInput.addEventListener('input',applyFilters);
  if(loadBtn)loadBtn.addEventListener('click',function(){var toShow=visibleHidden.splice(0,PAGE_SIZE);toShow.forEach(function(c){c.style.display='';});if(visibleHidden.length===0)loadBtn.parentElement.style.display='none';});
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
      sitemap = sitemap.replace('</urlset>', `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>`)
      added++
    }
  }
  writeFileSync(SITEMAP, sitemap)
  if (added) console.log(`✅ sitemap.xml +${added} artigo(s) do blog (MD)`)
}

// ── Main ──────────────────────────────────────────────────────────────────────
// ── Paginas de materiais com captura de lead ──────────────────────────────────
function buildMaterialPage(mat) {
  const SB_URL = SUPABASE.url
  const SB_KEY = SUPABASE.anonKey
  const BASE_URL = 'https://fegsegurogarantia.com.br'
  const canonical = `${BASE_URL}/materiais/${mat.slug}/`
  const WA_URL    = 'https://wa.me/5515998618659?text=Ol%C3%A1%2C%20gostaria%20de%20solicitar%20uma%20an%C3%A1lise%20gratuita%20de%20Seguro%20Garantia.'

  const previewIcon = mat.tipo === 'pdf'
    ? `<svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:90px">
        <rect width="64" height="80" rx="6" fill="#FEF2F2"/>
        <rect x="4" y="4" width="40" height="48" rx="4" fill="#fff" stroke="#FECACA" stroke-width="1.5"/>
        <path d="M44 4l16 16H44z" fill="#FCA5A5"/>
        <rect x="10" y="20" width="28" height="3" rx="1.5" fill="#FCA5A5"/>
        <rect x="10" y="27" width="22" height="3" rx="1.5" fill="#FECACA"/>
        <rect x="10" y="34" width="26" height="3" rx="1.5" fill="#FECACA"/>
        <text x="32" y="73" font-size="11" font-weight="700" fill="#DC2626" text-anchor="middle" font-family="Arial,sans-serif">PDF</text>
      </svg>`
    : `<svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg" style="width:72px;height:90px">
        <rect width="64" height="80" rx="6" fill="#F0FDF4"/>
        <rect x="4" y="4" width="40" height="48" rx="4" fill="#fff" stroke="#BBF7D0" stroke-width="1.5"/>
        <path d="M44 4l16 16H44z" fill="#86EFAC"/>
        <rect x="10" y="18" width="28" height="3" rx="1.5" fill="#86EFAC"/>
        <rect x="10" y="24" width="8"  height="3" rx="1.5" fill="#BBF7D0"/>
        <rect x="21" y="24" width="8"  height="3" rx="1.5" fill="#BBF7D0"/>
        <rect x="32" y="24" width="8"  height="3" rx="1.5" fill="#BBF7D0"/>
        <rect x="10" y="30" width="8"  height="3" rx="1.5" fill="#DCFCE7"/>
        <rect x="21" y="30" width="8"  height="3" rx="1.5" fill="#DCFCE7"/>
        <rect x="32" y="30" width="8"  height="3" rx="1.5" fill="#DCFCE7"/>
        <text x="32" y="73" font-size="9" font-weight="700" fill="#16A34A" text-anchor="middle" font-family="Arial,sans-serif">EXCEL</text>
      </svg>`

  const bullets = mat.bullets.map(b =>
    `<li class="mat-bullet"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8572A" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>${b}</li>`
  ).join('\n        ')

  const newsletterFooter = buildNewsletterFooter()

  return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <title>${mat.titulo} | F&amp;G Seguro Garantia</title>
  <meta name="description" content="${mat.ogDesc}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title"       content="${mat.titulo} | F&amp;G" />
  <meta property="og:description" content="${mat.ogDesc}" />
  <meta property="og:url"         content="${canonical}" />
  <meta property="og:type"        content="website" />
  <meta property="og:image"       content="${BASE_URL}/logo-shield.png" />
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#1C3A5E" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <link rel="preload" href="/fonts/source-serif-4-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/fonts/ibm-plex-sans-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin />
  <style>
    @font-face{font-family:'Source Serif 4';font-style:normal;font-weight:700;font-display:swap;src:url('/fonts/source-serif-4-latin-700-normal.woff2') format('woff2');}
    @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:400;font-display:swap;src:url('/fonts/ibm-plex-sans-latin-400-normal.woff2') format('woff2');}
    @font-face{font-family:'IBM Plex Sans';font-style:normal;font-weight:600;font-display:swap;src:url('/fonts/ibm-plex-sans-latin-600-normal.woff2') format('woff2');}
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    :root{--navy:#1C3A5E;--orange:#E8572A;--bg:#FAFAF8;--text:#1F2937;--muted:#6B7280;--border:#E5E7EB;}
    body{font-family:'IBM Plex Sans',system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.65;}
    a{text-decoration:none;color:inherit;}
    img{display:block;width:100%;height:auto;}
    nav{background:#fff;border-bottom:1px solid var(--border);position:sticky;top:0;z-index:100;}
    .nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:64px;display:flex;align-items:center;justify-content:space-between;}
    .nav-brand{display:flex;align-items:center;gap:10px;}
    .nav-logo-box{width:38px;height:38px;background:var(--navy);border-radius:7px;display:flex;align-items:center;justify-content:center;}
    .nav-logo-box img{width:30px;height:30px;object-fit:contain;}
    .nav-brand-name{font-weight:700;color:var(--navy);font-size:14px;line-height:1;}
    .nav-brand-sub{font-size:10px;color:var(--muted);font-weight:500;}
    .nav-cta{background:var(--orange);color:#fff;font-weight:600;font-size:13px;padding:9px 18px;border-radius:7px;}
    .nav-cta:hover{opacity:.88;}
    .mat-hero{background:var(--navy);padding:56px 24px 64px;text-align:center;}
    .mat-hero-badge{display:inline-block;background:rgba(255,255,255,.12);color:rgba(255,255,255,.85);font-size:12px;font-weight:600;padding:4px 14px;border-radius:999px;margin-bottom:16px;}
    .mat-hero h1{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(26px,4vw,44px);font-weight:700;color:#fff;line-height:1.2;margin-bottom:14px;}
    .mat-hero-sub{color:rgba(255,255,255,.75);font-size:17px;max-width:580px;margin:0 auto;}
    .mat-layout{max-width:1100px;margin:-32px auto 0;padding:0 24px 80px;display:grid;grid-template-columns:1fr 420px;gap:40px;align-items:start;}
    .mat-left{padding-top:16px;}
    .mat-desc{font-size:16px;color:var(--text);line-height:1.7;margin-bottom:24px;}
    .mat-bullets{list-style:none;padding:0;display:flex;flex-direction:column;gap:12px;margin-bottom:32px;}
    .mat-bullet{display:flex;align-items:flex-start;gap:10px;font-size:15px;color:var(--text);line-height:1.5;}
    .mat-preview{background:#fff;border:1px solid var(--border);border-radius:12px;padding:28px;display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06);}
    .mat-preview-badge{font-size:12px;font-weight:600;color:var(--muted);}
    .mat-card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:28px;box-shadow:0 4px 24px rgba(0,0,0,.08);position:relative;z-index:10;}
    .mat-card h2{font-family:'Source Serif 4',Georgia,serif;font-size:20px;font-weight:700;color:var(--navy);margin-bottom:20px;}
    .mat-form{display:flex;flex-direction:column;gap:12px;}
    .mat-input{padding:12px 16px;border:1px solid var(--border);border-radius:8px;font-size:15px;font-family:'IBM Plex Sans',system-ui,sans-serif;outline:none;width:100%;}
    .mat-input:focus{border-color:var(--navy);}
    .mat-lgpd{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--muted);}
    .mat-lgpd input{margin-top:3px;flex-shrink:0;}
    .mat-submit{background:var(--orange);color:#fff;font-weight:700;font-size:16px;padding:14px;border:none;border-radius:8px;cursor:pointer;font-family:'IBM Plex Sans',system-ui,sans-serif;width:100%;transition:opacity .15s;}
    .mat-submit:hover{opacity:.88;}
    .mat-msg{font-size:14px;min-height:18px;margin-top:4px;}
    .mat-success{display:none;text-align:center;padding:12px 0;}
    .mat-success p{color:#166534;font-weight:600;margin-bottom:14px;}
    .mat-dl-btn{display:inline-block;background:var(--navy);color:#fff;font-weight:600;font-size:15px;padding:12px 24px;border-radius:8px;transition:opacity .15s;}
    .mat-dl-btn:hover{opacity:.88;}
    .mat-dl-anyway{display:block;font-size:12px;color:var(--muted);margin-top:10px;}
    .mat-dl-anyway:hover{color:var(--navy);}
    .newsletter-section{background:#F3F4F6;padding:56px 0;}
    .newsletter-inner{max-width:520px;margin:0 auto;text-align:center;padding:0 24px;}
    .newsletter-title{font-family:'Source Serif 4',Georgia,serif;font-size:clamp(22px,3vw,28px);font-weight:700;color:var(--navy);margin-bottom:10px;}
    .newsletter-sub{font-size:15px;color:var(--muted);margin-bottom:24px;}
    .newsletter-form{display:flex;flex-direction:column;gap:10px;}
    .nl-row{display:flex;gap:10px;flex-wrap:wrap;}
    .nl-input{flex:1;min-width:180px;padding:12px 16px;border:1px solid var(--border);border-radius:8px;font-size:15px;font-family:'IBM Plex Sans',system-ui,sans-serif;outline:none;}
    .nl-input:focus{border-color:var(--navy);}
    .nl-lgpd{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--muted);text-align:left;}
    .nl-lgpd input{margin-top:3px;}
    .nl-btn{background:var(--orange);color:#fff;font-weight:600;font-size:15px;padding:13px 28px;border:none;border-radius:8px;cursor:pointer;font-family:'IBM Plex Sans',system-ui,sans-serif;width:100%;}
    .nl-btn:hover{opacity:.88;}
    .nl-msg{min-height:20px;font-size:14px;margin-top:4px;}
    .newsletter-note{font-size:12px;color:#9CA3AF;margin-top:12px;}
    .site-footer{background:var(--navy);color:#94A3B8;padding:40px 24px;}
    .footer-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr 1fr;gap:32px;}
    .footer-brand{font-weight:700;color:#fff;font-size:15px;margin-bottom:6px;}
    .footer-info{font-size:13px;line-height:1.7;}
    .footer-col h4{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#fff;margin-bottom:12px;}
    .footer-col a{display:block;font-size:13px;color:#94A3B8;margin-bottom:6px;}
    .footer-col a:hover{color:#fff;}
    .footer-bottom{max-width:1200px;margin:28px auto 0;padding-top:20px;border-top:1px solid rgba(255,255,255,.1);font-size:12px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;}
    @media(max-width:768px){.mat-layout{grid-template-columns:1fr;margin-top:0;}.mat-hero{padding:40px 20px 48px;}.footer-inner{grid-template-columns:1fr;}}
  </style>
</head>
<body>

<nav>
  <div class="nav-inner">
    <a href="/" class="nav-brand" aria-label="F&amp;G Seguro Garantia">
      <div class="nav-logo-box"><img src="/logo-nav.webp" alt="" width="30" height="30" aria-hidden="true"/></div>
      <div><div class="nav-brand-name">F&amp;G</div><div class="nav-brand-sub">Seguro Garantia</div></div>
    </a>
    <a href="${WA_URL}" class="nav-cta" target="_blank" rel="noopener">Analise gratuita</a>
  </div>
</nav>

<div class="mat-hero">
  <p class="mat-hero-badge">${mat.badge}</p>
  <h1>${mat.titulo}</h1>
  <p class="mat-hero-sub">${mat.subtitulo}</p>
</div>

<div class="mat-layout">
  <div class="mat-left">
    <p class="mat-desc">${mat.descricao}</p>
    <ul class="mat-bullets">
      ${bullets}
    </ul>
    <div class="mat-preview">
      ${previewIcon}
      <p class="mat-preview-badge">${mat.badge}</p>
    </div>
  </div>

  <div class="mat-card">
    <h2>Baixar gratuitamente</h2>
    <form class="mat-form" id="mat-form" novalidate>
      <input type="text"  name="mat_nome"    id="mat-nome"    placeholder="Seu nome *"            class="mat-input" required autocomplete="name"/>
      <input type="email" name="mat_email"   id="mat-email"   placeholder="Seu e-mail *"          class="mat-input" required autocomplete="email"/>
      <input type="text"  name="mat_empresa" id="mat-empresa" placeholder="Empresa (opcional)"    class="mat-input" autocomplete="organization"/>
      <label class="mat-lgpd">
        <input type="checkbox" name="mat_lgpd" id="mat-lgpd" required/>
        Aceito que a F&amp;G entre em contato por e-mail (LGPD)
      </label>
      <button type="submit" class="mat-submit" id="mat-btn">Baixar material</button>
    </form>
    <p class="mat-msg" id="mat-msg" aria-live="polite" role="status"></p>
    <div class="mat-success" id="mat-success">
      <p>Pronto! Seu material esta pronto para download.</p>
      <a href="${mat.arquivo}" class="mat-dl-btn" id="mat-dl" download>Baixar agora</a>
      <a href="${mat.arquivo}" class="mat-dl-anyway" download>Clique aqui se o download nao iniciar</a>
    </div>
  </div>
</div>

${newsletterFooter}

<script>
(function(){
  'use strict';
  var SB_URL   = '${SB_URL}';
  var SB_KEY   = '${SB_KEY}';
  var ARQUIVO  = '${mat.arquivo}';
  var MATERIAL = '${mat.slug}';
  var form     = document.getElementById('mat-form');
  if (!form) return;

  function showDownload(auto) {
    form.style.display     = 'none';
    document.getElementById('mat-success').style.display = 'block';
    if (auto) {
      var a = document.createElement('a');
      a.href     = ARQUIVO;
      a.download = '';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var nome    = (document.getElementById('mat-nome')   ||{}).value||'';
    var email   = (document.getElementById('mat-email')  ||{}).value||'';
    var empresa = (document.getElementById('mat-empresa')||{}).value||'';
    var lgpd    = (document.getElementById('mat-lgpd')   ||{}).checked;
    nome  = nome.trim(); email = email.trim();
    if (!nome || !email || !lgpd) return;
    var btn = document.getElementById('mat-btn');
    var msg = document.getElementById('mat-msg');
    btn.textContent = 'Enviando...';
    btn.disabled    = true;
    if (!SB_URL || SB_URL === 'COLOQUE_AQUI') {
      // Supabase nao configurado: libera download diretamente
      showDownload(true);
      return;
    }
    fetch(SB_URL + '/rest/v1/leads_materiais', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'apikey':        SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify({
        nome:     nome,
        email:    email,
        empresa:  empresa || null,
        material: MATERIAL,
        origem:   window.location.pathname
      })
    }).then(function(r){
      if (r.ok || r.status === 409) {
        showDownload(true);
      } else {
        msg.textContent = 'Erro ao registrar. Tente novamente.';
        msg.style.color = '#991B1B';
        btn.textContent = 'Baixar material';
        btn.disabled    = false;
        // Oferece link direto mesmo com erro
        var dl = document.createElement('a');
        dl.href      = ARQUIVO;
        dl.download  = '';
        dl.className = 'mat-dl-anyway';
        dl.textContent = 'Baixar mesmo assim';
        msg.after(dl);
      }
    }).catch(function(){
      msg.textContent = 'Erro de conexao.';
      msg.style.color = '#991B1B';
      btn.textContent = 'Baixar material';
      btn.disabled    = false;
      var dl = document.createElement('a');
      dl.href      = ARQUIVO;
      dl.download  = '';
      dl.className = 'mat-dl-anyway';
      dl.textContent = 'Baixar mesmo assim';
      msg.after(dl);
    });
  });
})();
</script>

</body>
</html>`
}

export function buildMaterialPages(distRoot, sitemapPath) {
  const BASE_URL = 'https://fegsegurogarantia.com.br'
  let sitemapAdded = 0
  for (const mat of MATERIAIS) {
    const outDir = join(distRoot, 'materiais', mat.slug)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), buildMaterialPage(mat))
    console.log(`✅ /materiais/${mat.slug}/`)
    if (mat.sitemap && existsSync(sitemapPath)) {
      let sm = readFileSync(sitemapPath, 'utf-8')
      const url = `${BASE_URL}/materiais/${mat.slug}/`
      if (!sm.includes(`<loc>${url}</loc>`)) {
        sm = sm.replace('</urlset>', `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>\n</urlset>`)
        writeFileSync(sitemapPath, sm)
        sitemapAdded++
      }
    }
  }
  if (sitemapAdded) console.log(`✅ sitemap.xml +${sitemapAdded} pagina(s) de materiais`)
}

export function buildBlogFromMarkdown() {
  if (!existsSync(CONTENT)) { console.log('ℹ️  content/blog/ nao encontrado, pulando'); return }

  const mdFiles = readdirSync(CONTENT).filter(f => f.endsWith('.md') && !f.startsWith('modelo'))
  if (!mdFiles.length) { console.log('ℹ️  Nenhum .md em content/blog/'); return }

  const TEMPLATE = readFileSync(join(__dirname, 'blog-template.html'), 'utf-8')

  // Pass 1: parse all frontmatters + compute images
  const allParsed = mdFiles.map(file => {
    const raw = readFileSync(join(CONTENT, file), 'utf-8')
    let parsed
    try { parsed = matter(raw) } catch (e) { throw new Error(`[blog-build] ERRO em ${file}: ${e.message}`) }
    const { ogImage, cardImage } = computeImages(parsed.data)
    return { file, fm: parsed.data, body: parsed.content.trim(), ogImage, cardImage }
  })

  // Pass 2: render each article with related articles context
  const articles = []
  for (const parsed of allParsed) {
    const result = renderArticle(parsed, allParsed, TEMPLATE)
    const outDir = join(DIST_BLOG, result.slug)
    mkdirSync(outDir, { recursive: true })
    writeFileSync(join(outDir, 'index.html'), result.html)
    console.log(`✅ /blog/${result.slug}/ (MD)`)
    articles.push(result)
  }

  const listingHtml = buildBlogListing(articles)
  mkdirSync(DIST_BLOG, { recursive: true })
  writeFileSync(join(DIST_BLOG, 'index.html'), listingHtml)
  console.log(`✅ /blog/ listagem com ${articles.length} artigos`)

  updateSitemapWithArticles(articles.map(a => a.slug))
}
