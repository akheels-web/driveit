import { NextResponse } from 'next/server'

import { getCarsFromCMS } from '@/lib/cms'

// Fleet changes are pushed by the revalidate hooks in payload.config.ts, so a
// 5 minute fallback window is plenty.
export const revalidate = 300

/** Public, read-only fleet feed used by client-side marketing sections. */
export async function GET() {
  const cars = await getCarsFromCMS()

  return NextResponse.json(
    { cars },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
  )
}
