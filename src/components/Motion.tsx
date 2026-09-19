import { useEffect, useRef, useState } from 'react'

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Observa toda a página e revela os elementos com a classe `reveal`
 * conforme eles entram na tela. Montado uma única vez no App.
 * Rede de segurança: após 3s tudo é revelado, aconteça o que acontecer.
 */
export function RevealEngine() {
  useEffect(() => {
    const revealAll = () =>
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'))

    if (prefersReduced() || !('IntersectionObserver' in window)) {
      revealAll()
      const mo = new MutationObserver(revealAll)
      mo.observe(document.body, { childList: true, subtree: true })
      return () => mo.disconnect()
    }

    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        })
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )

    const scan = () =>
      document.querySelectorAll('.reveal:not(.is-visible)').forEach(el => io.observe(el))

    scan()
    const mo = new MutationObserver(scan)
    mo.observe(document.body, { childList: true, subtree: true })
    const safety = window.setTimeout(revealAll, 3000)

    return () => {
      mo.disconnect()
      io.disconnect()
      window.clearTimeout(safety)
    }
  }, [])

  return null
}

type CountUpProps = {
  to: number
  decimals?: number
  prefix?: string
  suffix?: string
  duration?: number
}

/** Número que conta de 0 até o valor quando entra na tela. Conta uma vez só. */
export function CountUp({ to, decimals = 0, prefix = '', suffix = '', duration = 1500 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [val, setVal] = useState(prefersReduced() ? to : 0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReduced() || !('IntersectionObserver' in window)) {
      setVal(to)
      return
    }
    const io = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        io.disconnect()
        const t0 = performance.now()
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / duration)
          setVal(to * (1 - Math.pow(1 - p, 3)))
          if (p < 1) requestAnimationFrame(step)
          else setVal(to)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  const texto = val.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  return (
    <span ref={ref}>
      {prefix}
      {texto}
      {suffix}
    </span>
  )
}
