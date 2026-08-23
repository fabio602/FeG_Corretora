import { routePath } from '../data/routes'
import { useState, useEffect, useRef } from 'react'
import LogoHorizontal from './icons/LogoHorizontal'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { WA_URL, MODALIDADES } from '../data/content'

const PORTAL_URL = 'https://hub.fegsegurogarantia.com/'

// Source of truth: primeiras 4 modalidades (licitante, execução, judicial, locatícia)
// derivadas diretamente de src/data/content.ts
const DRAWER_MODALITIES = MODALIDADES.filter(m => m.destaqueMenu).map(m => ({
  label: m.title.replace('Seguro Garantia ', '').replace('Garantia ', ''),
  href: m.slug,
}))

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate   = useNavigate()
  const location   = useLocation()
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Scroll shadow
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Scroll lock + scrollbar-shift compensation + ESC
  useEffect(() => {
    if (!open) {
      document.body.style.overflow  = ''
      document.body.style.paddingRight = ''
      window.dispatchEvent(new CustomEvent('navmenu', { detail: { open: false } }))
      return
    }
    const sb = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow  = 'hidden'
    if (sb > 0) document.body.style.paddingRight = `${sb}px`
    window.dispatchEvent(new CustomEvent('navmenu', { detail: { open: true } }))
    requestAnimationFrame(() => closeBtnRef.current?.focus())

    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onEsc)
    return () => {
      window.removeEventListener('keydown', onEsc)
      document.body.style.overflow  = ''
      document.body.style.paddingRight = ''
    }
  }, [open])

  // Close drawer + collapse submenu on route change
  useEffect(() => { setOpen(false); setModalOpen(false) }, [location.pathname])

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
      navigate(routePath(href))
    }
  }

  // Shared link style for drawer items
  const drawerLink = 'flex items-center min-h-[48px] py-1 text-[17px] font-medium border-b border-white/10 text-white/90 hover:text-white active:opacity-70 transition-colors'

  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200
          ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
        <div className="container flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0"
            aria-label="F&G Seguro Garantia, ir para a home">
            <LogoHorizontal className="h-11 w-auto text-fg-navy" />
          </Link>

          {/* Desktop nav — unchanged per spec */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Menu principal">
            <a href="/" onClick={e => handleAnchor(e, '/')}
              className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors">
              Início
            </a>
            <a href="/#quem-somos" onClick={e => handleAnchor(e, '/#quem-somos')}
              className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors whitespace-nowrap">
              Quem Somos
            </a>
            {/* Hover dropdown — desktop only, desktop unchanged */}
            <div className="relative group">
              <a href="/#modalidades" onClick={e => handleAnchor(e, '/#modalidades')}
                className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors flex items-center gap-1">
                Modalidades
                <svg className="w-3 h-3 opacity-50 transition-transform duration-150 group-hover:rotate-180"
                  viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><path d="M6 8L1 3h10z"/></svg>
              </a>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-lg
                              opacity-0 invisible group-hover:opacity-100 group-hover:visible
                              translate-y-1 group-hover:translate-y-0 transition-all duration-150 z-50">
                {MODALIDADES.filter(m => m.destaqueMenu).map(m => (
                  <a key={m.slug} href={routePath(m.slug)}
                    onClick={e => { e.preventDefault(); navigate(routePath(m.slug)) }}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:text-fg-navy hover:bg-gray-50
                               first:rounded-t-xl last:rounded-b-xl transition-colors">
                    {m.title}
                  </a>
                ))}
              </div>
            </div>
            <a href="/#vantagens" onClick={e => handleAnchor(e, '/#vantagens')}
              className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors">
              Vantagens
            </a>
            <a href={routePath('/blog')} onClick={e => handleAnchor(e, '/blog')}
              className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors">
              Blog
            </a>
            <a href={routePath('/seguro-cyber')} onClick={e => { e.preventDefault(); navigate(routePath('/seguro-cyber')) }}
              className="text-sm font-medium text-fg-orange hover:underline flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-fg-orange" aria-hidden="true" />
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
              className="text-sm font-semibold px-4 py-2 bg-fg-orange text-white rounded-lg hover:opacity-90 transition-opacity">
              Solicitar Cotação
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden p-3 -mr-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Fechar menu de navegação' : 'Abrir menu de navegação'}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            aria-haspopup="dialog"
          >
            <svg className="w-6 h-6 text-fg-navy" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              {open
                ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
              }
            </svg>
          </button>
        </div>
      </header>

      {/* ── Mobile drawer (full screen) ───────────────────────────────── */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!open}
        className={`fixed inset-0 z-[200] bg-fg-navy text-white flex flex-col lg:hidden
                    transition-transform duration-300 ease-out
                    ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <LogoHorizontal className="h-11 w-auto text-[#EAC8AC]" />
          </div>
          <button
            ref={closeBtnRef}
            onClick={() => setOpen(false)}
            aria-label="Fechar menu de navegação"
            className="p-3 -mr-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Scrollable links */}
        <nav className="flex-1 overflow-y-auto px-5 py-2" aria-label="Menu mobile">

          <a href="/" onClick={e => handleAnchor(e, '/')} className={drawerLink}>Início</a>

          <a href="/#quem-somos" onClick={e => handleAnchor(e, '/#quem-somos')} className={drawerLink}>
            Quem Somos
          </a>

          {/* Modalidades — accordion */}
          <div className="border-b border-white/10">
            <button
              onClick={() => setModalOpen(o => !o)}
              aria-expanded={modalOpen}
              aria-controls="mobile-modalities"
              className="flex items-center justify-between w-full min-h-[48px] py-1
                         text-[17px] font-medium text-white/90 hover:text-white
                         active:opacity-70 transition-colors"
            >
              Modalidades
              <svg
                className={`w-5 h-5 text-white/50 transition-transform duration-200
                            ${modalOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
              >
                <path fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd" />
              </svg>
            </button>

            <div
              id="mobile-modalities"
              className={`overflow-hidden transition-[max-height] duration-300 ease-out
                          ${modalOpen ? 'max-h-64' : 'max-h-0'}`}
            >
              {DRAWER_MODALITIES.map(m => (
                <a
                  key={m.href}
                  href={routePath(m.href)}
                  onClick={e => { e.preventDefault(); navigate(routePath(m.href)); setOpen(false) }}
                  className="flex items-center gap-3 min-h-[48px] pl-4 text-[15px]
                             font-medium text-white/70 hover:text-white border-b border-white/5
                             last:border-0 active:opacity-70 transition-colors"
                >
                  <span className="w-1 h-1 rounded-full bg-fg-orange shrink-0" aria-hidden="true" />
                  {m.label}
                </a>
              ))}
            </div>
          </div>

          <a href="/#vantagens" onClick={e => handleAnchor(e, '/#vantagens')} className={drawerLink}>
            Vantagens
          </a>

          <a href={routePath('/blog')} onClick={e => handleAnchor(e, '/blog')} className={drawerLink}>Blog</a>

          <a href={routePath('/seguro-cyber')}
            onClick={e => { e.preventDefault(); navigate(routePath('/seguro-cyber')); setOpen(false) }}
            className="flex items-center gap-2 min-h-[48px] py-1 text-[17px] font-medium
                       border-b border-white/10 text-fg-orange active:opacity-70 transition-colors">
            <span className="w-1.5 h-1.5 rounded-full bg-fg-orange shrink-0" aria-hidden="true" />
            Seguro Cyber
          </a>

          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center min-h-[48px] py-1 text-[15px] font-medium
                       text-white/50 hover:text-white/80 active:opacity-70 transition-colors">
            Portal do Corretor ↗
          </a>
        </nav>

        {/* Bottom CTA */}
        <div className="px-5 pb-10 pt-3 shrink-0 border-t border-white/10">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-3 w-full min-h-[56px] rounded-2xl
                       bg-fg-orange text-white font-semibold text-[17px]
                       active:opacity-80 transition-opacity"
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
