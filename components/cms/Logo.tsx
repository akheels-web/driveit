import React from 'react'

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-[var(--gold-400)] flex items-center justify-center font-bold text-black font-[family-name:var(--font-playfair)] text-xl">
        D
      </div>
      <span className="font-bold text-xl tracking-wider uppercase text-white font-[family-name:var(--font-playfair)]">
        DriveIt
      </span>
    </div>
  )
}
