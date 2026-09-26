'use client'

import { useState } from 'react'
import { LogOut, Loader2 } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function SignOutButton({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      // Hard navigation purges all in-memory React session state and cookies instantly
      window.location.href = '/'
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      aria-label="Sign Out"
      className={
        className ??
        'inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/60 transition-all duration-200 shadow-sm hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer shrink-0'
      }
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-rose-400" />
          <span>Signing out...</span>
        </>
      ) : (
        <>
          <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400 transition-transform duration-200 group-hover:translate-x-0.5" />
          <span>Sign Out</span>
        </>
      )}
    </button>
  )
}
