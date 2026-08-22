// Ícones de linha monocromáticos — usam currentColor.
// Substituem todos os emojis do site.

const base = "stroke-current fill-none stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round]"

// ── Modalidades ────────────────────────────────────────────────────────────
export function IconExecucao({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="m9 12 2 2 4-4"/>
    </svg>
  )
}

export function IconLicitante({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="M3 22h18"/>
      <path d="M6 18V9"/>
      <path d="M10 18V9"/>
      <path d="M14 18V9"/>
      <path d="M18 18V9"/>
      <path d="M12 2 2 7h20z"/>
    </svg>
  )
}

export function IconJudicial({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
      <path d="M7 21h10"/>
      <path d="M12 3v18"/>
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
    </svg>
  )
}

export function IconLocaticia({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )
}

export function IconAdicional({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  )
}

export function IconEnergia({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  )
}

// Mapa slug → ícone
const MODALITY_ICON_MAP: Record<string, (p: { className?: string }) => JSX.Element> = {
  '/seguro-garantia-licitante':          IconLicitante,
  '/seguro-garantia-execucao-contrato':  IconExecucao,
  '/seguro-garantia-judicial':           IconJudicial,
  '/seguro-garantia-locaticia':          IconLocaticia,
  '/seguro-garantia-adicional':          IconAdicional,
  '/seguro-garantia-energia':            IconEnergia,
}

export function ModalityIcon({ slug, className = '' }: { slug: string; className?: string }) {
  const Icon = MODALITY_ICON_MAP[slug] ?? IconAdicional
  return <Icon className={className} />
}

// ── Como funciona (steps) ──────────────────────────────────────────────────
export function IconDoc({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

export function IconCompare({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <circle cx="18" cy="18" r="3"/>
      <circle cx="6"  cy="6"  r="3"/>
      <path d="M13 6h3a2 2 0 0 1 2 2v7"/>
      <path d="M11 18H8a2 2 0 0 1-2-2V9"/>
    </svg>
  )
}

export function IconClockCheck({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

// ── Vantagens ──────────────────────────────────────────────────────────────
export function IconClock({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

export function IconNetwork({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <rect x="2" y="2" width="6" height="6" rx="1"/>
      <rect x="16" y="2" width="6" height="6" rx="1"/>
      <rect x="9" y="16" width="6" height="6" rx="1"/>
      <path d="M5 8v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
    </svg>
  )
}

export function IconGlobe({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  )
}

// ── Genérico ───────────────────────────────────────────────────────────────
export function IconCheck({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}

// ── Ícones para steps das páginas de modalidade ──────────────────────────────
export function IconSearch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  )
}

export function IconChart({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6"  y1="20" x2="6"  y2="14"/>
    </svg>
  )
}

export function IconMail({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${base} ${className}`} aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

// Mapa emoji → ícone SVG para steps de modalidade
import type { FC } from 'react'
type IconProps = { className?: string }
const STEP_ICON_MAP: Record<string, FC<IconProps>> = {
  '📋': IconDoc,
  '📄': IconDoc,
  '⚡': IconClockCheck,
  '✅': IconCheck,
  '⚖️': IconJudicial,
  '🏢': IconLocaticia,
  '📊': IconChart,
  '🔍': IconSearch,
  '✉️': IconMail,
}

export function StepIcon({ emoji, className = '' }: { emoji: string; className?: string }) {
  const Icon = STEP_ICON_MAP[emoji] ?? IconDoc
  return <Icon className={className} />
}
