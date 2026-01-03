import React from 'react';
import { Mail, Phone, MapPin, Instagram, Linkedin } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer id="contato" className="bg-fg-navy text-white py-20 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <img src="/logo-text.jpg" alt="F&G Logo" className="h-12 object-contain" />
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Especialistas em Seguro Garantia com foco, personalização e agilidade.
            </p>
            <div className="flex space-x-4">
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-fg-gold hover:border-fg-gold hover:text-fg-navy transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-fg-gold hover:border-fg-gold hover:text-fg-navy transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-fg-gold">Links Rápidos</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
              <li><a href="#quem-somos" className="hover:text-white transition-colors">Quem Somos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seguro Garantia Licitante</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Seguro Garantia Judicial</a></li>
              <li><a href="/blog" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-fg-gold">Contato</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-fg-gold" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-fg-gold" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-fg-gold" />
                <span>{CONTACT_INFO.address.city}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-6 text-fg-gold">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Receba atualizações sobre o mercado de seguros.</p>
            <div className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-fg-gold"
              />
              <button className="bg-fg-gold text-fg-navy px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all">
                Inscrever-se
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:row justify-between items-center text-xs text-slate-500">
          <p>© 2024 F&G Corretora de Seguros. CNPJ:56.123.874/0001-90.Todos os direitos reservados.</p>
          <p className="mt-4 md:mt-0">Desenvolvido com excelência para o mercado securitário.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
