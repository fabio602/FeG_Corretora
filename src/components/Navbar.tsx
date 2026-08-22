import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { WA_URL } from '../data/content'

const PORTAL_URL = 'https://hub.fegsegurogarantia.com/'

const LINKS = [
  { label: 'Início', hash: '/' },
  { label: 'Quem Somos', hash: '/#quem-somos' },
  { label: 'Modalidades', hash: '/#modalidades' },
  { label: 'Vantagens', hash: '/#vantagens' },
  { label: 'Blog', hash: '/blog' },
]

// Exposed so WhatsAppButton can check it
export let navMenuOpen = false

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Body scroll lock + global flag + ESC key
  useEffect(() => {
    navMenuOpen = open
    document.body.style.overflow = open ? 'hidden' : ''
    // Dispatch custom event so WhatsAppButton can react
    window.dispatchEvent(new CustomEvent('navmenu', { detail: { open } }))

    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  function handleAnchor(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    e.preventDefault()
    setOpen(false)
    if (href.startsWith('/#')) {
      const id = href.slice(2)
      if (location.pathname === '/') {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300)
      }
    } else {
      navigate(href)
    }
  }

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="container flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="F&G Corretora — página inicial">
            <img src="/logo-shield.webp" alt="F&G Corretora de Seguros" className="h-10 w-auto object-contain" width="40" height="40" loading="eager" />
            <div className="leading-tight">
              <span className="block font-bold text-fg-navy text-sm">F&G</span>
              <span className="block text-[11px] font-normal text-gray-500 uppercase tracking-wide">Corretora de Seguros</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5" aria-label="Menu principal">
            {LINKS.map(l => (
              <a key={l.hash} href={l.hash} onClick={e => handleAnchor(e, l.hash)}
                className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors whitespace-nowrap">
                {l.label}
              </a>
            ))}
            <a href="https://www.fegsegurogarantia.com.br/seguro-cyber"
              className="text-sm font-medium text-fg-orange hover:underline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fg-orange inline-block" />
              Seguro Cyber
            </a>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-fg-navy border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
              Portal do Corretor
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="text-sm font-semibold px-4 py-2 bg-fg-orange text-white rounded-lg hover:bg-orange-700 transition-colors">
              Solicitar Cotação
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-3 -mr-1 z-[101] relative"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
          >
            <span className={`block w-5 h-0.5 bg-fg-navy transition-all mb-1.5 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-fg-navy transition-all mb-1.5 ${open ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-fg-navy transition-all origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* Mobile full-screen drawer */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
        className={`fixed inset-0 z-[100] bg-[#0F2740] text-white flex flex-col
                    transition-transform duration-300 ease-out lg:hidden
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <img src="/logo-shield.webp" alt="" width="32" height="32" className="h-8 w-auto" />
            <span className="font-bold text-sm">F&amp;G Seguro Garantia</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="p-3 -mr-1 text-white/70 hover:text-white transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col px-5 pt-4 pb-2 overflow-y-auto flex-1" aria-label="Menu mobile">
          {LINKS.map(l => (
            <a
              key={l.hash}
              href={l.hash}
              onClick={e => handleAnchor(e, l.hash)}
              className="py-4 text-[17px] font-medium border-b border-white/10 text-white/90 hover:text-white active:opacity-70 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://www.fegsegurogarantia.com.br/seguro-cyber"
            onClick={() => setOpen(false)}
            className="py-4 text-[17px] font-medium border-b border-white/10 text-fg-orange active:opacity-70 transition-colors flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-fg-orange inline-block" />
            Seguro Cyber
          </a>
          <a
            href={PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="py-4 text-[17px] font-medium border-b border-white/10 text-white/60 hover:text-white/90 active:opacity-70 transition-colors"
          >
            Portal do Corretor
          </a>
        </nav>

        {/* Bottom CTA */}
        <div className="px-5 pb-10 pt-4 shrink-0">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-fg-orange text-white font-semibold text-[17px] active:opacity-80 transition-opacity"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Solicitar Cotação
          </a>
        </div>
      </div>
    </>
  )
}
