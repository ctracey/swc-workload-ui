import { useState, useMemo } from 'react'
import { mapStatus, itemStage, itemProgress } from '../workload.js'

function activeWorkflow(item) {
  const workflows = item.meta?.swc?.workflowState
  if (!workflows) return null
  for (const [name, state] of Object.entries(workflows)) {
    if (!state.completed && state.currentStage) return name
  }
  return null
}

const STATUS_LABELS = { done: 'done', active: 'active', blocked: 'blocked', pending: 'pending', skipped: 'skipped' }

function deriveState(states) {
  if (states.includes('blocked')) return 'blocked'
  const real = states.filter(s => s !== 'skipped')
  if (real.length === 0) return 'skipped'
  if (real.every(s => s === 'done')) return 'done'
  if (real.every(s => s === 'pending')) return 'pending'
  return 'active'
}

function itemState(item) {
  if (!item.children?.length) return mapStatus(item.status)
  return deriveState(item.children.map(itemState))
}


function matches(item, filter) {
  if (filter === 'all') return true
  if (itemState(item) === filter) return true
  return item.children?.some(c => matches(c, filter)) ?? false
}

function buildRows(items, collapsed, filter) {
  const rows = []
  function walk(nodes, flags, depth, prefix) {
    nodes.forEach((node, i) => {
      const last = i === nodes.length - 1
      const num = prefix ? `${prefix}.${i + 1}` : String(i + 1).padStart(2, '0')
      const hasKids = !!(node.children?.length)
      if (filter !== 'all' && !matches(node, filter)) return
      rows.push({ node, num, depth, last, flags, hasKids, state: itemState(node), pct: itemProgress(node) })
      if (hasKids && !(filter === 'all' && collapsed.has(num))) {
        walk(node.children, [...flags, !last], depth + 1, num)
      }
    })
  }
  walk(items, [], 0, '')
  return rows
}

function overallStats(items) {
  let total = 0, leaves = 0, pcts = []
  function walk(nodes) {
    nodes.forEach(n => {
      total++
      if (!n.children?.length) { leaves++; pcts.push(itemProgress(n)) }
      else walk(n.children)
    })
  }
  walk(items)
  const overall = pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : 0
  return { total, leaves, overall }
}

export default function StackView({ items = [] }) {
  const [collapsed, setCollapsed] = useState(new Set())
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => overallStats(items), [items])
  const rows = useMemo(() => buildRows(items, collapsed, filter), [items, collapsed, filter])

  function toggleCollapse(num) {
    setCollapsed(prev => {
      const next = new Set(prev)
      next.has(num) ? next.delete(num) : next.add(num)
      return next
    })
  }

  function expandAll() { setCollapsed(new Set()) }

  function collapseAll() {
    const set = new Set()
    function walk(nodes, prefix) {
      nodes.forEach((n, i) => {
        const num = prefix ? `${prefix}.${i + 1}` : String(i + 1).padStart(2, '0')
        if (n.children?.length) { set.add(num); walk(n.children, num) }
      })
    }
    walk(items, '')
    setCollapsed(set)
  }

  return (
    <div className="stack-view">
      <div className="stack-toolbar">
        <span className="tk" />
        <h1 className="stack-title">WORK STACK</h1>
        <span className="stack-meta">
          <b>{stats.leaves}</b> leaf · <b>{stats.total}</b> total
        </span>
        <div className="stack-ovr">
          rollup
          <span className="stack-obar"><i style={{ width: `${stats.overall}%` }} /></span>
          <span className="stack-opct">{stats.overall}%</span>
        </div>
        <span className="stack-spacer" />
        <div className="stack-filters">
          {['all', 'active', 'blocked'].map(f => (
            <button key={f} className={filter === f ? 'on' : ''} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
        <button className="stack-btn" onClick={expandAll}>Expand</button>
        <button className="stack-btn" onClick={collapseAll}>Collapse</button>
      </div>

      <div className="stack-scroll">
        <div className="stack-inner">
          <div className="shead">
            <div />
            <div>Workitem</div>
            <div>Workflow</div>
            <div>Progress</div>
          </div>
          <div>
            {rows.length === 0
              ? <div className="stack-empty">no items</div>
              : rows.map(row => (
                <StackRow key={row.num} row={row} isCollapsed={filter === 'all' && collapsed.has(row.num)} onToggle={toggleCollapse} />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function StackRow({ row, isCollapsed, onToggle }) {
  const { node, num, depth, last, flags, hasKids, state, pct } = row
  const barCls = state === 'blocked' ? 'blocked' : state === 'active' ? 'active' : ''
  const workflow = activeWorkflow(node) ?? '—'
  const stage = itemStage(node) ?? '—'

  return (
    <div className={`srow depth${Math.min(depth, 3)}`}>
      <div className="c-prog">
        <span className={`ptile ${state}`} title={STATUS_LABELS[state]} />
      </div>

      <div className="c-ref">
        <div className="s-guides">
          {depth > 0 && flags.map((f, i) => <div key={i} className={`sgcell${f ? ' v' : ''}`} />)}
          <div className={`sgcell ${last ? 'end' : 'mid'}`} />
        </div>
        <div className="s-imain">
          {hasKids
            ? <button className="s-tog" onClick={() => onToggle(num)} aria-expanded={!isCollapsed}>{isCollapsed ? '▸' : '▾'}</button>
            : <span className="s-tog leaf" />
          }
          <div className="s-nid">
            <span className="s-num" title="item number">{num}</span>
            <span className="s-wid" title="item id">{node.id}</span>
          </div>
          <span className="s-ttl" title={node.title}>{node.title}</span>
        </div>
      </div>

      <div className="c-meta">
        <span className="s-st" style={{ color: 'var(--yellow)' }}>{workflow}</span>
        <span className="s-who">{stage}</span>
      </div>

      <div className="c-bar">
        <span className="pbar"><i className={barCls} style={{ width: state === 'skipped' ? 0 : state === 'done' ? '100%' : `${pct}%` }} /></span>
        <span className="ppct">{state === 'skipped' ? '—' : state === 'done' ? '100%' : `${pct}%`}</span>
      </div>
    </div>
  )
}
