
import React from 'react';
import { Search, FileText, CheckCircle, Shield } from 'lucide-react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Search className="w-10 h-10" />,
      title: "Análise Técnica",
      description: "Identificamos as exigências do edital para entendermos sua necessidade."
    },
    {
      icon: <FileText className="w-10 h-10" />,
      title: "Orçamento Consultivo",
      description: "Buscamos as melhores opções de seguros nas seguradoras para garantir as melhores taxas do mercado."
    },
    {
      icon: <CheckCircle className="w-10 h-10" />,
      title: "Emissão Digital",
      description: "Apólice emitida em minutos validada na SUSEP com garantia legal perante qualquer órgão público."
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: "Gestão Ativa",
      description: "Monitoramento de vigência e renovações automáticas para manter sua empresa sempre protegida."
    }
  ];

  return (
    <section className="py-32 bg-[#0a0f16] relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-24 reveal">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">Ciclo de Garantia</h2>
          <div className="w-24 h-1.5 bg-fg-gold mx-auto mb-10"></div>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            Velocidade é nossa prioridade. Criamos um fluxo 100% otimizado para que sua empresa não perca prazos em licitações.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-12 relative">
          {/* Connector line for desktop with animated gradient */}
          <div className="hidden md:block absolute top-[40px] left-0 w-full h-[2px] bg-white/5 z-0">
            <div className="h-full bg-gradient-to-r from-transparent via-fg-gold to-transparent w-full animate-shimmer"></div>
          </div>

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center group reveal"
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div className="w-24 h-24 bg-[#0d141d] border border-white/10 rounded-[2rem] flex items-center justify-center text-white mb-8 group-hover:border-fg-gold group-hover:shadow-[0_0_30px_rgba(226,180,154,0.1)] transition-all duration-500 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-fg-gold text-fg-navy text-xs font-black rounded-xl flex items-center justify-center shadow-lg">
                  {idx + 1}
                </div>
                <div className="group-hover:scale-110 group-hover:text-fg-gold transition-all duration-500">
                  {step.icon}
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-fg-gold transition-colors">{step.title}</h4>
              <p className="text-slate-400 text-base leading-relaxed font-light">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
