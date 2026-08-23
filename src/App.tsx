import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'

const Home         = lazy(() => import('./pages/Home'))
const Modalidade   = lazy(() => import('./pages/Modalidade'))
const FAQPage      = lazy(() => import('./pages/FAQ'))
const Blog         = lazy(() => import('./pages/Blog'))
const BlogArticle  = lazy(() => import('./pages/BlogArticle'))
const Cyber        = lazy(() => import('./pages/SeguroCyber'))

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-fg-orange border-t-transparent rounded-full animate-spin" aria-label="Carregando" />
    </div>
  )
}

// Normaliza trailing slash: garante que qualquer navegação client-side
// chegue ao React Router com barra final (espelhando o comportamento do servidor).
// Usa replace para não poluir o histórico.
function TrailingSlashNormalizer() {
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (pathname !== '/' && !pathname.endsWith('/')) {
      navigate(pathname + '/' + search + hash, { replace: true })
    }
  }, [pathname, navigate, search, hash])

  return null
}

function AppInner() {
  return (
    <>
      <TrailingSlashNormalizer />
      <ScrollToTop />
      <Navbar />
      <main>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Modalidades — rota dinâmica captura o sufixo do slug.
                /seguro-garantia-:slug/ → slug='licitante', 'execucao-contrato', etc. */}
            <Route path="/seguro-garantia-:slug/" element={<Modalidade />} />

            <Route path="/perguntas-frequentes/" element={<FAQPage />} />
            <Route path="/blog/" element={<Blog />} />
            <Route path="/blog/:slug/" element={<BlogArticle />} />
            <Route path="/seguro-cyber/" element={<Cyber />} />

            {/* Catch-all: rotas inexistentes → home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </HelmetProvider>
  )
}
