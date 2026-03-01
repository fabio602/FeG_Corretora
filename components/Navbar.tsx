
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isCyberPage = location.pathname === '/seguro-cyber';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-fg-navy py-3 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div
          className="flex items-center space-x-3 group cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/logo.jpg" alt="F&G Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className="font-bold text-xl leading-none text-white">F&amp;G</span>
            <span className="text-[10px] uppercase tracking-widest text-fg-gold font-medium">Corretora de Seguros</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-sm font-medium">
          <a href="/#inicio" className="text-white/90 hover:text-fg-gold transition-colors whitespace-nowrap">Início</a>
          <a href="/#quem-somos" className="text-white/90 hover:text-fg-gold transition-colors whitespace-nowrap">Quem Somos</a>
          <a href="/#modalidades" className="text-white/90 hover:text-fg-gold transition-colors whitespace-nowrap">Modalidades</a>
          <a href="/#vantagens" className="text-white/90 hover:text-fg-gold transition-colors whitespace-nowrap">Vantagens</a>
          {/* Seguro Cyber — destaque de primeira hierarquia */}
          <Link
            to="/seguro-cyber"
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border font-bold transition-all hover:scale-105 whitespace-nowrap ${isCyberPage
              ? 'bg-fg-gold text-fg-navy border-fg-gold'
              : 'text-fg-gold border-fg-gold/40 hover:bg-fg-gold/10'
              }`}
          >
            <Shield className="w-3.5 h-3.5" />
            Seguro Cyber
          </Link>
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-fg-gold transition-colors whitespace-nowrap">Blog</a>
          <a href="https://linen-armadillo-993759.hostingersite.com" target="_blank" rel="noopener noreferrer" className="text-white/90 border border-white/20 px-4 py-2 rounded-full font-medium hover:bg-white/10 transition-all whitespace-nowrap">
            Portal do Corretor
          </a>
          <a href="https://wa.me/5515998618659?text=Ol%C3%A1,%20recebi%20sua%20apresenta%C3%A7%C3%A3o%20e%20gostaria%20de%20conhecer%20melhor%20a%20F%26G." target="_blank" rel="noopener noreferrer" className="bg-fg-gold text-fg-navy px-4 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap">
            Solicitar Cotação
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-fg-navy/95 backdrop-blur-lg border-t border-white/5 px-6 py-6 space-y-4">
          <a href="/#inicio" className="block text-white hover:text-fg-gold transition-colors py-2" onClick={() => setMobileOpen(false)}>Início</a>
          <a href="/#quem-somos" className="block text-white hover:text-fg-gold transition-colors py-2" onClick={() => setMobileOpen(false)}>Quem Somos</a>
          <a href="/#modalidades" className="block text-white hover:text-fg-gold transition-colors py-2" onClick={() => setMobileOpen(false)}>Modalidades Seguro Garantia</a>
          <a href="/#vantagens" className="block text-white hover:text-fg-gold transition-colors py-2" onClick={() => setMobileOpen(false)}>Vantagens</a>
          <Link to="/seguro-cyber" className="flex items-center gap-2 text-fg-gold font-bold py-2" onClick={() => setMobileOpen(false)}>
            <Shield className="w-4 h-4" /> Seguro Cyber
          </Link>
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="block text-white hover:text-fg-gold transition-colors py-2 font-bold">Blog</a>
          <a href="https://linen-armadillo-993759.hostingersite.com" target="_blank" rel="noopener noreferrer" className="block text-white border border-white/20 px-6 py-3 rounded-full font-medium text-center hover:bg-white/10 transition-all">
            Portal do Corretor
          </a>
          <a href="https://wa.me/5515998618659?text=Ol%C3%A1,%20recebi%20sua%20apresenta%C3%A7%C3%A3o%20e%20gostaria%20de%20conhecer%20melhor%20a%20F%26G." target="_blank" rel="noopener noreferrer" className="block bg-fg-gold text-fg-navy px-6 py-3 rounded-full font-bold text-center">
            Solicitar Cotação
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
