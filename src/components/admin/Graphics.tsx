import React from 'react'

const Crown = ({ size = 28 }: { size?: number }) => (
  <svg viewBox="0 0 120 90" width={size} height={(size * 90) / 120} fill="none" stroke="#b08a52" strokeWidth="6" aria-hidden>
    <path d="M12 68 L12 30 L36 50 L60 14 L84 50 L108 30 L108 68 Z" strokeLinejoin="round" />
    <path d="M12 82 H108" strokeLinecap="round" />
  </svg>
)

/** Login screen logo. */
export function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <Crown size={64} />
      <div style={{ textAlign: 'center', lineHeight: 1.1 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#b08a52' }}>The</div>
        <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 30 }}>Himalayan Crown</div>
        <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.6, marginTop: 6 }}>
          Hotel administration
        </div>
      </div>
    </div>
  )
}

/** Small mark in the admin navigation. */
export function Icon() {
  return <Crown size={28} />
}
