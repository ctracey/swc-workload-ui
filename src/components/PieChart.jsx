import { useState } from 'react'

const ORDER = ['done', 'active', 'blocked', 'pending', 'skipped']
const LABELS = { done: 'Done', active: 'Active', blocked: 'Blocked', pending: 'Pending', skipped: 'Skipped' }
const SOLID = { done: '#ffd400', pending: '#222228', skipped: '#3e3e47' }

const CX = 50
const CY = 50
const OUTER = 38
const INNER = 24
const TICKS = 72

function polar(cx, cy, rad, a) {
  return [cx + rad * Math.cos(a), cy + rad * Math.sin(a)]
}

function donutPath(cx, cy, R, r, a0, a1) {
  const big = a1 - a0 > Math.PI ? 1 : 0
  const [x0, y0] = polar(cx, cy, R, a0)
  const [x1, y1] = polar(cx, cy, R, a1)
  const [x2, y2] = polar(cx, cy, r, a1)
  const [x3, y3] = polar(cx, cy, r, a0)
  return (
    `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 ${big} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} ` +
    `L${x2.toFixed(2)} ${y2.toFixed(2)} A${r} ${r} 0 ${big} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`
  )
}

function wedgeFill(k) {
  if (k === 'blocked') return 'url(#hz)'
  if (k === 'active') return 'url(#ht)'
  return SOLID[k]
}

function Ticks({ pct }) {
  const lines = []
  for (let i = 0; i < TICKS; i++) {
    const a = -Math.PI / 2 + (i / TICKS) * Math.PI * 2
    const long = i % 6 === 0
    const [x0, y0] = polar(CX, CY, long ? 42.5 : 44.5, a)
    const [x1, y1] = polar(CX, CY, 48, a)
    const on = (i / TICKS) * 100 <= pct
    lines.push(
      <line
        key={i}
        x1={x0.toFixed(2)}
        y1={y0.toFixed(2)}
        x2={x1.toFixed(2)}
        y2={y1.toFixed(2)}
        stroke={on ? '#ffd400' : '#3e3e47'}
        strokeWidth={long ? 1.4 : 0.9}
      />,
    )
  }
  return lines
}

function Wedges({ counts, total, hover, onHover }) {
  const present = ORDER.filter((k) => counts[k] > 0)
  const wedgeProps = (k) => ({
    className: 'seg-w' + (hover && hover !== k ? ' dim' : ''),
    onMouseEnter: () => onHover(k),
    onMouseLeave: () => onHover(null),
  })

  if (present.length === 1) {
    const k = present[0]
    return (
      <g {...wedgeProps(k)}>
        {k === 'blocked' || k === 'active' ? (
          <path d={donutPath(CX, CY, OUTER, INNER, -Math.PI / 2, 1.5 * Math.PI)} fill={wedgeFill(k)} />
        ) : (
          <circle
            cx={CX}
            cy={CY}
            r={(OUTER + INNER) / 2}
            fill="none"
            stroke={k === 'done' ? '#ffd400' : '#222228'}
            strokeWidth={OUTER - INNER}
          />
        )}
      </g>
    )
  }

  const gap = 0.05
  const scale = (Math.PI * 2 - gap * present.length) / total
  let a = -Math.PI / 2
  return present.map((k) => {
    const a0 = a + gap / 2
    const a1 = a0 + counts[k] * scale
    a = a1 + gap / 2
    return (
      <g key={k} {...wedgeProps(k)}>
        <path d={donutPath(CX, CY, OUTER, INNER, a0, a1)} fill={wedgeFill(k)} stroke="#0f0f11" strokeWidth="0.6" />
      </g>
    )
  })
}

export default function PieChart({ counts }) {
  const [hover, setHover] = useState(null)
  const full = { done: 0, active: 0, blocked: 0, pending: 0, skipped: 0, ...counts }
  const total = ORDER.reduce((n, k) => n + full[k], 0)
  const denom = total - full.skipped
  const pct = denom ? Math.round((100 * full.done) / denom) : 0

  return (
    <div className="dial">
      <div className="dwrap">
        <svg viewBox="0 0 100 100" aria-label="Overall progress">
          <defs>
            <pattern id="hz" width="6" height="6" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="6" height="6" fill="#0a0a0a" />
              <rect width="3" height="6" fill="#ffd400" />
            </pattern>
            <pattern id="ht" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <rect width="5" height="5" fill="#151518" />
              <rect width="1.4" height="5" fill="#ffd400" />
            </pattern>
          </defs>
          <Ticks pct={pct} />
          {total > 0 && <Wedges counts={full} total={total} hover={hover} onHover={setHover} />}
        </svg>
        <div className="dcenter">
          <div className="big">
            {pct}
            <span>%</span>
          </div>
          <div className="lab">Complete</div>
        </div>
      </div>
      <div className="legend">
        {ORDER.map((k) => (
          <div
            key={k}
            className={'lrow' + (hover && hover !== k ? ' dim' : '')}
            onMouseEnter={() => setHover(k)}
            onMouseLeave={() => setHover(null)}
          >
            <span className={`sw ${k}`}></span>
            <span className="lk">{LABELS[k]}</span>
            <span className="lc">{full[k]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
