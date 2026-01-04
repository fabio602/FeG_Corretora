
import React, { useState, useEffect } from 'react';
import { Shield, Clock, TrendingUp, ChevronRight } from 'lucide-react';

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

 const heroImages = [
    "/hero/hero-office.jpg",
    "/hero/hero-justice.jpg",
    "/hero/hero-construction.jpg",
    "/hero/hero-cranes.jpg",
    "/hero/hero-handshake.jpg",
    "/hero/hero-blueprint.jpg",
    "/hero/hero-bridge.jpg",
    "/hero/hero-calc.jpg",
    "/hero/hero-welder.jpg",
    "/hero/hero-cleaner.jpg"
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0f16] pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 bg-grid opacity-20"></div>
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-fg-gold/10 rounded-full blur-[120px] transition-transform duration-500"
        style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">

          {/* Left Column: Typography & Action */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full glass-card border-white/5 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fg-gold"></span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-fg-gold">EMITA AGORA SUA GARANTIA!</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-bold text-white leading-[1] tracking-tight">
              A Garantia que <br />
              <span className="relative inline-block mt-2">
                <span className="text-fg-gold italic font-serif">Liberta</span>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-fg-gold to-transparent opacity-50"></div>
              </span>
              <br />
              seu Capital
            </h1>

            <p className="text-xl text-slate-400 max-w-xl leading-relaxed font-light">
              Transforme obrigações em oportunidades. O Seguro Garantia da F&G preserva seu fluxo de caixa enquanto assegura conformidade total em licitações e contratos.
            </p>

            <div className="flex flex-wrap gap-6 pt-6">
              <a
                href="https://wa.me/5515998618659?text=Ol%C3%A1,%20recebi%20sua%20apresenta%C3%A7%C3%A3o%20e%20gostaria%20de%20conhecer%20melhor%20a%20F&G."
                target="_blank"
                rel="noopener noreferrer"
                className="relative group bg-fg-gold text-fg-navy px-10 py-5 rounded-lg font-bold text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 block text-center"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                Solicitar Cotação Agora!
              </a>
            </div>

            <div className="pt-12 flex items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest border-r border-white/10 pr-12">Garantias Públicas</span>
              <div className="text-xl font-bold text-white tracking-tighter">Garantias Privadas</div>
              <div className="text-xl font-bold text-white tracking-tighter">AUTORIZADO SUSEP</div>
            </div>
          </div>

          {/* Right Column: Visual Composition */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div
              className="relative transition-transform duration-300 ease-out"
              style={{ transform: `perspective(1000px) rotateY(${mousePos.x * 0.2}deg) rotateX(${-mousePos.y * 0.2}deg)` }}
            >
              {/* Main Image Frame */}
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-fg-navy/50 h-[600px]">
                {heroImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Slide ${index + 1}`}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-2000 ${currentImageIndex === index ? 'opacity-80' : 'opacity-0'
                      }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-transparent to-transparent"></div>
              </div>

              {/* Floating Glass Cards */}
              <div className="absolute -top-6 -right-6 glass-card p-6 rounded-2xl w-48 animate-float-slow">
                <div className="w-10 h-10 bg-fg-gold/20 rounded-lg flex items-center justify-center text-fg-gold mb-3">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold text-white">2 Horas</div>
                <div className="text-[10px] text-slate-300 uppercase font-bold tracking-widest">Para Emissão</div>
              </div>

              <div className="absolute top-1/2 -left-12 glass-card p-6 rounded-2xl w-56 animate-float-slow [animation-delay:2s]">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center text-green-500 mb-3">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div className="text-lg font-bold text-white">Apólices Licitante</div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Á partir de R$150</div>
              </div>

              <div className="absolute bottom-8 right-8 glass-card p-4 rounded-xl flex items-center gap-4 border-l-4 border-l-fg-gold animate-float-slow [animation-delay:4s]">
                <Shield className="w-8 h-8 text-fg-gold" />
                <div>
                  <div className="text-white font-bold text-sm">+ 1.5m</div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Capital Liberado</div>
                </div>
              </div>
            </div>

            {/* Background glowing circle */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-fg-gold/20 rounded-full blur-[100px] z-[-1]"></div>
          </div>

        </div>
      </div>

      {/* Vertical Navigation / Indicator */}
      <div className="absolute left-10 bottom-10 hidden md:flex flex-col items-center gap-6">
        <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-fg-gold"></div>
        <div className="text-[10px] text-white/40 uppercase tracking-[0.4em] transform rotate-180 flex items-center" style={{ writingMode: 'vertical-rl' }}>
          Explore o Futuro das Garantias
        </div>
      </div>
    </section>
  );
};

export default Hero;
