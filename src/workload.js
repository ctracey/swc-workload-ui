// maps workload.json item statuses to the visual states used by the UI
const STATUS_MAP = {
  done: 'done',
  completed: 'done',
  'in-progress': 'active',
  blocked: 'blocked',
  'not-started': 'pending',
  skipped: 'skipped',
}

export function mapStatus(status) {
  return STATUS_MAP[status] ?? 'pending'
}

export function leafStatusCounts(items, counts = {}) {
  for (const item of items) {
    if (item.children?.length) {
      leafStatusCounts(item.children, counts)
    } else {
      const k = mapStatus(item.status)
      counts[k] = (counts[k] ?? 0) + 1
    }
  }
  return counts
}

// completion percentage of an item, based on its children (or own status when leaf)
export function itemProgress(item) {
  if (!item.children?.length) {
    return mapStatus(item.status) === 'done' ? 100 : 0
  }
  const counts = leafStatusCounts(item.children)
  const denom = Object.entries(counts).reduce((n, [k, c]) => n + (k === 'skipped' ? 0 : c), 0)
  return denom ? Math.round((100 * (counts.done ?? 0)) / denom) : 0
}

// current workflow stage from swc meta, e.g. "review"
export function itemStage(item) {
  const workflows = item.meta?.swc?.workflowState
  if (!workflows) return null
  for (const state of Object.values(workflows)) {
    if (!state.completed && state.currentStage) return state.currentStage
  }
  return null
}

// swc workflow stage sequences
export const WORKFLOWS = {
  deliver: ['requirements', 'specs', 'solution-design', 'implement', 'refine', 'review'],
  implement: ['orient', 'implement', 'summarise'],
}

// per-stage done/active/queued from a workflowState entry ({currentStage, completed})
function stageStates(catalog, state) {
  if (!state) return catalog.map((name) => ({ name, state: 'queued' }))
  if (state.completed) return catalog.map((name) => ({ name, state: 'done' }))
  const idx = catalog.indexOf(state.currentStage)
  return catalog.map((name, i) => ({
    name,
    state: idx === -1 ? 'queued' : i < idx ? 'done' : i === idx ? 'active' : 'queued',
  }))
}

// deliver workflow stages for an item, with the implement sub-sequence
// attached while the implement stage is active
export function deliverStages(item) {
  const workflows = item.meta?.swc?.workflowState
  return stageStates(WORKFLOWS.deliver, workflows?.deliver).map((s) => {
    const stage = { ...s, name: s.name.toUpperCase() }
    if (s.name === 'implement' && s.state === 'active' && workflows?.implement) {
      stage.subs = stageStates(WORKFLOWS.implement, workflows.implement)
    }
    return stage
  })
}
