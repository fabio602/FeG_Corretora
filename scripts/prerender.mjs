/**
 * prerender.mjs
 *
 * Gera o HTML estatico das rotas da SPA (home, modalidades, FAQ, Cyber) em
 * legacy/prerender/<slug>.html, a partir de src/ via Vite SSR + renderToString.
 *
 * Roda na maquina de quem publica, junto com a regeneracao do bundle:
 *
 *   npx vite build                       # bundle novo em dist/assets
 *   cp dist/assets/index-*.js  legacy/assets/index-Bhzvy-ks.js
 *   cp dist/assets/index-*.css legacy/assets/index-BRVWEG0Z.css
 *   node scripts/prerender.mjs           # snapshots em legacy/prerender/
 *   npm run build                        # dist/ final (o que a Hostinger faz)
 *
 * A Hostinger NAO roda este script: ela so executa build-legacy.mjs, que le
 * os snapshots ja commitados. Por isso os arquivos de legacy/prerender/ vao
 * para o git, como o bundle.
 *
 * Detalhes:
 *  - Elementos com a classe `reveal` ficam invisiveis por CSS ate o
 *    IntersectionObserver marcar `is-visible`. No snapshot, marcamos todos
 *    como visiveis: o HTML estatico e para o Google e para o primeiro paint,
 *    e o React substitui tudo ao montar.
 *  - O snapshot e o innerHTML do <div id="root">; head/meta continuam vindo
 *    de scripts/seo-routes.json e de legacy/index.html.
 */
import { build } from 'vite'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT   = join(__dirname, '..')
const OUT    = join(ROOT, 'legacy', 'prerender')
const TMP    = join(ROOT, '.prerender-ssr')

console.log('🔧 Compilando entry-prerender (SSR)…')
await build({
  root: ROOT,
  logLevel: 'warn',
  build: {
    ssr: 'src/entry-prerender.tsx',
    outDir: TMP,
    emptyOutDir: true,
    rollupOptions: { output: { entryFileNames: 'entry-prerender.mjs' } },
  },
})

const mod = await import(pathToFileURL(join(TMP, 'entry-prerender.mjs')).href)

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

for (const slug of mod.routes()) {
  let html = mod.render(slug)
  // Revela os blocos animados no HTML estatico (ver cabecalho).
  html = html.replace(/class="([^"]*\breveal\b[^"]*)"/g, (m, cls) =>
    cls.includes('is-visible') ? m : `class="${cls} is-visible"`)
  const file = join(OUT, (slug || 'home') + '.html')
  writeFileSync(file, html)
  const texto = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  console.log(`✅ ${slug || '(home)'}: ${texto.length.toLocaleString('pt-BR')} caracteres de texto`)
}

rmSync(TMP, { recursive: true })
console.log('\n🎉 Snapshots em legacy/prerender/')
