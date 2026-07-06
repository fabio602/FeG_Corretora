/**
 * apply-article-template.mjs
 *
 * Applies improved template CSS + read-time + progress bar to all
 * blog article source files in public/blog/*/index.html.
 * Run once: node scripts/apply-article-template.mjs
 * Safe to re-run (idempotent via sentinel comments).
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const BLOG_SRC = join(ROOT, 'public', 'blog')

const READ_TIMES = {
  'o-que-e-seguro-garantia': '7 min de leitura',
  'seguro-garantia-deposito-recursal': '5 min de leitura',
  'garantia-adicional-lei-14133': '6 min de leitura',
}

const PROGRESS_BAR_CSS = `
    /* Reading progress bar */
    #reading-progress {
      position: fixed; top: 0; left: 0; height: 3px;
      background: var(--orange); width: 0%; z-index: 9999;
      transition: width .08s linear; pointer-events: none;
    }

    /* Blockquote */
    blockquote {
      border-left: 4px solid var(--orange); margin: 24px 0;
      padding: 12px 20px; background: #FFF7ED; border-radius: 0 8px 8px 0;
      font-style: italic; color: #374151;
    }
    blockquote p { margin-bottom: 0; font-size: 17px; }

    /* Table overflow on mobile */
    .comparison { overflow-x: auto; }
`

const PROGRESS_BAR_HTML = `<div id="reading-progress"></div>\n`

const PROGRESS_BAR_SCRIPT = `\n<script>
(function(){
  var bar = document.getElementById('reading-progress');
  if(!bar) return;
  window.addEventListener('scroll', function(){
    var h = document.documentElement;
    var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = Math.min(isNaN(pct) ? 0 : pct, 100) + '%';
  }, { passive: true });
})();
</script>`

function transformArticle(html, slug) {
  // Idempotency guard
  if (html.includes('reading-progress')) {
    console.log(`  ⏭️  ${slug} — já transformado, pulando`)
    return html
  }

  // 1. Narrow article max-width to 720px
  html = html.replace(/article \{ max-width: 900px;/, 'article { max-width: 720px;')

  // 2. Improve base paragraph typography
  html = html.replace(
    /p \{ margin-bottom: 16px; \}/,
    'p { margin-bottom: 18px; font-size: 17px; line-height: 1.75; }'
  )

  // 3. Improve list item size
  html = html.replace(
    /li \{ margin-bottom: 8px; \}/,
    'li { margin-bottom: 8px; font-size: 17px; }'
  )

  // 4. Inject progress bar CSS before </style>
  html = html.replace('</style>', PROGRESS_BAR_CSS + '  </style>')

  // 5. Progress bar div right after <body>
  html = html.replace('<body>\n', `<body>\n${PROGRESS_BAR_HTML}`)

  // 6. Progress bar script before </body>
  html = html.replace('</body>', PROGRESS_BAR_SCRIPT + '\n</body>')

  // 7. Add read time to article-meta
  const readTime = READ_TIMES[slug] || '5 min de leitura'
  html = html.replace(
    /(<time class="article-date"[^>]*>[^<]+<\/time>)/,
    `$1\n    <span class="article-date">· ${readTime}</span>`
  )

  return html
}

const slugs = readdirSync(BLOG_SRC).filter(s => {
  const p = join(BLOG_SRC, s)
  return statSync(p).isDirectory() && existsSync(join(p, 'index.html'))
})

for (const slug of slugs) {
  const path = join(BLOG_SRC, slug, 'index.html')
  const original = readFileSync(path, 'utf-8')
  const updated = transformArticle(original, slug)
  if (updated !== original) {
    writeFileSync(path, updated)
    console.log(`✅ /blog/${slug}/index.html atualizado`)
  }
}
console.log('✅ apply-article-template concluído')
