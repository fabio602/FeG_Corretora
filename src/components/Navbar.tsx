import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { WA_URL } from '../data/content'

const LINKS = [
  { to: '/#modalidades', label: 'Modalidades' },
  { to: '/#como-funciona', label: 'Como funciona' },
  { to: '/perguntas-frequentes', label: 'FAQ' },
  { to: '/blog', label: 'Blog' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-shadow duration-200 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur'}`}>
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2" aria-label="F&G Corretora — página inicial">
          <img src="/logo-nav.webp" alt="" className="h-8 w-8 object-contain" width="32" height="32" loading="eager" aria-hidden="true" />
          <span className="font-bold text-fg-navy text-base leading-tight">
            F&G<br /><span className="text-xs font-normal text-gray-500">Seguro Garantia</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6" aria-label="Menu principal">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} className="text-sm font-medium text-gray-600 hover:text-fg-navy transition-colors">
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2 bg-fg-orange text-white rounded-lg hover:bg-orange-700 transition-colors">
            Solicitar análise
          </a>
        </div>

        <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Abrir menu" aria-expanded={open}>
          <span className="block w-5 h-0.5 bg-fg-navy mb-1"></span>
          <span className="block w-5 h-0.5 bg-fg-navy mb-1"></span>
          <span className="block w-5 h-0.5 bg-fg-navy"></span>
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-6 py-4 flex flex-col gap-4">
          {LINKS.map(l => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="text-sm font-medium text-gray-700 hover:text-fg-navy">
              {l.label}
            </NavLink>
          ))}
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="text-sm font-semibold px-4 py-2 bg-fg-orange text-white rounded-lg text-center">
            Solicitar análise gratuita
          </a>
        </div>
      )}
    </header>
  )
}
