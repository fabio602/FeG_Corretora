import { useState, useEffect, useCallback, useRef } from 'react'
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
  { name: 'I.C Licitação',   initials: 'IC', rating: 5, time: 'há 2 semanas', text: 'Tive uma excelente experiência! O Fábio foi extremamente prestativo, educado e disposto a ajudar. Emissão do seguro rápida e eficiente!', color: '#1C3A5E' },
  { name: 'Monique Barros',  initials: 'MB', rating: 5, time: 'há 2 semanas', text: 'São profissionais que transmitem confiança, atenção e transparência em cada atendimento. Recomendo de coração pelo profissionalismo e dedicação.', color: '#E8572A' },
  { name: 'Edílson Lobo',    initials: 'EL', rating: 5, time: 'há 2 semanas', text: 'Ótima experiência. Atendimento muito atencioso, consultivo, diversos esclarecimentos, soluções rápidas contemplando os prazos apertados do segmento.', color: '#2563EB' },
  { name: 'Renata Nadur',    initials: 'RN', rating: 5, time: 'há 2 semanas', text: 'Super atenciosos e na hora do aperto eles tentam fazer tudo pelos clientes. Excelente trabalho.', color: '#7C3AED' },
  { name: 'Adilson Hanauer', initials: 'AH', rating: 5, time: 'há 2 semanas', text: 'Empresa ágil e comprometida. Recomendo.', color: '#059669' },
]

const MAPS_URL = 'https://share.google/AtTRA9nk7u7cOrOaa'

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

function ReviewCarousel() {
  const [current, setCurrent] = useState(0)
  const [visible, setVisible] = useState(3)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = REVIEWS.length

  useEffect(() => {
    function update() {
      setVisible(window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const maxIdx = Math.max(0, total - visible)

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(idx, maxIdx)))
  }, [maxIdx])

  const next = useCallback(() => goTo(current >= maxIdx ? 0 : current + 1), [current, maxIdx, goTo])
  const prev = () => goTo(current <= 0 ? maxIdx : current - 1)

  const startAuto = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(next, 4500)
  }, [next])

  const stopAuto = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null } }

  useEffect(() => { startAuto(); return stopAuto }, [startAuto])

  const pct = visible > 0 ? current * (100 / visible) : 0

  return (
    <section id="google-reviews" className="py-16" style={{background:'#F8F9FA'}}>
      <div className="container">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <svg height="22" viewBox="0 0 272 92" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
              <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
              <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
              <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
              <path fill="#EA4335" d="M255.27 54.04l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
              <path fill="#4285F4" d="M35.29 41.41V32h31.4c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C15.96 69.35.5 54.4.5 35.28.5 16.16 15.96 1.21 34.99 1.21c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.18.27z"/>
            </svg>
          </div>
          <div className="text-5xl font-extrabold text-fg-navy">5.0</div>
          <div className="flex justify-center gap-1 my-2">
            {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xl">★</span>)}
          </div>
          <p className="text-sm text-gray-500">Baseado em {total} avaliações no Google</p>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block mt-4 px-5 py-2.5 bg-fg-orange text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors">
            Ver no Google Maps
          </a>
        </div>

        {/* Carousel */}
        <div className="relative"
          onMouseEnter={stopAuto}
          onMouseLeave={startAuto}>
          <div className="overflow-hidden rounded">
            <div className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${pct}%)` }}>
              {REVIEWS.map(r => (
                <div key={r.name} className="flex-shrink-0 px-2.5 box-border"
                  style={{ width: `${100 / visible}%` }}>
                  <div className="bg-white rounded-xl p-5 shadow-sm h-full flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: r.color }}>{r.initials}</div>
                      <div>
                        <div className="font-semibold text-fg-navy text-sm">{r.name}</div>
                        <div className="text-xs text-gray-400">{r.time}</div>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(r.rating)].map((_, i) => <span key={i} className="text-yellow-400 text-sm">★</span>)}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed flex-1">"{r.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrows */}
          <button onClick={() => { stopAuto(); prev(); startAuto() }}
            aria-label="Avaliação anterior"
            className="absolute top-1/2 -left-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-fg-navy hover:bg-fg-navy hover:text-white transition-colors text-lg">
            ‹
          </button>
          <button onClick={() => { stopAuto(); next(); startAuto() }}
            aria-label="Próxima avaliação"
            className="absolute top-1/2 -right-5 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-200 shadow flex items-center justify-center text-fg-navy hover:bg-fg-navy hover:text-white transition-colors text-lg">
            ›
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-1.5 mt-6">
          {REVIEWS.map((_, i) => (
            <button key={i} onClick={() => { stopAuto(); goTo(i); startAuto() }}
              aria-label={`Avaliação ${i + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: i === current ? 24 : 8, background: i === current ? '#E8572A' : '#D1D5DB' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
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
                  className="inline-block px-6 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                  Solicitar análise gratuita
                </a>
                <a href="#como-funciona"
                  onClick={e => { e.preventDefault(); document.getElementById('como-funciona')?.scrollIntoView({behavior:'smooth'}) }}
                  className="inline-block px-6 py-3 border-2 border-fg-navy text-fg-navy font-bold rounded-lg hover:bg-fg-navy hover:text-white transition-all duration-200 cursor-pointer">
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
                className="group bg-fg-bg border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <div className="text-3xl mb-2" aria-hidden="true">{m.icon}</div>
                <span className="inline-block text-xs font-semibold text-fg-orange bg-orange-50 rounded-full px-2 py-0.5 mb-2">{m.badge}</span>
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
            <p className="text-gray-500 mt-2 text-sm">Da solicitação à apólice em mãos — tudo digital</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '📋', n: '1', title: 'Analisamos a exigência', desc: 'Identificamos o tipo de Seguro Garantia necessário, o valor e o prazo da apólice conforme a lei.' },
              { icon: '🔍', n: '2', title: 'Cotamos com 25+ seguradoras', desc: 'Buscamos a melhor taxa entre nossas seguradoras parceiras para o seu perfil e contrato.' },
              { icon: '⚡', n: '3', title: 'Apólice em até 2 horas', desc: 'Emissão expressa para você não perder prazo. Enviamos por e-mail e WhatsApp.' },
            ].map(s => (
              <div key={s.n} className="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="w-8 h-8 rounded-full bg-fg-orange text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-4">{s.n}</div>
                <h3 className="font-bold text-fg-navy mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <a href={WA_URL} target="_blank" rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 hover:shadow-lg transition-all duration-200">
              Solicitar análise gratuita →
            </a>
          </div>
        </div>
      </section>

      {/* VANTAGENS */}
      <section id="vantagens" className="py-16 bg-fg-navy">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            {[
              { value: '2h', label: 'Tempo médio de emissão', icon: '⚡' },
              { value: '25+', label: 'Seguradoras parceiras para melhor taxa', icon: '🤝' },
              { value: '100%', label: 'Atendimento digital em todo o Brasil', icon: '🇧🇷' },
            ].map(s => (
              <div key={s.value} className="p-4">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-5xl font-bold mb-2">{s.value}</div>
                <div className="text-blue-200 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <ReviewCarousel />

      {/* QUEM SOMOS */}
      <section id="quem-somos" className="py-20 bg-fg-bg">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-fg-orange uppercase tracking-widest">Nossa equipe</span>
              <h2 className="text-3xl font-extrabold text-fg-navy mt-2">Fábio &amp; Geisa Lima</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <img src="/couple-new.webp" alt="Fábio e Geisa Lima, fundadores da F&G Corretora de Seguro Garantia"
                className="rounded-2xl w-full shadow-md" width="640" height="480" loading="lazy" />
              <div>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Fundadores da F&G Corretora, especializados exclusivamente em Seguro Garantia. Mais de 10 anos atendendo empresas em licitações, contratos públicos e processos judiciais em todo o Brasil.
                </p>
                <ul className="space-y-3">
                  {['Especialistas em Seguro Garantia','Atendimento 100% dedicado','Parceiros Tokio, AXA, Pottencial e mais','Emissão em até 2 horas'].map(item => (
                    <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-fg-orange text-white text-xs flex items-center justify-center font-bold flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <a href={WA_URL} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-6 px-6 py-3 bg-fg-orange text-white font-bold rounded-lg hover:bg-orange-700 transition-colors">
                  Falar com a equipe
                </a>
              </div>
            </div>
          </div>
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
