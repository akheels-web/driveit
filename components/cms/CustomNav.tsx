import React from 'react'
import Link from 'next/link'
import { DefaultNav } from '@payloadcms/next/rsc'

export function CustomNav(props: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div style={{ padding: '14px 14px 4px 14px' }}>
        <Link
          href="/admin"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px 14px',
            background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.1))',
            color: '#d4af37',
            fontWeight: 700,
            fontSize: '0.88rem',
            borderRadius: '10px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.15)',
          }}
        >
          📊 Executive Dashboard
        </Link>
      </div>
      <DefaultNav {...props} />
    </div>
  )
}
