import type { Stage } from './types'

export const STAGE_STYLES: Record<
  Stage,
  { topAccent: string; text: string; badge: string; dot: string }
> = {
  Targeting: {
    topAccent: 'border-t-[#0A1628]',
    text: 'text-[#0A1628]',
    badge: 'bg-[#0A1628]/10 text-[#0A1628]',
    dot: 'bg-[#0A1628]',
  },
  'Pending Pricing': {
    topAccent: 'border-t-[#1E90FF]',
    text: 'text-[#1E90FF]',
    badge: 'bg-[#1E90FF]/10 text-[#1E90FF]',
    dot: 'bg-[#1E90FF]',
  },
  'Pending Proposal': {
    topAccent: 'border-t-[#F5A623]',
    text: 'text-[#F5A623]',
    badge: 'bg-[#F5A623]/15 text-[#F5A623]',
    dot: 'bg-[#F5A623]',
  },
  Submitted: {
    topAccent: 'border-t-[#22C55E]',
    text: 'text-[#22C55E]',
    badge: 'bg-[#22C55E]/10 text-[#22C55E]',
    dot: 'bg-[#22C55E]',
  },
  Closed: {
    topAccent: 'border-t-[#16A34A]',
    text: 'text-[#16A34A]',
    badge: 'bg-[#16A34A]/10 text-[#16A34A]',
    dot: 'bg-[#16A34A]',
  },
  Executed: {
    topAccent: 'border-t-[#6B7280]',
    text: 'text-[#6B7280]',
    badge: 'bg-[#6B7280]/10 text-[#6B7280]',
    dot: 'bg-[#6B7280]',
  },
  Lost: {
    topAccent: 'border-t-[#EF4444]',
    text: 'text-[#EF4444]',
    badge: 'bg-[#EF4444]/10 text-[#EF4444]',
    dot: 'bg-[#EF4444]',
  },
}
