import TitleBar from './components/TitleBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import WorkflowPanel from './components/WorkflowPanel.jsx'
import WorkloadProgressPanel from './components/WorkloadProgressPanel.jsx'
import { leafStatusCounts } from './workload.js'
import workload from '../ref/workload.json'

// placeholder until the app can open a workload.json from disk
const workloadPath = 'ref'

// demo stages mirroring the swc deliver workflow; wired to real data later
const DEMO_STAGES = [
  { name: 'REQUIREMENTS', state: 'done' },
  { name: 'SPECS', state: 'done' },
  { name: 'SOLUTION-DESIGN', state: 'done' },
  {
    name: 'IMPLEMENT',
    state: 'active',
    subs: [
      { name: 'orient', state: 'done' },
      { name: 'implement', state: 'active' },
      { name: 'summarise', state: 'queued' },
    ],
  },
  { name: 'REFINE', state: 'queued' },
  { name: 'REVIEW', state: 'queued' },
]

export default function App() {
  const counts = leafStatusCounts(workload.items)
  return (
    <div className="app">
      <TitleBar path={workloadPath} queueCount={workload.items.length} />
      <div className="body">
        <Sidebar items={workload.items} />
        <div className="main">
          <WorkflowPanel stages={DEMO_STAGES} tag="deliver" />
          <WorkloadProgressPanel counts={counts} />
        </div>
      </div>
    </div>
  )
}
