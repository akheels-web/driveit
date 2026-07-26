import type { ReactNode } from 'react'
import { metadata } from './metadata'

export { metadata }

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function IntercityCabsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
