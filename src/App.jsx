import { useState } from 'react'
import TitleBar from './components/TitleBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import WorkflowPanel from './components/WorkflowPanel.jsx'
import WorkloadProgressPanel from './components/WorkloadProgressPanel.jsx'
import { leafStatusCounts, deliverStages } from './workload.js'
import workload from '../ref/workload.json'

// placeholder until the app can open a workload.json from disk
const workloadPath = 'ref'

export default function App() {
  const [selectedId, setSelectedId] = useState(workload.items[0]?.id ?? null)
  const selected = workload.items.find((item) => item.id === selectedId) ?? workload.items[0]
  const counts = leafStatusCounts(workload.items)

  return (
    <div className="app">
      <TitleBar path={workloadPath} queueCount={workload.items.length} />
      <div className="body">
        <Sidebar items={workload.items} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="main">
          <WorkflowPanel stages={deliverStages(selected)} tag={`deliver · ${selected.id}`} />
          <WorkloadProgressPanel counts={counts} />
        </div>
      </div>
    </div>
  )
}
