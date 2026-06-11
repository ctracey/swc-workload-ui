import ProgressBar from './ProgressBar.jsx'
import { mapStatus, itemProgress, itemStage } from '../workload.js'

const TAG_CLASS = { blocked: 't-blocked', done: 't-done', pending: 't-pending', skipped: 't-pending' }

export default function WorkItemCard({ item, number, selected, onSelect }) {
  const pct = itemProgress(item)
  const state = mapStatus(item.status)
  const stage = itemStage(item)
  const stripStates = item.children?.length ? item.children.map((c) => mapStatus(c.status)) : [state]

  const pick = (e) => {
    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    onSelect?.(item)
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
          WI-{String(number).padStart(2, '0')} · {item.id}
        </span>
        <span className="cpc">{pct}%</span>
      </div>
      <div className="mid">
        <div className="nm">{item.title}</div>
        <div className="row">
          <span className={`tag ${TAG_CLASS[state] ?? 't-active'}`}>{item.status.toUpperCase()}</span>
          <span>{stage ?? '—'}</span>
        </div>
        <ProgressBar states={stripStates} />
      </div>
    </div>
  )
}
