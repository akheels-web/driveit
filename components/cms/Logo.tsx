import React from 'react'

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0' }}>
      <style>
        {`
          @keyframes pulseGold {
            0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); transform: scale(1); }
            50% { box-shadow: 0 0 15px 5px rgba(212, 175, 55, 0.2); transform: scale(1.05); }
            100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); transform: scale(1); }
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-10px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>
      <div 
        style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #d4af37, #aa8c2c)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          color: '#000',
          fontSize: '22px',
          fontFamily: 'serif',
          animation: 'pulseGold 3s infinite ease-in-out'
        }}
      >
        D
      </div>
      <span 
        style={{
          fontWeight: 'bold',
          fontSize: '24px',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: '#ffffff',
          fontFamily: 'serif',
          animation: 'slideIn 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards'
        }}
      >
        DriveIt
      </span>
    </div>
  )
}
