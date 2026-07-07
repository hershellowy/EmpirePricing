import type { Stage } from './types'

export const STAGE_STYLES: Record<
  Stage,
  { accent: string; text: string; badge: string; dot: string }
> = {
  Targeting: {
    accent: 'border-l-navy-400',
    text: 'text-navy-700',
    badge: 'bg-navy-100 text-navy-700',
    dot: 'bg-navy-400',
  },
  'Pending Pricing': {
    accent: 'border-l-electric-400',
    text: 'text-electric-600',
    badge: 'bg-electric-100 text-electric-600',
    dot: 'bg-electric-400',
  },
  'Pending Proposal': {
    accent: 'border-l-electric-600',
    text: 'text-electric-600',
    badge: 'bg-electric-100 text-electric-600',
    dot: 'bg-electric-600',
  },
  Submitted: {
    accent: 'border-l-gold-500',
    text: 'text-gold-700',
    badge: 'bg-gold-100 text-gold-700',
    dot: 'bg-gold-500',
  },
  Won: {
    accent: 'border-l-emerald-500',
    text: 'text-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  Lost: {
    accent: 'border-l-rose-500',
    text: 'text-rose-700',
    badge: 'bg-rose-100 text-rose-700',
    dot: 'bg-rose-500',
  },
  Executed: {
    accent: 'border-l-gold-600',
    text: 'text-gold-700',
    badge: 'bg-gold-600/15 text-gold-700',
    dot: 'bg-gold-600',
  },
}
