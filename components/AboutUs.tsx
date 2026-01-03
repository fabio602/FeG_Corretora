
import React from 'react';
import { Award, Briefcase, Handshake } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section id="quem-somos" className="py-24 bg-[#0d141d] overflow-hidden relative">
      <div className="container mx-auto px-6">

        {/* Header Section from Image */}
        <div className="mb-20 text-center max-w-4xl mx-auto reveal">
          <div className="w-20 h-20 mx-auto border-2 border-fg-gold rounded-full flex items-center justify-center mb-6">
            <span className="text-fg-gold font-bold text-2xl">F&G</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif">
            Especialistas em <span className="text-fg-gold">Seguros Garantia</span>
          </h2>
          <p className="text-xl text-slate-400 font-light leading-relaxed">
            Em um mercado cada vez mais exigente, onde confiabilidade e cumprimento contratual são fatores decisivos, contar com uma <strong className="text-white font-bold">corretora especializada</strong> não é apenas uma escolha, e sim uma estratégia competitiva.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="relative reveal-left">
            <div className="grid grid-cols-1 gap-6">
              <img src="/couple-new.jpg" alt="Fábio e Geisa Lima" className="rounded-[3rem] h-[600px] w-full object-cover shadow-2xl border border-white/5" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-fg-gold/10 rounded-full blur-[100px] z-0"></div>
          </div>

          <div className="space-y-8 reveal-right">
            <h3 className="text-3xl md:text-5xl font-bold text-white leading-tight font-serif">
              Conheça <br /> <span className="text-fg-gold">Fábio Lima & Geisa Lima</span>
            </h3>

            <div className="space-y-6 text-slate-300 font-light text-lg leading-relaxed text-justify">
              <p>
                Somos <strong className="text-white">Fábio e Geisa Lima</strong>, profissionais dedicados a entregar uma consultoria técnica e personalizada em Seguro Garantia. Nosso trabalho é garantir que cada contrato — público ou privado — esteja amparado por análise criteriosa, orientação especializada e total segurança.
              </p>
              <p>
                Transformamos complexidade em clareza. Cuidamos de cada etapa do processo para que você tome decisões com confiança, amparado pelo conhecimento, pela responsabilidade e pela experiência de corretores habilitados.
              </p>
              <p className="border-l-4 border-fg-gold pl-6 py-2 italic text-white bg-white/5 rounded-r-lg">
                "Nosso compromisso é simples e sólido: <strong className="text-fg-gold">proteger o seu negócio</strong>, fortalecer sua credibilidade e assegurar que cada operação seja conduzida com excelência, transparência e segurança jurídica."
              </p>
            </div>
          </div>
        </div>

        {/* Specialization Section */}
        <div className="bg-gradient-to-br from-fg-navy to-[#0a0f16] rounded-[3rem] p-10 md:p-16 border border-white/5 relative overflow-hidden reveal">
          <div className="absolute top-0 right-0 w-2/3 h-full bg-fg-gold/5 transform skew-x-12 translate-x-20 pointer-events-none"></div>

          <div className="grid md:grid-cols-12 gap-12 items-center relative z-10">
            <div className="md:col-span-8 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-white font-serif">
                Nossa especialização: Seguro Garantia como <span className="text-fg-gold">foco</span>, não como complemento
              </h3>
              <div className="w-20 h-1 bg-fg-gold"></div>
              <p className="text-lg text-slate-400 leading-relaxed">
                Enquanto muitas corretoras tratam o Seguro Garantia como um produto adicional, na <strong className="text-white">F&G</strong> ele é o centro da nossa operação.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                Nosso compromisso é garantir que cada contratação seja pensada para reduzir riscos, preservar o seu caixa e elevar sua credibilidade.
              </p>
            </div>
            <div className="md:col-span-4 flex justify-center">
              <Award className="w-32 h-32 text-fg-gold opacity-80" strokeWidth={1} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
