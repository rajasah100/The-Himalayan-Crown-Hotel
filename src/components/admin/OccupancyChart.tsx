'use client'

import React, { useState } from 'react'

export type OccupancyDay = { date: string; label: string; weekday: string; rooms: number; total: number }

// Validated single-series hue (passes lightness, chroma and contrast on light and dark admin themes).
const BAR = '#b07a26'

/** 14-night occupancy bars with hover tooltip; one series, so the title names it (no legend). */
export function OccupancyChart({ days }: { days: OccupancyDay[] }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 1000
  const H = 230
  const pad = { top: 16, right: 8, bottom: 34, left: 36 }
  const innerW = W - pad.left - pad.right
  const innerH = H - pad.top - pad.bottom
  const slot = innerW / days.length
  const barW = Math.max(6, slot - 2) // 2px surface gap between adjacent bars
  const pct = (d: OccupancyDay) => (d.total ? (d.rooms / d.total) * 100 : 0)
  const y = (p: number) => pad.top + innerH - (p / 100) * innerH
  const ticks = [0, 25, 50, 75, 100]

  return (
    <div className="hc-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Occupancy for the next 14 nights" style={{ width: '100%', height: 'auto' }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} className="hc-chart__grid" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="hc-chart__axis">
              {t}%
            </text>
          </g>
        ))}
        {days.map((d, i) => {
          const p = pct(d)
          const h = Math.max(0, (p / 100) * innerH)
          const x = pad.left + i * slot + (slot - barW) / 2
          const r = Math.min(4, barW / 2, h)
          const top = pad.top + innerH - h
          // Rounded data-end on top only, square at the baseline.
          const path =
            h > 0
              ? `M${x},${pad.top + innerH} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${pad.top + innerH} Z`
              : ''
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              {/* Hit target taller and wider than the mark */}
              <rect x={pad.left + i * slot} y={pad.top} width={slot} height={innerH} fill="transparent" />
              {path && <path d={path} fill={BAR} opacity={hover === null || hover === i ? 1 : 0.45} />}
              <text x={x + barW / 2} y={H - 18} textAnchor="middle" className="hc-chart__axis">
                {d.weekday}
              </text>
              <text x={x + barW / 2} y={H - 5} textAnchor="middle" className="hc-chart__axis hc-chart__axis--muted">
                {d.label}
              </text>
            </g>
          )
        })}
        <line x1={pad.left} x2={W - pad.right} y1={pad.top + innerH} y2={pad.top + innerH} className="hc-chart__baseline" />
      </svg>
      {hover !== null && (
        <div className="hc-chart__tip" style={{ left: `${((pad.left + hover * slot + slot / 2) / W) * 100}%` }}>
          <strong>
            {days[hover].weekday} {days[hover].label}
          </strong>
          <span>
            {Math.round(pct(days[hover]))}% · {days[hover].rooms} of {days[hover].total} rooms
          </span>
        </div>
      )}
      <table className="hc-sr-only">
        <caption>Occupancy for the next 14 nights</caption>
        <thead>
          <tr>
            <th>Night</th>
            <th>Rooms sold</th>
            <th>Occupancy</th>
          </tr>
        </thead>
        <tbody>
          {days.map((d) => (
            <tr key={d.date}>
              <td>{d.date}</td>
              <td>
                {d.rooms} / {d.total}
              </td>
              <td>{Math.round(pct(d))}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
