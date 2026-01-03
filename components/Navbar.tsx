
import React, { useState, useEffect } from 'react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-fg-navy py-3 shadow-xl' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <img src="/logo.jpg" alt="F&G Logo" className="w-12 h-12 object-contain" />
          <div className="flex flex-col">
            <span className={`font-bold text-xl leading-none ${isScrolled ? 'text-white' : 'text-white'}`}>F&amp;G</span>
            <span className="text-[10px] uppercase tracking-widest text-fg-gold font-medium">Corretora de Seguros</span>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#inicio" className="text-white hover:text-fg-gold transition-colors">Início</a>
          <a href="#quem-somos" className="text-white hover:text-fg-gold transition-colors">Quem Somos</a>
          <a href="#modalidades" className="text-white hover:text-fg-gold transition-colors">Modalidades</a>
          <a href="#vantagens" className="text-white hover:text-fg-gold transition-colors">Vantagens</a>
          <a href="/blog" target="_blank" rel="noopener noreferrer" className="text-white hover:text-fg-gold transition-colors font-bold">Blog</a>
          <a href="https://feghub.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-white border border-white/20 px-6 py-2 rounded-full font-medium hover:bg-white/10 transition-all">
            Portal do Corretor
          </a>
          <a href="https://wa.me/5515998618659?text=Ol%C3%A1,%20recebi%20sua%20apresenta%C3%A7%C3%A3o%20e%20gostaria%20de%20conhecer%20melhor%20a%20F&G." target="_blank" rel="noopener noreferrer" className="bg-fg-gold text-fg-navy px-6 py-2 rounded-full font-bold hover:bg-opacity-90 transition-all transform hover:scale-105 active:scale-95">
            Solicitar Cotação
          </a>
        </div>

        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
