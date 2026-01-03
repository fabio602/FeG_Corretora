
import React from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <section id="modalidades" className="py-32 bg-[#0a0f16] relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-24 reveal">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">Nossas Modalidades</h2>
          <div className="w-24 h-1.5 bg-fg-gold mx-auto mb-10"></div>
          <p className="text-xl text-slate-400 font-light leading-relaxed">
            Oferecemos uma linha completa de Seguro Garantia com a agilidade digital que o mercado moderno exige. 
            Soluções precisas para cada fase do seu contrato.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {SERVICES.map((service, index) => (
            <div 
              key={index} 
              className={`group p-10 glass-card rounded-[2.5rem] transition-all duration-500 hover:bg-white/5 hover:-translate-y-4 reveal`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-20 h-20 bg-fg-gold/10 rounded-3xl flex items-center justify-center text-fg-gold mb-8 group-hover:bg-fg-gold group-hover:text-fg-navy group-hover:rotate-6 transition-all duration-500">
                <div className="scale-125">{service.icon}</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-5 group-hover:text-fg-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-slate-400 text-base leading-relaxed group-hover:text-slate-200 transition-colors mb-10">
                {service.description}
              </p>
              <div className="pt-6 border-t border-white/5 flex items-center text-fg-gold font-bold text-sm cursor-pointer overflow-hidden">
                <span className="relative translate-x-0 group-hover:translate-x-2 transition-transform duration-300">SOLICITAR ANÁLISE</span>
                <svg className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
