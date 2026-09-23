'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'

interface LocationSearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  iconClassName?: string
}

export function LocationSearchInput({ value, onChange, placeholder = "Search location...", className, iconClassName }: LocationSearchInputProps) {
  // Fully controlled: the parent owns the text, so there is no local copy to
  // keep in sync (the old mirror-state effect caused an extra render per keypress).
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const searchLocation = async (text: string) => {
    if (!text || text.length < 3) {
      setResults([])
      setOpen(false)
      return
    }

    setLoading(true)
    try {
      // Use OpenStreetMap Nominatim API for search. Add bounding box for Hyderabad.
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&viewbox=78.1,17.6,78.7,17.2&bounded=1&limit=5`)
      const data = await res.json()
      setResults(data)
      setOpen(true)
    } catch (error) {
      console.error("Error fetching location:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    onChange(val)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => searchLocation(val), 500)
  }

  const handleSelect = (item: any) => {
    onChange(item.display_name.split(',').slice(0, 3).join(','))
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => { if (results.length > 0) setOpen(true) }}
        placeholder={placeholder}
        className={className || "w-full bg-white/[0.03] border border-white/10 rounded-xl px-3 py-3 pl-9 text-white text-sm placeholder:text-white/20 hover:border-[var(--gold-400)]/30 focus:border-[var(--gold-400)]/50 focus:outline-none transition-colors"}
        autoComplete="off"
      />
      <MapPin className={iconClassName || "absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--gold-400)]/50"} />
      
      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <Loader2 className="w-3.5 h-3.5 text-[var(--gold-400)]/50 animate-spin" />
        </div>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-[#111] border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
          {results.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleSelect(item)}
              className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 flex items-start gap-2"
            >
              <MapPin className="w-4 h-4 text-[var(--gold-400)]/70 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm text-white/90">{item.display_name.split(',')[0]}</p>
                <p className="text-[10px] text-white/40 line-clamp-1">{item.display_name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
