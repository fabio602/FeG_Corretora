import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { WA_URL } from '../data/content'

const PORTAL_URL = 'https://hub.fegsegurogarantia.com/' // ← substitua pela URL correta do portal

const LINKS = [
  { label: 'Início', hash: '/' },
  { label: 'Quem Somos', hash: '/#quem-somos' },
  { label: 'Modalidades', hash: '/#modalidades' },
  { label: 'Vantagens', hash: '/#vantagens' },
  { label: 'Blog', hash: '/blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <button className="lg:hidden p-2" onClick={() => setOpen(!open)} aria-label="Abrir menu" aria-expanded={open}>
          <span className={`block w-5 h-0.5 bg-fg-navy transition-all mb-1 ${open ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`block w-5 h-0.5 bg-fg-navy transition-all mb-1 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-fg-navy transition-all ${open ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t px-6 py-4 flex flex-col gap-3 shadow-lg">
          {LINKS.map(l => (
            <a key={l.hash} href={l.hash} onClick={e => handleAnchor(e, l.hash)}
              className="text-sm font-medium text-gray-700 hover:text-fg-navy py-1">
              {l.label}
            </a>
          ))}
          <a href="https://www.fegsegurogarantia.com.br/seguro-cyber" onClick={() => setOpen(false)}
            className="text-sm font-medium text-fg-orange py-1">Seguro Cyber</a>
          <a href={PORTAL_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
            className="text-sm font-medium text-gray-600 py-1">Portal do Corretor</a>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2.5 bg-fg-orange text-white rounded-lg text-center mt-1">
            Solicitar Cotação
          </a>
        </div>
      )}
    </header>
  )
}
