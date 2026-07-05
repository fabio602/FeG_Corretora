import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import WhatsAppButton from './components/WhatsAppButton'

const Home      = lazy(() => import('./pages/Home'))
const Modalidade = lazy(() => import('./pages/Modalidade'))
const FAQPage   = lazy(() => import('./pages/FAQ'))
const Blog      = lazy(() => import('./pages/Blog'))
const Cyber     = lazy(() => import('./pages/SeguroCyber'))

function Spinner() {
  return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-fg-orange border-t-transparent rounded-full animate-spin" aria-label="Carregando" /></div>
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Navbar />
        <main>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/seguro-garantia-licitante" element={<Modalidade />} />
              <Route path="/seguro-garantia-execucao-contrato" element={<Modalidade />} />
              <Route path="/seguro-garantia-judicial" element={<Modalidade />} />
              <Route path="/seguro-garantia-locaticia" element={<Modalidade />} />
              <Route path="/seguro-garantia-adicional" element={<Modalidade />} />
              <Route path="/seguro-garantia-energia" element={<Modalidade />} />
              <Route path="/perguntas-frequentes" element={<FAQPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/seguro-cyber" element={<Cyber />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <WhatsAppButton />
      </BrowserRouter>
    </HelmetProvider>
  )
}
