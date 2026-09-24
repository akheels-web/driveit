import './lib/payload-interop'

for (const file of ['.env', '.env.local']) {
  try {
    process.loadEnvFile(file)
  } catch {
    // ignore
  }
}

const { getPayload } = await import('payload')
const { default: config } = await import('../payload.config')
const { redeemCoupon } = await import('../lib/coupons')

const payload = await getPayload({ config })

const created = await payload.create({
  collection: 'coupons',
  data: {
    code: `PROBE-${Date.now()}`,
    discountType: 'percentage',
    discountValue: 10,
    isActive: true,
    usageLimit: 1,
    usageCount: 0,
  },
  overrideAccess: true,
})

console.log('coupon id:', created.id, 'limit 1, count 0')

const [first, second, third] = await Promise.all([
  redeemCoupon(payload, created.id),
  redeemCoupon(payload, created.id),
  redeemCoupon(payload, created.id),
])

const after = (await payload.findByID({
  collection: 'coupons',
  id: created.id,
  overrideAccess: true,
})) as Record<string, any>

console.log('three concurrent redemptions →', { first, second, third })
console.log('usageCount after:', after.usageCount, '(must be 1)')

await payload.delete({ collection: 'coupons', id: created.id, overrideAccess: true })

const wins = [first, second, third].filter(Boolean).length
const ok = wins === 1 && Number(after.usageCount) === 1
console.log(ok ? 'PASS: exactly one redemption was claimed' : 'FAIL: the limit was exceeded')
process.exit(ok ? 0 : 1)
