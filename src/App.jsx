import TitleBar from './components/TitleBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import WorkloadProgressPanel from './components/WorkloadProgressPanel.jsx'
import { leafStatusCounts } from './workload.js'
import workload from '../ref/workload.json'

// placeholder until the app can open a workload.json from disk
const workloadPath = 'ref'

export default function App() {
  const counts = leafStatusCounts(workload.items)
  return (
    <div className="app">
      <TitleBar path={workloadPath} queueCount={workload.items.length} />
      <div className="body">
        <Sidebar items={workload.items} />
        <div className="main">
          <WorkloadProgressPanel counts={counts} />
        </div>
      </div>
    </div>
  )
}
