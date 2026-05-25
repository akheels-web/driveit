'use client'

import React from "react"
import { RevealOnScroll } from "./reveal-on-scroll"

export function Stats() {
  const items = [
    { k: "2K+", v: "Luxury Cars" },
    { k: "10+", v: "Private Jets" },
    { k: "500+", v: "Weddings Served" },
    { k: "24/7", v: "Chauffeurs" },
  ]

  return (
    <section className="py-16 bg-black">
      <div className="mx-auto max-w-6xl px-4">
        <RevealOnScroll>
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {items.map((it, i) => {
              return (
                <li
                  key={it.v}
                  className="reveal text-center"
                  style={{ transitionDelay: `${i * 120}ms` }}
                >
                  <span className="text-3xl font-semibold text-gold tabular-nums">{it.k}</span>
                  <div className="mt-2 text-sm text-zinc-400">{it.v}</div>
                </li>
              )
            })}
          </ul>
        </RevealOnScroll>
      </div>
    </section>
  )
}