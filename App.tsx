
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Stats from './components/Stats';
import AboutUs from './components/AboutUs';
import HowItWorks from './components/HowItWorks';
import GeminiAssistant from './components/GeminiAssistant';
import Footer from './components/Footer';
import InsurersCarousel from './components/InsurersCarousel';
import Blog from './components/Blog';

function App() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0f16] overflow-x-hidden">
      <Navbar />

      <Routes>
        <Route path="/" element={
          <main>
            <Hero />

            {/* Trusted By Section */}
            <section className="py-16 bg-[#0d141d] border-b border-white/5 relative z-10 reveal overflow-hidden">
              <div className="container mx-auto px-6 mb-12">
                <p className="text-center text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
                  Segurança validada por líderes do mercado
                </p>
              </div>
              <InsurersCarousel />
            </section>

            <div className="reveal">
              <AboutUs />
            </div>

            <div className="reveal">
              <HowItWorks />
            </div>

            <div className="reveal">
              <Services />
            </div>

            <div className="reveal">
              <Stats />
            </div>

            {/* Call to Action Section with Slide-in */}
            <section className="py-32 bg-[#0a0f16] overflow-hidden relative border-y border-white/5">
              <div className="absolute top-0 right-0 w-1/3 h-full bg-fg-gold opacity-5 transform skew-x-12 translate-x-20"></div>

              <div className="container mx-auto px-6 relative z-10 reveal">
                <div className="glass-card rounded-[4rem] p-12 lg:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 shadow-2xl border-white/5">
                  <div className="text-center lg:text-left space-y-8 max-w-2xl reveal-left">
                    <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                      Sua próxima <span className="text-fg-gold italic font-serif">Vitória</span> começa com uma garantia sólida
                    </h2>
                    <p className="text-slate-400 text-2xl font-light">
                      Análise técnica gratuita em tempo real. Nossa equipe está online para atender sua demanda.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6 reveal-right w-full lg:w-auto">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
                      <form action="https://formsubmit.co/fabio@fegsegurogarantia.com.br" method="POST" className="space-y-4 text-left">
                        <input type="hidden" name="_subject" value="Nova Solicitação de Proposta (Site F&G)" />
                        <input type="hidden" name="_captcha" value="false" />
                        <input type="hidden" name="_template" value="table" />

                        <div>
                          <label htmlFor="form-name" className="block text-sm font-bold text-gray-700 mb-1">Nome</label>
                          <input id="form-name" name="name" type="text" placeholder="Digite seu nome completo" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-fg-navy focus:border-transparent outline-none transition-all placeholder:text-gray-400" />
                        </div>
                        <div>
                          <label htmlFor="form-email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                          <input id="form-email" name="email" type="email" placeholder="Ex: raquel@exemplo.com" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-fg-navy focus:border-transparent outline-none transition-all placeholder:text-gray-400" />
                        </div>
                        <div>
                          <label htmlFor="form-phone" className="block text-sm font-bold text-gray-700 mb-1">Telefone</label>
                          <input id="form-phone" name="phone" type="tel" placeholder="Ex: (99) 99999-9999" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:ring-2 focus:ring-fg-navy focus:border-transparent outline-none transition-all placeholder:text-gray-400" />
                        </div>
                        <button type="submit" className="w-full bg-fg-navy text-white font-bold py-4 rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg mt-2">
                          Solicitar proposta agora
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Final Value Section */}
            <section id="vantagens" className="py-32 bg-[#0a0f16]">
              <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-24 items-center">
                  <div className="space-y-10 reveal-left">
                    <div className="w-16 h-1 bg-fg-gold"></div>
                    <h2 className="text-5xl font-bold text-white leading-tight">Inovação que gera <br /><span className="text-fg-gold">Liquidez</span> imediata</h2>
                    <p className="text-xl text-slate-400 leading-relaxed font-light">
                      Diferente de bancos que bloqueiam seus limites de crédito, a F&G utiliza o Seguro Garantia para alavancar sua capacidade de investimento sem comprometer seu balanço.
                    </p>
                    <div className="space-y-6">
                      {[
                        { title: "Atendimento Humanizado", desc: "Na F&G você terá a sua disposição atendimento personalizado e imediato." },
                        { title: "Inteligência em Editais & Contratos", desc: "Análise de exigências técnicas para encaixar as melhores opções de garantia." },
                        { title: "Segurança Jurídica", desc: "Trabalhamos com as maiores seguradoras do mercado." }
                      ].map((item, idx) => (
                        <div key={idx} className="flex gap-6 p-6 rounded-3xl glass-card border-white/5 group hover:border-fg-gold/40 transition-all">
                          <div className="w-8 h-8 rounded-full bg-fg-gold/20 flex items-center justify-center flex-shrink-0 mt-1">
                            <div className="w-3 h-3 bg-fg-gold rounded-full group-hover:scale-150 transition-transform"></div>
                          </div>
                          <div>
                            <h4 className="font-bold text-white text-xl">{item.title}</h4>
                            <p className="text-base text-slate-400 mt-2">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative group reveal-right">
                    <div className="absolute -inset-10 bg-fg-gold/5 rounded-full blur-[120px] group-hover:bg-fg-gold/10 transition duration-1000"></div>
                    <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border border-white/10">
                      <img
                        src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop"
                        alt="Processo de Assinatura"
                        className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 scale-110 group-hover:scale-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f16] via-transparent to-transparent opacity-80"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        } />
        <Route path="/blog" element={<Blog />} />
      </Routes>

      <Footer />
      <GeminiAssistant />
    </div>
  );
}

export default App;
