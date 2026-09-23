'use client'

import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function SignOutButton({ className }: { className?: string }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className={
        className ??
        'flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-white/40 border border-white/10 hover:border-red-400/30 hover:text-red-400 transition-colors'
      }
    >
      <LogOut className="w-3.5 h-3.5" />
      Sign Out
    </button>
  )
}
