import type { Stage } from './types'

export const STAGE_STYLES: Record<
  Stage,
  { header: string; badge: string; dot: string }
> = {
  Targeting: {
    header: 'bg-navy-800',
    badge: 'bg-slate-200 text-slate-700',
    dot: 'bg-slate-400',
  },
  'Pending Pricing': {
    header: 'bg-navy-700',
    badge: 'bg-electric-500/15 text-electric-600',
    dot: 'bg-electric-500',
  },
  'Pending Proposal': {
    header: 'bg-navy-700',
    badge: 'bg-electric-500/15 text-electric-600',
    dot: 'bg-electric-600',
  },
  Submitted: {
    header: 'bg-navy-600',
    badge: 'bg-gold-500/20 text-gold-600',
    dot: 'bg-gold-500',
  },
  Won: {
    header: 'bg-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  Lost: {
    header: 'bg-rose-900',
    badge: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-500',
  },
  Executed: {
    header: 'bg-navy-950',
    badge: 'bg-gold-500/25 text-gold-500',
    dot: 'bg-gold-500',
  },
}
