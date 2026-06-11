import { useEffect, useState } from 'react'
import TitleBar from './components/TitleBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import WorkflowPanel from './components/WorkflowPanel.jsx'
import WorkloadProgressPanel from './components/WorkloadProgressPanel.jsx'
import { statusCounts, deliverStages, flattenItems } from './workload.js'
import sample from '../ref/workload.json'

// folder containing workload.json, e.g. index.html?path=../runs/quote-app
const pathParam = new URLSearchParams(window.location.search).get('path')

function workloadUrl(path) {
  return (path.endsWith('/') ? path : path + '/') + 'workload.json'
}

export default function App() {
  const [workload, setWorkload] = useState(pathParam ? null : sample)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  useEffect(() => {
    if (!pathParam) return
    fetch(workloadUrl(pathParam))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setWorkload)
      .catch((err) => setError(`failed to load ${workloadUrl(pathParam)} — ${err.message}`))
  }, [])

  const items = workload?.items ?? []
  const selected = flattenItems(items).find(({ item }) => item.id === selectedId)?.item ?? items[0]

  return (
    <div className="app">
      <TitleBar path={pathParam ?? 'sample'} queueCount={workload ? flattenItems(items).length : undefined} />
      {error ? (
        <div className="appmsg">{error}</div>
      ) : !workload ? (
        <div className="appmsg">loading workload…</div>
      ) : (
        <div className="body">
          <Sidebar items={items} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="main">
            {selected && <WorkflowPanel stages={deliverStages(selected)} tag={`deliver · ${selected.id}`} />}
            <WorkloadProgressPanel counts={statusCounts(items)} />
          </div>
        </div>
      )}
    </div>
  )
}
