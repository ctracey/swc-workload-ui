import TitleBar from './components/TitleBar.jsx'
import workload from '../ref/workload.json'

// placeholder until the app can open a workload.json from disk
const workloadPath = 'ref'

export default function App() {
  return (
    <div className="app">
      <TitleBar path={workloadPath} queueCount={workload.items.length} />
    </div>
  )
}
