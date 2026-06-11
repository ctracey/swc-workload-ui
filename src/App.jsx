import TitleBar from './components/TitleBar.jsx'
import WorkloadProgressPanel from './components/WorkloadProgressPanel.jsx'
import workload from '../ref/workload.json'

// placeholder until the app can open a workload.json from disk
const workloadPath = 'ref'

const STATUS_MAP = {
  done: 'done',
  completed: 'done',
  'in-progress': 'active',
  blocked: 'blocked',
  'not-started': 'pending',
  skipped: 'skipped',
}

function leafStatusCounts(items, counts = {}) {
  for (const item of items) {
    if (item.children?.length) {
      leafStatusCounts(item.children, counts)
    } else {
      const k = STATUS_MAP[item.status] ?? 'pending'
      counts[k] = (counts[k] ?? 0) + 1
    }
  }
  return counts
}

export default function App() {
  const counts = leafStatusCounts(workload.items)
  return (
    <div className="app">
      <TitleBar path={workloadPath} queueCount={workload.items.length} />
      <div className="body">
        <WorkloadProgressPanel counts={counts} />
      </div>
    </div>
  )
}
