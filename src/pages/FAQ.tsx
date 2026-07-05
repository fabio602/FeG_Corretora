import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { FAQ as FAQS } from '../data/content'

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <>
      <Helmet>
        <title>Perguntas Frequentes sobre Seguro Garantia | F&G Corretora</title>
        <meta name="description" content="Tire suas dúvidas sobre Seguro Garantia, prazos, documentos, custos e como funciona a emissão. F&G Corretora — Boituva SP." />
        <link rel="canonical" href="https://fegsegurogarantia.com.br/perguntas-frequentes" />
      </Helmet>
      <section className="pt-32 pb-20 bg-fg-bg min-h-screen">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-extrabold text-fg-navy mb-2">Perguntas Frequentes</h1>
          <p className="text-gray-500 mb-10">Tudo sobre Seguro Garantia em um só lugar.</p>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}
                  className="w-full text-left px-5 py-4 flex justify-between items-center font-medium text-fg-navy text-sm">
                  {item.q}
                  <span className="ml-4 text-fg-orange text-xl leading-none shrink-0">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
