import React from 'react'

export const Icon = () => {
  return (
    <img 
      src="/logo.png" 
      alt="DRIVEIT" 
      style={{
        height: '28px',
        width: 'auto',
        maxWidth: '120px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 2px 6px rgba(212, 175, 55, 0.35))'
      }} 
    />
  )
}
