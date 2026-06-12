import { useState } from 'react'
import ProgressBar from './ProgressBar.jsx'
import { mapStatus, itemProgress, itemStage, progressStages } from '../workload.js'

const TAG_CLASS = { blocked: 't-blocked', done: 't-done', pending: 't-pending', skipped: 't-pending' }

export default function WorkItemCard({ item, number, selectedId, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const pct = itemProgress(item)
  const state = mapStatus(item.status)
  const stage = itemStage(item)
  const stripStates = progressStages(item).map((s) => (s.state === 'queued' ? 'pending' : s.state))
  const selected = item.id === selectedId
  const childCount = item.children?.length ?? 0

  const pick = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    e.stopPropagation()
    onSelect?.(item.id)
  }

  return (
    <div
      className={'card' + (selected ? ' sel' : '')}
      role="option"
      aria-selected={selected}
      tabIndex={0}
      onClick={pick}
      onKeyDown={pick}
    >
      <div className="top">
        <span className="cid">
          WI-{number} · {item.id}
        </span>
        <span className="cpc">
          {state === 'done' ? (
            <svg className="donetick" viewBox="0 0 24 24" role="img" aria-label="done">
              <circle cx="12" cy="12" r="12" />
              <path d="M7 12 l3.5 3.5 l6.5 -7" fill="none" strokeWidth="2.5" />
            </svg>
          ) : (
            `${pct}%`
          )}
        </span>
      </div>
      <div className="mid">
        <div className="nm">{item.title}</div>
        <div className="row">
          <span className={`tag ${TAG_CLASS[state] ?? 't-active'}`}>{item.status.toUpperCase()}</span>
          <span>{stage ?? '—'}</span>
        </div>
        <ProgressBar states={stripStates} />
        {childCount > 0 && (
          <button
            type="button"
            className="subtoggle"
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {expanded ? '▾' : '▸'} {childCount} SUB
          </button>
        )}
        {childCount > 0 && expanded && (
          <div className="children">
            {item.children.map((child, i) => (
              <WorkItemCard
                key={child.id}
                item={child}
                number={`${number}.${i + 1}`}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
