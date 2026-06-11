const X0 = 55
const X1 = 585
const Y = 44
const SUB_Y = 108

const DISPLAY_FONT = "'Bricolage Grotesque', sans-serif"
const MONO_FONT = "'Space Mono', monospace"

function labelFill(state) {
  if (state === 'active') return 'var(--yellow)'
  if (state === 'done') return 'var(--ink)'
  return 'var(--mute)'
}

function StageNode({ x, state }) {
  if (state === 'done') {
    return (
      <>
        <circle cx={x} cy={Y} r="12" fill="var(--yellow)" />
        <path d={`M${x - 5} ${Y} l3.5 3.5 l6.5 -7`} fill="none" stroke="var(--bg)" strokeWidth="2" />
      </>
    )
  }
  if (state === 'active') {
    return (
      <>
        <circle cx={x} cy={Y} r="17" fill="none" stroke="var(--yellow)" strokeWidth="1.5" />
        <circle
          cx={x}
          cy={Y}
          r="11.5"
          fill="none"
          stroke="var(--yellow)"
          strokeWidth="1"
          strokeDasharray="3 3"
          className="spin"
          style={{ transformOrigin: `${x}px ${Y}px` }}
        />
        <circle cx={x} cy={Y} r="5" fill="var(--yellow)" />
      </>
    )
  }
  return <circle cx={x} cy={Y} r="12" fill="none" stroke="var(--yellow-dim)" strokeWidth="1" />
}

function SubNode({ x, state }) {
  if (state === 'done') {
    return <circle cx={x} cy={SUB_Y} r="6" fill="var(--yellow)" />
  }
  if (state === 'active') {
    return (
      <>
        <circle cx={x} cy={SUB_Y} r="6" fill="none" stroke="var(--yellow)" strokeWidth="1.5" />
        <circle cx={x} cy={SUB_Y} r="2.5" fill="var(--yellow)" />
      </>
    )
  }
  return <circle cx={x} cy={SUB_Y} r="6" fill="none" stroke="var(--yellow-dim)" strokeWidth="1" />
}

function SubSequence({ x, subs }) {
  const span = Math.min(90 * (subs.length - 1), 360)
  const sx0 = Math.max(40, Math.min(x - span / 2, 600 - span))
  const subX = (j) => sx0 + (subs.length > 1 ? (j * span) / (subs.length - 1) : span / 2)
  const doneCount = subs.filter((s) => s.state === 'done').length + (subs.some((s) => s.state === 'active') ? 1 : 0)

  return (
    <>
      <line x1={x} y1={Y + 17} x2={x} y2={SUB_Y - 14} stroke="var(--yellow)" strokeWidth="1" />
      <line x1={sx0} y1={SUB_Y} x2={sx0 + span} y2={SUB_Y} stroke="var(--line)" strokeWidth="1" />
      {subs.map((sub, j) => (
        <g key={sub.name}>
          <SubNode x={subX(j)} state={sub.state} />
          <text
            x={subX(j)}
            y={SUB_Y + 22}
            textAnchor="middle"
            fill={labelFill(sub.state)}
            fontSize="11.5"
            fontFamily={MONO_FONT}
          >
            {sub.name}
          </text>
        </g>
      ))}
      <text
        x={x}
        y={SUB_Y + 40}
        textAnchor="middle"
        fill="var(--yellow-dim)"
        fontSize="10.5"
        letterSpacing="2"
        fontFamily={MONO_FONT}
      >
        SUB-SEQUENCE {doneCount}/{subs.length}
      </text>
    </>
  )
}

export default function WorkflowChart({ stages }) {
  const step = (X1 - X0) / (stages.length - 1)
  const stageX = (i) => X0 + i * step
  const activeIdx = stages.findIndex((s) => s.state === 'active')
  const activeSubs = activeIdx > -1 ? stages[activeIdx].subs : null

  return (
    <svg className="flow" viewBox="0 0 640 150" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Workflow stages">
      {stages.map((s, i) => {
        if (i === 0) return null
        const traversed = stages[i - 1].state === 'done'
        return (
          <line
            key={s.name}
            x1={stageX(i - 1)}
            y1={Y}
            x2={stageX(i)}
            y2={Y}
            stroke={traversed ? 'var(--yellow)' : 'var(--yellow-dim)'}
            strokeWidth={traversed ? 1.5 : 1}
            strokeDasharray={traversed ? 'none' : '4 4'}
          />
        )
      })}
      {stages.map((s, i) => (
        <g key={s.name}>
          <StageNode x={stageX(i)} state={s.state} />
          <text
            x={stageX(i)}
            y={Y + (s.state === 'active' ? 34 : 30)}
            textAnchor="middle"
            fill={labelFill(s.state)}
            fontSize="9.5"
            letterSpacing="1.5"
            fontFamily={DISPLAY_FONT}
            fontWeight="500"
          >
            {s.name}
          </text>
        </g>
      ))}
      {activeSubs?.length > 0 && <SubSequence x={stageX(activeIdx)} subs={activeSubs} />}
    </svg>
  )
}
