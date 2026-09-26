/**
 * entry-prerender.tsx
 *
 * Ponto de entrada usado SOMENTE por scripts/prerender.mjs, fora do navegador.
 * Renderiza cada rota da SPA em HTML estatico (renderToString) para o Google
 * receber o conteudo completo da home, das modalidades, do FAQ e do Cyber sem
 * depender de executar JavaScript. O resultado vai para legacy/prerender/ e o
 * build-legacy.mjs coloca esse HTML dentro do <div id="root">; quando o React
 * monta no navegador, ele substitui o conteudo pelo interativo, identico.
 *
 * Espelha as rotas de App.tsx, mas com imports diretos (sem lazy), porque o
 * renderToString nao espera Suspense. Ao criar uma pagina nova em App.tsx,
 * acrescente aqui tambem.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import { MODALIDADES } from './data/content'
import Home from './pages/Home'
import Modalidade from './pages/Modalidade'
import FAQPage from './pages/FAQ'
import Cyber from './pages/SeguroCyber'

function PrerenderApp({ url }: { url: string }) {
  const helmetContext = {}
  return (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/perguntas-frequentes/" element={<FAQPage />} />
            <Route path="/seguro-cyber/" element={<Cyber />} />
            {MODALIDADES.map(m => (
              <Route key={m.slug} path={m.slug} element={<Modalidade />} />
            ))}
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </StaticRouter>
    </HelmetProvider>
  )
}

/** Rotas que o prerender cobre: '' (home) e os slugs sem barras. */
export function routes(): string[] {
  return [
    '',
    'perguntas-frequentes',
    'seguro-cyber',
    ...MODALIDADES.map(m => m.slug.replace(/^\/|\/$/g, '')),
  ]
}

export function render(slug: string): string {
  const url = slug ? `/${slug}/` : '/'
  return renderToString(
    <StrictMode>
      <PrerenderApp url={url} />
    </StrictMode>,
  )
}
