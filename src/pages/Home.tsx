import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MODALIDADES, PARTNERS, WA_URL, FORM_EMAIL } from '../data/content'

const STATS = [
  { value: '2h', label: 'Para emitir a apólice' },
  { value: '25+', label: 'Seguradoras parceiras' },
  { value: 'R$150', label: 'A partir, Seg. Licitante' },
  { value: '100%', label: 'Atendimento digital' },
]

const REVIEWS = [
  { name: 'I.C Licitação', rating: 5, text: 'Tive uma excelente experiência! O Fábio foi extremamente prestativo, educado e disposto a ajudar. Emissão do seguro rápida e eficiente!', color: '#1C3A5E' },
  { name: 'Monique Barros', rating: 5, text: 'São profissionais que transmitem confiança, atenção e transparência em cada atendimento. Recomendo de coração pelo profissionalismo e dedicação.', color: '#E8572A' },
  { name: 'Edílson Lobo', rating: 5, text: 'Ótima experiência. Atendimento muito atencioso, consultivo, diversos esclarecimentos, soluções rápidas contemplando os prazos apertados do segmento.', color: '#2563EB' },
  { name: 'Renata Nadur', rating: 5, text: 'Super atenciosos e na hora do aperto eles tentam fazer tudo pelos clientes. Excelente trabalho.', color: '#7C3AED' },
  { name: 'Adilson Hanauer', rating: 5, text: 'Empresa ágil e comprometida. Recomendo.', color: '#059669' },
]


function ContactForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'ok'|'err'>('idle')
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ ...form, _subject: 'Novo contato — F&G Seguro Garantia' }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch { setStatus('err') }
  }

  if (status === 'ok') return (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">✅</div>
      <h3 className="text-xl font-bold text-fg-navy mb-2">Mensagem enviada!</h3>
      <p className="text-gray-600">Retornamos em até 2 horas pelo WhatsApp ou e-mail.</p>
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
          <input id="name" type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fg-navy" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
          <input id="email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fg-navy" />
        </div>
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
        <input id="phone" type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fg-navy" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem *</label>
        <textarea id="message" required rows={4} value={form.message} onChange={e => setForm({...form, message: e.target.value})}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-fg-navy resize-none" />
      </div>
      <button type="submit" disabled={status === 'sending'}
        className="w-full py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-60">
        {status === 'sending' ? 'Enviando...' : 'Enviar mensagem'}
      </button>
      {status === 'err' && <p className="text-red-600 text-sm text-center">Erro ao enviar. Tente pelo WhatsApp.</p>}
    </form>
  )
}

export default function Home() {
  const [reviewIdx, setReviewIdx] = useState(0)

  return (
    <>
      <Helmet>
        <title>Seguro Garantia | Emissão em até 2h | F&G Corretora — Boituva SP</title>
        <meta name="description" content="Corretora especializada em Seguro Garantia para licitações e contratos. Analisamos o edital e emitimos a apólice em até 2 horas. Boituva, SP — atendemos todo o Brasil." />
        <link rel="canonical" href="https://fegsegurogarantia.com.br/" />
        <meta property="og:title" content="Seguro Garantia | Emissão em até 2h | F&G Corretora" />
        <meta property="og:description" content="Corretora especializada em Seguro Garantia. Emissão em até 2 horas. Atendemos todo o Brasil." />
        <meta property="og:url" content="https://fegsegurogarantia.com.br/" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* HERO */}
      <section className="bg-fg-bg pt-28 pb-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-semibold text-gray-700 mb-5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8572A" strokeWidth="2.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                Autorizado SUSEP · Emissão em até 2h
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-fg-navy leading-tight mb-4">
                Seguro Garantia para quem não pode perder prazo nem{' '}
                <span className="text-fg-orange italic" style={{fontFamily:'Georgia,serif'}}>travar caixa</span>
              </h1>
              <p className="text-base text-gray-600 leading-relaxed mb-7 max-w-lg">
                Analisamos o edital ou contrato, estruturamos o Seguro Garantia e emitimos a apólice em até 2 horas. Licitações, execução de contratos, processos judiciais e locações em todo o Brasil.
              </p>
              <div className="flex gap-3 flex-wrap mb-4">
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  Solicitar análise gratuita
                </a>
                <a href="#como-funciona"
                  onClick={e => { e.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({behavior:'smooth'}) }}
                  className="inline-block px-6 py-3 border-2 border-fg-navy text-fg-navy font-bold rounded-lg hover:bg-fg-navy hover:text-white transition-all">
                  Como funciona
                </a>
              </div>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Resposta em minutos pelo WhatsApp
              </a>
            </div>

            {/* Card apólice */}
            <div className="relative">
              <div className="absolute inset-0 -m-8 bg-gradient-to-br from-orange-50 to-blue-50 rounded-full blur-2xl opacity-60 pointer-events-none" aria-hidden="true" />
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full mb-6">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                  Emitida
                </span>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Modalidade</p>
                <p className="text-sm font-medium text-gray-700 mb-6">Executante Construtor</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Valor segurado</p>
                <p className="text-4xl font-extrabold text-fg-navy mb-7 tracking-tight">
                  R$ 250.000<span className="text-2xl font-bold">,00</span>
                </p>
                <div className="border-t pt-4 flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-sm text-gray-400">Emitida em <strong className="text-fg-orange font-semibold">1h47min</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {STATS.map(s => (
              <div key={s.value} className="bg-white border border-gray-100 rounded-xl p-5 text-center">
                <div className="text-3xl font-extrabold text-fg-navy">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODALIDADES */}
      <section id="modalidades" className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-fg-orange uppercase tracking-widest">O que fazemos</span>
            <h2 className="text-3xl font-extrabold text-fg-navy mt-2">Modalidades de Seguro Garantia</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODALIDADES.map(m => (
              <Link key={m.slug} to={m.slug}
                className="group bg-fg-bg border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="text-3xl mb-3" aria-hidden="true">{m.icon}</div>
                <h3 className="text-base font-bold text-fg-navy mb-2">{m.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{m.desc}</p>
                <span className="text-sm font-semibold text-fg-orange group-hover:underline">Saiba mais →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-fg-bg">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold text-fg-orange uppercase tracking-widest">Processo</span>
            <h2 className="text-3xl font-extrabold text-fg-navy mt-2">Como funciona</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { n: '1', title: 'Analisamos a exigência', desc: 'Identificamos o tipo de Seguro Garantia necessário, o valor e o prazo da apólice conforme a lei.' },
              { n: '2', title: 'Cotamos com 25+ seguradoras', desc: 'Buscamos a melhor taxa entre nossas seguradoras parceiras para o seu perfil e contrato.' },
              { n: '3', title: 'Apólice em até 2 horas', desc: 'Emissão expressa para você não perder prazo. Enviamos por e-mail e WhatsApp.' },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-fg-navy text-white font-extrabold text-lg flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-bold text-fg-navy mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS NAVY */}
      <section className="py-16 bg-fg-navy">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            {[
              { value: '2h', label: 'Tempo médio de emissão' },
              { value: '25+', label: 'Seguradoras parceiras para melhor taxa' },
              { value: '100%', label: 'Atendimento digital em todo o Brasil' },
            ].map(s => (
              <div key={s.value}>
                <div className="text-5xl font-bold mb-2">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="py-20 bg-white">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-fg-orange uppercase tracking-widest">Avaliações</span>
            <h2 className="text-3xl font-extrabold text-fg-navy mt-2">O que nossos clientes dizem</h2>
            <div className="flex justify-center items-center gap-2 mt-2">
              <span className="text-yellow-400 text-lg">★★★★★</span>
              <span className="text-sm text-gray-500">5.0 no Google</span>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${reviewIdx * 100}%)` }}>
              {REVIEWS.map(r => (
                <div key={r.name} className="min-w-full px-4">
                  <div className="bg-fg-bg rounded-2xl p-8 text-center">
                    <div className="w-12 h-12 rounded-full text-white font-bold text-lg flex items-center justify-center mx-auto mb-4"
                      style={{ background: r.color }}>{r.name[0]}</div>
                    <p className="font-bold text-fg-navy mb-1">{r.name}</p>
                    <p className="text-yellow-400 text-sm mb-3">★★★★★</p>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">"{r.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-6">
            {REVIEWS.map((_, i) => (
              <button key={i} onClick={() => setReviewIdx(i)} aria-label={`Ver avaliação ${i+1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === reviewIdx ? 'bg-fg-orange' : 'bg-gray-300'}`} />
            ))}
          </div>
          <div className="text-center mt-6">
            <a href="https://share.google/AtTRA9nk7u7cOrOaa" target="_blank" rel="noopener noreferrer"
              className="text-sm text-fg-orange font-semibold hover:underline">Ver no Google Maps →</a>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section className="py-20 bg-fg-bg">
        <div className="container max-w-3xl text-center">
          <span className="text-xs font-semibold text-fg-orange uppercase tracking-widest">Quem somos</span>
          <h2 className="text-3xl font-extrabold text-fg-navy mt-2 mb-6">Fábio & Geisa Lima</h2>
          <img src="/couple-new.webp" alt="Fábio e Geisa Lima, fundadores da F&G Corretora de Seguro Garantia"
            className="rounded-2xl mx-auto mb-6 max-w-md w-full" width="640" height="480" loading="lazy" />
          <p className="text-gray-600 leading-relaxed">
            Fundadores da F&G Corretora, especializados exclusivamente em Seguro Garantia. Mais de 10 anos atendendo empresas em licitações, contratos públicos e processos judiciais em todo o Brasil.
          </p>
        </div>
      </section>

      {/* PARCEIROS */}
      <section className="py-12 bg-white overflow-hidden">
        <div className="container mb-6 text-center">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Seguradoras parceiras</span>
        </div>
        <div className="flex gap-12 animate-[scroll_20s_linear_infinite] w-max items-center px-8">
          {[...PARTNERS, ...PARTNERS].map((p, i) => (
            <img key={i} src={p.src} alt={p.name} title={p.name}
              className="h-10 w-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all"
              width="120" height="40" loading="lazy" />
          ))}
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-20 bg-fg-bg">
        <div className="container max-w-xl">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-fg-orange uppercase tracking-widest">Fale conosco</span>
            <h2 className="text-3xl font-extrabold text-fg-navy mt-2">Solicitar análise gratuita</h2>
            <p className="text-gray-500 mt-2 text-sm">Respondemos em até 2 horas pelo WhatsApp ou e-mail.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  )
}
