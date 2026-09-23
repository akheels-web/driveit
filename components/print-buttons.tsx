'use client'

import { Download, Printer } from 'lucide-react'

export function PrintButtons() {
  return (
    <div className="flex gap-3 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
      >
        <Printer className="w-4 h-4" /> Print
      </button>
      <button
        type="button"
        onClick={() => window.print()}
        className="flex items-center gap-2 bg-[var(--gold-400)] text-black px-4 py-2 rounded-lg text-sm font-semibold"
      >
        <Download className="w-4 h-4" /> Save PDF
      </button>
    </div>
  )
}
