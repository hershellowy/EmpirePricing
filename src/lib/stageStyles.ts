import type { Stage } from './types'

export const STAGE_STYLES: Record<Stage, { badge: string; bar: string; barText: string }> = {
  Targeting: {
    badge: 'bg-[#0A1628]/10 text-[#0A1628]',
    bar: 'bg-[#0A1628]',
    barText: 'text-white',
  },
  'Pending Pricing': {
    badge: 'bg-[#1E90FF]/10 text-[#1E90FF]',
    bar: 'bg-[#1E90FF]',
    barText: 'text-white',
  },
  'Pending Proposal': {
    badge: 'bg-[#F5A623]/15 text-[#F5A623]',
    bar: 'bg-[#F5A623]',
    barText: 'text-[#0A1628]',
  },
  Submitted: {
    badge: 'bg-[#22C55E]/10 text-[#22C55E]',
    bar: 'bg-[#22C55E]',
    barText: 'text-white',
  },
  Closed: {
    badge: 'bg-[#16A34A]/10 text-[#16A34A]',
    bar: 'bg-[#16A34A]',
    barText: 'text-white',
  },
  Executed: {
    badge: 'bg-[#6B7280]/10 text-[#6B7280]',
    bar: 'bg-[#6B7280]',
    barText: 'text-white',
  },
  Lost: {
    badge: 'bg-[#EF4444]/10 text-[#EF4444]',
    bar: 'bg-[#EF4444]',
    barText: 'text-white',
  },
}
