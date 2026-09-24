'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface LuxuryOption {
  value: string
  label: string
  sub?: string
}

interface LuxurySelectProps {
  value: string
  onChange: (value: string) => void
  options: (LuxuryOption | string)[]
  placeholder?: string
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
  id?: string
  ariaLabel?: string
}

export function LuxurySelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  icon,
  className,
  disabled = false,
  id,
  ariaLabel,
}: LuxurySelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [coords, setCoords] = useState<{
    top: number
    left: number
    width: number
    showAbove: boolean
  }>({
    top: 0,
    left: 0,
    width: 0,
    showAbove: false,
  })

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Normalize options to { value, label }
  const normalizedOptions: LuxuryOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  )

  const selectedOption = normalizedOptions.find((opt) => opt.value === value)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const showAbove = spaceBelow < 250 && spaceAbove > spaceBelow

    setCoords({
      top: showAbove ? rect.top - 6 : rect.bottom + 6,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8)),
      width: rect.width,
      showAbove,
    })
  }, [])

  useEffect(() => {
    if (!isOpen) return

    updatePosition()

    const handleScroll = () => updatePosition()
    const handleResize = () => updatePosition()

    const handleClickOutside = (e: PointerEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    window.addEventListener('scroll', handleScroll, { capture: true, passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    document.addEventListener('pointerdown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true })
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('pointerdown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, updatePosition])

  const handleSelect = (val: string) => {
    onChange(val)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <div className={cn('relative w-full', className)}>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        aria-label={ariaLabel || placeholder}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            updatePosition()
            setIsOpen((prev) => !prev)
          }
        }}
        className={cn(
          'w-full bg-[#111] border rounded-xl px-4 py-3 text-sm text-left transition-all duration-200 cursor-pointer flex items-center justify-between outline-none min-h-[46px]',
          icon ? 'pl-10' : 'pl-4',
          isOpen
            ? 'border-[var(--gold-400)]/80 shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[var(--gold-400)]/40'
            : 'border-white/10 hover:border-white/20 focus:border-[var(--gold-400)]/50',
          disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
        )}
      >
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
            {icon}
          </span>
        )}

        <span className={cn('truncate mr-2', selectedOption?.value ? 'text-white' : 'text-white/40')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/40 transition-transform duration-200 shrink-0',
            isOpen && 'rotate-180 text-[var(--gold-400)]'
          )}
        />
      </button>

      {/* Luxury Portal Menu */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              top: coords.showAbove ? undefined : coords.top,
              bottom: coords.showAbove ? window.innerHeight - coords.top : undefined,
              left: coords.left,
              width: coords.width,
              zIndex: 99999,
            }}
            className="animate-in fade-in-0 zoom-in-95 duration-150 origin-top"
          >
            <div className="bg-[#0c0c0e]/98 backdrop-blur-2xl border border-[var(--gold-400)]/30 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(212,175,55,0.12)] p-1.5 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--gold-400)]/30">
              {normalizedOptions.map((opt) => {
                const isSelected = opt.value === value
                return (
                  <div
                    key={opt.value || '__empty__'}
                    onClick={() => handleSelect(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 select-none min-h-[38px]',
                      isSelected
                        ? 'bg-[var(--gold-400)]/20 text-[var(--gold-400)] font-semibold shadow-[inset_0_0_10px_rgba(212,175,55,0.1)]'
                        : 'text-zinc-200 hover:bg-[var(--gold-400)]/15 hover:text-[var(--gold-400)]'
                    )}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="truncate">{opt.label}</span>
                      {opt.sub && <span className="text-[10px] text-white/40 truncate">{opt.sub}</span>}
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[var(--gold-400)] shrink-0 animate-in zoom-in-75 duration-100" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
