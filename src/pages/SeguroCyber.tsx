import { Helmet } from 'react-helmet-async'
import { WA_URL } from '../data/content'
export default function SeguroCyber() {
  return (
    <>
      <Helmet>
        <title>Seguro Cyber | Proteção contra Ataques Digitais | F&G Corretora</title>
        <meta name="description" content="Seguro Cyber para empresas. Proteção contra ataques ransomware, vazamento de dados e interrupção de sistemas. F&G Corretora." />
        <link rel="canonical" href="https://fegsegurogarantia.com.br/seguro-cyber" />
      </Helmet>
      <section className="pt-32 pb-20 bg-fg-bg min-h-screen">
        <div className="container max-w-3xl">
          <span className="inline-block bg-fg-orange/10 text-fg-orange text-xs font-semibold px-3 py-1 rounded-full mb-4">Novo produto</span>
          <h1 className="text-4xl font-extrabold text-fg-navy mb-4">Seguro <span className="text-fg-orange">Cyber</span></h1>
          <p className="text-gray-600 leading-relaxed mb-8">
            Proteção para empresas contra ataques ransomware, vazamento de dados, fraudes digitais e interrupção de operações por incidentes cibernéticos.
          </p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
            Solicitar cotação →
          </a>
        </div>
      </section>
    </>
  )
}
