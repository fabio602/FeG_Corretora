import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { WA_NUMBER, AVALIACOES_DESTAQUE, GOOGLE_REVIEWS_URL } from '../data/content'

// Modelo novo das páginas de modalidade, com a mesma estrutura da /lp/licitante/:
// promessa e botão no topo, prova, passos, quem atende, avaliações, perguntas e convite final.
// Usado quando a modalidade tem o campo `pagina` em src/data/content.ts.

type Passo = { titulo: string; texto: string }
type Pergunta = { q: string; a: string }
export type PaginaModalidade = {
  sobretitulo: string
  titulo: string
  tituloDestaque: string
  subtitulo: string
  waTexto: string
  ctaPrimario: string
  formularioHref: string
  tituloBeneficios: string
  beneficios?: string[]   // quando ausente, usa os benefits da modalidade
  prazo?: { valor: string; frase: string }   // padrão: até 2h / Emissão em até 2 horas.
  passos: Passo[]
  faq: Pergunta[]
  ctaFinal: string
}
type Mod = {
  title: string
  slug: string
  seoTitle: string
  seoDesc: string
  benefits: string[]
  pagina: PaginaModalidade
}

const RESSALVA = '* Prazo após o recebimento dos documentos, sujeito à análise e aceitação da seguradora.'

function Estrelas() {
  return <span className="text-amber-500 tracking-wider" aria-label="5 estrelas">★★★★★</span>
}

export default function ModalidadeNova({ mod }: { mod: Mod }) {
  const p = mod.pagina
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const beneficios = p.beneficios ?? mod.benefits
  const prazo = p.prazo ?? { valor: 'até 2h', frase: 'Emissão em até 2 horas.' }
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(p.waTexto)}`
  const url = `https://fegsegurogarantia.com.br${mod.slug}`

  const BotaoWhatsApp = ({ texto, claro = false }: { texto: string; claro?: boolean }) => (
    <a href={waHref} target="_blank" rel="noopener noreferrer"
      className={`inline-flex items-center justify-center min-h-[48px] px-6 py-3 font-bold rounded-lg transition-colors text-center ${claro ? 'bg-white text-fg-navy hover:bg-gray-100' : 'bg-fg-orange text-white hover:bg-orange-700'}`}>
      {texto}
    </a>
  )

  return (
    <>
      <Helmet>
        <title>{mod.seoTitle}</title>
        <meta name="description" content={mod.seoDesc} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={mod.seoTitle} />
        <meta property="og:description" content={mod.seoDesc} />
        <meta property="og:url" content={url} />
      </Helmet>

      {/* HERO: promessa, botão e prova sem rolar */}
      <section className="pt-28 md:pt-32 pb-14 bg-fg-bg">
        <div className="container grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-5">
              <Link to="/">Home</Link> › <Link to="/#modalidades">Modalidades</Link> › <span>{mod.title}</span>
            </nav>
            <span className="inline-block bg-fg-orange/10 text-fg-orange text-xs font-semibold px-3 py-1 rounded-full mb-4">{p.sobretitulo}</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-fg-navy leading-tight mb-5">
              {p.titulo} <span className="text-fg-orange">{p.tituloDestaque}</span>
            </h1>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8 max-w-2xl">{p.subtitulo}</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <BotaoWhatsApp texto={p.ctaPrimario} />
              <a href={p.formularioHref}
                className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 font-semibold rounded-lg border-2 border-fg-navy text-fg-navy hover:bg-fg-navy hover:text-white transition-colors text-center">
                Prefiro preencher um formulário
              </a>
            </div>
            <p className="text-sm text-gray-600">Quem responde é o Fábio, corretor dedicado a Seguro Garantia.</p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <dl className="grid grid-cols-2 gap-6">
                <div className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-500">para emitir a apólice*</dt>
                  <dd className="text-3xl font-extrabold text-fg-navy">{prazo.valor}</dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-500">seguradoras parceiras</dt>
                  <dd className="text-3xl font-extrabold text-fg-navy">25+</dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-500">avaliações no Google</dt>
                  <dd className="text-3xl font-extrabold text-fg-navy">5,0 <span className="text-amber-500 text-2xl">★</span></dd>
                </div>
                <div className="flex flex-col-reverse">
                  <dt className="text-xs text-gray-500">registro SUSEP</dt>
                  <dd className="text-xl font-extrabold text-fg-navy mt-2">242160653</dd>
                </div>
              </dl>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed">{RESSALVA}</p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-14 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-8">{p.tituloBeneficios}</h2>
          <div className={`grid sm:grid-cols-2 gap-4 ${beneficios.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
            {beneficios.map(b => (
              <div key={b} className="flex items-start gap-3 bg-fg-bg rounded-xl p-5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E8572A" strokeWidth="2.5" className="mt-0.5 shrink-0" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-sm md:text-base text-gray-800">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-14 bg-fg-bg">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-8">Três passos, tudo digital</h2>
          <ol className="grid md:grid-cols-3 gap-6">
            {p.passos.map((s, i) => (
              <li key={s.titulo} className="bg-white rounded-2xl p-6 shadow-sm">
                <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-fg-navy text-white font-bold mb-4">{i + 1}</span>
                <h3 className="font-bold text-fg-navy text-lg mb-2">{s.titulo}</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{s.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* QUEM VAI TE ATENDER */}
      <section className="py-14 bg-white">
        <div className="container grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-4">
            <img src="/lp/fabio-atendimento.webp" width={533} height={799} loading="lazy" decoding="async"
              alt="Fábio Lima, corretor da F&G Seguro Garantia" className="w-full max-w-sm mx-auto rounded-2xl object-cover" />
          </div>
          <div className="md:col-span-8">
            <p className="text-xs font-semibold text-fg-orange uppercase tracking-wide mb-2">Quem vai te atender</p>
            <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-4">Fábio Lima</h2>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Administrador de formação e corretor dedicado exclusivamente a Seguro Garantia. Acompanho pessoalmente cada apólice, da leitura do documento até a entrega.
            </p>
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              Trabalho com um painel de mais de 25 seguradoras. Na prática, isso significa buscar a taxa e o limite certos para a sua empresa, em vez de encaixar você no produto de uma única companhia.
            </p>
            <BotaoWhatsApp texto="Falar direto comigo" />
          </div>
        </div>
      </section>

      {/* AVALIAÇÕES */}
      <section className="py-14 bg-fg-bg">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold text-fg-orange uppercase tracking-wide mb-2">Avaliações</p>
              <h2 className="text-2xl md:text-3xl font-bold text-fg-navy">5,0 no Google <Estrelas /></h2>
            </div>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="text-fg-orange font-semibold text-sm hover:underline">
              Ver todas no Google →
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {AVALIACOES_DESTAQUE.map(r => (
              <figure key={r.nome} className="bg-white rounded-2xl p-6 shadow-sm">
                <Estrelas />
                <blockquote className="text-sm text-gray-700 leading-relaxed mt-3 mb-4">“{r.texto}”</blockquote>
                <figcaption className="text-xs text-gray-500">{r.nome} · Google</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* PERGUNTAS FREQUENTES */}
      <section className="py-14 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-fg-navy mb-2">Perguntas frequentes</h2>
          <p className="text-sm text-gray-600 mb-8">Não achou sua dúvida? Me chama no WhatsApp.</p>
          <div className="grid lg:grid-cols-2 gap-3 items-start">
            {p.faq.map((item, i) => (
              <div key={item.q} className="border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center font-medium text-fg-navy text-sm md:text-base min-h-[48px]"
                  aria-expanded={openFaq === i}>
                  {item.q}
                  <span className="ml-4 text-fg-orange text-lg leading-none" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div hidden={openFaq !== i} className="px-5 pb-4 text-sm text-gray-700 leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link to="/perguntas-frequentes/" className="text-fg-orange font-semibold text-sm hover:underline">
              Ver todas as perguntas →
            </Link>
          </div>
        </div>
      </section>

      {/* CONVITE FINAL */}
      <section className="py-16 bg-fg-navy text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{p.ctaFinal}</h2>
          <p className="text-blue-200 mb-8 text-sm">{RESSALVA.replace('* ', prazo.frase + ' ')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <BotaoWhatsApp texto={p.ctaPrimario} claro />
            <a href={p.formularioHref}
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 font-semibold rounded-lg border-2 border-white text-white hover:bg-white hover:text-fg-navy transition-colors">
              Prefiro preencher um formulário
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
