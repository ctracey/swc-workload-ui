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

// completion percentage of an item: done progress segments over total
// segments, summed across the item itself and all of its descendants
export function itemProgress(item) {
  const members = [item, ...flattenItems(item.children ?? []).map((entry) => entry.item)]
  let done = 0
  let total = 0
  for (const member of members) {
    const stages = progressStages(member)
    done += stages.filter((s) => s.state === 'done').length
    total += stages.length
  }
  return total ? Math.round((100 * done) / total) : 0
}

// status counts across the full item tree, parents included
export function statusCounts(items) {
  const counts = {}
  for (const { item } of flattenItems(items)) {
    const k = mapStatus(item.status)
    counts[k] = (counts[k] ?? 0) + 1
  }
  return counts
}

// depth-first flattening of the item tree; numbers are hierarchical,
// top-level zero-padded ("01"), nested as parent-sequenced decimals ("01.4.2")
export function flattenItems(items, parentNumber = null, depth = 0, out = []) {
  items.forEach((item, i) => {
    const number = parentNumber ? `${parentNumber}.${i + 1}` : String(i + 1).padStart(2, '0')
    out.push({ item, number, depth })
    if (item.children?.length) flattenItems(item.children, number, depth + 1, out)
  })
  return out
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

// flat 9-segment progress: deliver stages with the implement workflow
// stages expanded inline after the deliver implement stage
export function progressStages(item) {
  const workflows = item.meta?.swc?.workflowState
  const out = []
  for (const s of stageStates(WORKFLOWS.deliver, workflows?.deliver)) {
    out.push(s)
    if (s.name === 'implement') {
      // a passed implement stage implies the implement workflow completed,
      // even when the item carries no record of it
      const implementState =
        workflows?.implement ?? (s.state === 'done' ? { completed: true } : undefined)
      out.push(...stageStates(WORKFLOWS.implement, implementState))
    }
  }
  return out
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
