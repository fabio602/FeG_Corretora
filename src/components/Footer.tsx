import { Link } from 'react-router-dom'
import { WA_URL } from '../data/content'
import { MODALIDADES } from '../data/content'

export default function Footer() {
  return (
    <footer className="bg-fg-navy text-white pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo-transparent.webp" alt="F&G Seguro Garantia" className="h-14 w-auto object-contain" width="160" height="56" />
            </div>
            <p className="text-sm text-blue-200 leading-relaxed">
              Corretora especializada em Seguro Garantia. Autorizada SUSEP. Emissão em até 2 horas. Atendemos todo o Brasil.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest mb-4 text-fg-orange">Modalidades</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              {MODALIDADES.map(m => (
                <li key={m.slug}>
                  <Link to={m.slug} className="hover:text-white transition-colors">{m.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest mb-4 text-fg-orange">Links</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/perguntas-frequentes" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/seguro-cyber" className="hover:text-white transition-colors">Seguro Cyber</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm uppercase tracking-widest mb-4 text-fg-orange">Contato</h3>
            <ul className="space-y-3 text-sm text-blue-200">
              <li>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  (15) 99861-8659
                </a>
              </li>
              <li>
                <a href="mailto:fabio@fegsegurogarantia.com.br" className="hover:text-white transition-colors">
                  fabio@fegsegurogarantia.com.br
                </a>
              </li>
              <li className="text-blue-300">Boituva, SP — Brasil</li>
              <li className="flex gap-3 pt-1">
                <a href="https://www.instagram.com/fg_segurogarantia" target="_blank" rel="noopener noreferrer" aria-label="Instagram F&G" className="hover:text-white transition-colors">Instagram</a>
                <a href="https://www.linkedin.com/in/fabio-lima-30161327/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Fábio Lima" className="hover:text-white transition-colors">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-blue-400">
          <p>© {new Date().getFullYear()} F&G Corretora de Seguros. Todos os direitos reservados.</p>
          <p>SUSEP autorizada · Boituva, SP</p>
        </div>
      </div>
    </footer>
  )
}
