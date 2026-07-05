import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MODALIDADES, WA_URL, FAQ } from '../data/content'

export default function Modalidade() {
  const { slug } = useParams<{ slug: string }>()
  const mod = MODALIDADES.find(m => m.slug === `/${slug}`)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  if (!mod) return (
    <div className="pt-32 pb-20 text-center">
      <h1 className="text-2xl font-bold text-fg-navy">Página não encontrada</h1>
      <Link to="/" className="text-fg-orange mt-4 inline-block">← Voltar para home</Link>
    </div>
  )

  return (
    <>
      <Helmet>
        <title>{mod.seoTitle}</title>
        <meta name="description" content={mod.seoDesc} />
        <link rel="canonical" href={`https://fegsegurogarantia.com.br${mod.slug}`} />
        <meta property="og:title" content={mod.seoTitle} />
        <meta property="og:description" content={mod.seoDesc} />
        <meta property="og:url" content={`https://fegsegurogarantia.com.br${mod.slug}`} />
      </Helmet>

      {/* HERO */}
      <section className="pt-32 pb-16 bg-fg-bg">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400 mb-6">
            <Link to="/">Home</Link> › <Link to="/#modalidades">Modalidades</Link> › <span>{mod.title}</span>
          </nav>
          <span className="inline-block bg-fg-orange/10 text-fg-orange text-xs font-semibold px-3 py-1 rounded-full mb-4">{mod.badge}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-fg-navy leading-tight mb-4">
            {mod.heading} <span className="text-fg-orange">{mod.headingHighlight}</span>
          </h1>
          <p className="text-base text-gray-600 leading-relaxed mb-8">{mod.fullDesc}</p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
            Solicitar análise gratuita →
          </a>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-fg-navy mb-8">Por que escolher o Seguro Garantia?</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {mod.benefits.map(b => (
              <div key={b} className="flex items-start gap-3 bg-fg-bg rounded-xl p-4">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8572A" strokeWidth="2.5" className="mt-0.5 shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-sm text-gray-700">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 bg-fg-bg">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-fg-navy mb-8">Como funciona</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {mod.steps.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-3" aria-hidden="true">{s.icon}</div>
                <h3 className="font-bold text-fg-navy text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-fg-navy mb-8">Perguntas frequentes</h2>
          <div className="space-y-3">
            {FAQ.slice(0, 5).map((item, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center font-medium text-fg-navy text-sm"
                  aria-expanded={openFaq === i}>
                  {item.q}
                  <span className="ml-4 text-fg-orange text-lg leading-none">{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/perguntas-frequentes" className="text-fg-orange font-semibold text-sm hover:underline">
              Ver todas as perguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-fg-navy text-white text-center">
        <div className="container max-w-xl">
          <h2 className="text-2xl font-bold mb-3">Pronto para emitir sua apólice?</h2>
          <p className="text-blue-200 mb-6 text-sm">Análise gratuita. Resposta em minutos pelo WhatsApp.</p>
          <a href={WA_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-600 transition-colors">
            Falar pelo WhatsApp →
          </a>
        </div>
      </section>
    </>
  )
}
