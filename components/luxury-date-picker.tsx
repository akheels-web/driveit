'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LuxuryDatePickerProps {
  value: string // Format: 'YYYY-MM-DD'
  onChange: (value: string) => void
  min?: string // Format: 'YYYY-MM-DD'
  max?: string // Format: 'YYYY-MM-DD'
  placeholder?: string
  icon?: React.ReactNode
  className?: string
  triggerClassName?: string
  disabled?: boolean
  id?: string
  name?: string
  ariaLabel?: string
  size?: 'sm' | 'md'
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

function formatDateString(year: number, monthIndex: number, day: number) {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`
}

function formatDisplayDate(val: string) {
  if (!val) return ''
  const parts = val.split('-')
  if (parts.length !== 3) return val
  const y = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10) - 1
  const d = parseInt(parts[2], 10)
  const dt = new Date(y, m, d)
  if (isNaN(dt.getTime())) return val
  return dt.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function LuxuryDatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date...',
  icon,
  className,
  triggerClassName,
  disabled = false,
  id,
  name,
  ariaLabel,
  size = 'md',
}: LuxuryDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Current view year & month
  const initialDate = value ? new Date(value) : min ? new Date(min) : new Date()
  const validInitialDate = isNaN(initialDate.getTime()) ? new Date() : initialDate

  const [viewYear, setViewYear] = useState(validInitialDate.getFullYear())
  const [viewMonth, setViewMonth] = useState(validInitialDate.getMonth())

  // Keep view in sync when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value)
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear())
        setViewMonth(d.getMonth())
      }
    }
  }, [value])

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

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const popoverHeight = 350
    const showAbove = spaceBelow < popoverHeight && spaceAbove > spaceBelow

    const calendarWidth = Math.max(300, rect.width)
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - calendarWidth - 12))

    setCoords({
      top: showAbove ? rect.top - 6 : rect.bottom + 6,
      left,
      width: calendarWidth,
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

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((prev) => prev - 1)
    } else {
      setViewMonth((prev) => prev - 1)
    }
  }

  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((prev) => prev + 1)
    } else {
      setViewMonth((prev) => prev + 1)
    }
  }

  const handleSelectDay = (day: number) => {
    const dateStr = formatDateString(viewYear, viewMonth, day)
    onChange(dateStr)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  // Calculate calendar days
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate()

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div className={cn('relative w-full', className)}>
      {name && <input type="hidden" name={name} value={value} />}
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
          'w-full bg-[#111] border rounded-xl text-left transition-all duration-200 cursor-pointer flex items-center justify-between outline-none',
          size === 'sm' ? 'px-3 py-2 text-xs min-h-[38px]' : 'px-4 py-3 text-sm min-h-[46px]',
          size === 'sm' ? 'pl-8' : 'pl-10',
          isOpen
            ? 'border-[var(--gold-400)]/80 shadow-[0_0_15px_rgba(212,175,55,0.25)] ring-1 ring-[var(--gold-400)]/40'
            : 'border-white/10 hover:border-white/20 focus:border-[var(--gold-400)]/50',
          disabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          triggerClassName
        )}
      >
        <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
          {icon || <CalendarDays className="w-4 h-4 text-[var(--gold-400)]/70" />}
        </span>

        <span className={cn('truncate mr-2 font-medium', value ? 'text-white' : 'text-white/40')}>
          {value ? formatDisplayDate(value) : placeholder}
        </span>

        {value && !disabled ? (
          <span
            onClick={(e) => {
              e.stopPropagation()
              onChange('')
            }}
            title="Clear date"
            className="w-4 h-4 rounded-full flex items-center justify-center text-white/40 hover:text-[var(--gold-400)] hover:bg-white/5 transition-colors"
          >
            <X className="w-3 h-3" />
          </span>
        ) : (
          <CalendarDays className="w-3.5 h-3.5 text-white/30 shrink-0" />
        )}
      </button>

      {/* Obsidian-Gold Luxury Calendar Popover */}
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
              minWidth: '300px',
              maxWidth: '360px',
              zIndex: 99999,
            }}
            className="animate-in fade-in-0 zoom-in-95 duration-150 origin-top"
          >
            <div className="bg-[#0c0c0e]/98 backdrop-blur-2xl border border-[var(--gold-400)]/30 rounded-2xl shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_25px_rgba(212,175,55,0.15)] p-4 select-none">
              {/* Header: Month & Year + Arrows */}
              <div className="flex items-center justify-between mb-3 px-1">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.03] text-zinc-300 hover:text-[var(--gold-400)] hover:border-[var(--gold-400)]/40 hover:bg-[var(--gold-400)]/10 transition-all cursor-pointer"
                  aria-label="Previous Month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center font-medium text-white tracking-wide text-sm flex items-center gap-1.5">
                  <span className="text-[var(--gold-300)] font-semibold">
                    {MONTH_NAMES[viewMonth]}
                  </span>
                  <span className="text-white/60 font-mono text-xs">{viewYear}</span>
                </div>

                <button
                  type="button"
                  onClick={nextMonth}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/5 bg-white/[0.03] text-zinc-300 hover:text-[var(--gold-400)] hover:border-[var(--gold-400)]/40 hover:bg-[var(--gold-400)]/10 transition-all cursor-pointer"
                  aria-label="Next Month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                {DAY_NAMES.map((name, i) => (
                  <span
                    key={name}
                    className={cn(
                      'text-[11px] font-semibold py-1 uppercase tracking-wider',
                      i === 0 || i === 6 ? 'text-[var(--gold-400)]/80' : 'text-white/40'
                    )}
                  >
                    {name}
                  </span>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {/* Previous month days */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => {
                  const dayNum = daysInPrevMonth - firstDayOfWeek + i + 1
                  return (
                    <div
                      key={`prev-${i}`}
                      className="h-8 flex items-center justify-center text-xs text-white/15 pointer-events-none"
                    >
                      {dayNum}
                    </div>
                  )
                })}

                {/* Current month days */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1
                  const dateStr = formatDateString(viewYear, viewMonth, day)
                  const isSelected = value === dateStr
                  const isToday = todayStr === dateStr

                  const isBeforeMin = min && dateStr < min
                  const isAfterMax = max && dateStr > max
                  const isDisabled = Boolean(isBeforeMin || isAfterMax)

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleSelectDay(day)}
                      className={cn(
                        'h-8 w-full rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center cursor-pointer',
                        isDisabled &&
                          'text-white/20 cursor-not-allowed pointer-events-none hover:bg-transparent',
                        !isDisabled &&
                          !isSelected &&
                          'text-zinc-200 hover:bg-[var(--gold-400)]/20 hover:text-[var(--gold-300)]',
                        isToday &&
                          !isSelected &&
                          'ring-1 ring-[var(--gold-400)]/60 text-[var(--gold-300)] font-semibold',
                        isSelected &&
                          'bg-gradient-to-br from-[var(--gold-400)] to-[var(--gold-600)] text-black font-bold shadow-[0_0_12px_rgba(212,175,55,0.45)]'
                      )}
                    >
                      {day}
                    </button>
                  )
                })}

                {/* Next month days to fill grid */}
                {Array.from({
                  length: (7 - ((firstDayOfWeek + daysInMonth) % 7)) % 7,
                }).map((_, i) => (
                  <div
                    key={`next-${i}`}
                    className="h-8 flex items-center justify-center text-xs text-white/15 pointer-events-none"
                  >
                    {i + 1}
                  </div>
                ))}
              </div>

              {/* Quick Actions Footer */}
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5 px-1">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date().toISOString().split('T')[0]
                    if (!min || today >= min) {
                      onChange(today)
                      setIsOpen(false)
                    }
                  }}
                  className="text-xs text-[var(--gold-400)] hover:text-[var(--gold-200)] font-medium transition-colors cursor-pointer"
                >
                  Today
                </button>

                <div className="flex items-center gap-2">
                  {value && (
                    <button
                      type="button"
                      onClick={() => {
                        onChange('')
                      }}
                      className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-2.5 py-1 text-xs rounded-md bg-[var(--gold-400)]/20 text-[var(--gold-300)] hover:bg-[var(--gold-400)]/30 border border-[var(--gold-400)]/30 font-medium transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
