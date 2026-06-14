import { useEffect, useState } from 'react'
import TitleBar from './components/TitleBar.jsx'
import NavRail from './components/NavRail.jsx'
import Sidebar from './components/Sidebar.jsx'
import WorkflowPanel from './components/WorkflowPanel.jsx'
import WorkloadProgressPanel from './components/WorkloadProgressPanel.jsx'
import SelectWorkloadPanel from './components/SelectWorkloadPanel.jsx'
import HomeView from './components/HomeView.jsx'
import StackView from './components/StackView.jsx'
import AboutView from './components/AboutView.jsx'
import { statusCounts, deliverStages, flattenItems } from './workload.js'

// folder containing workload.json, e.g. /?path=/Users/me/runs/quote-app
const pathParam = new URLSearchParams(window.location.search).get('path')

function workloadUrl(path) {
  // the vite dev server only exposes the filesystem under its /@fs/ prefix
  const base = import.meta.env.DEV && path.startsWith('/') ? '/@fs' + path : path
  return (base.endsWith('/') ? base : base + '/') + 'workload.json'
}

const POLL_MS = 2000

export default function App() {
  const [workload, setWorkload] = useState(null)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [view, setView] = useState('radar')

  useEffect(() => {
    if (!pathParam) return
    let cancelled = false
    let lastText = null

    const tick = async (first) => {
      try {
        const res = await fetch(workloadUrl(pathParam))
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        if (cancelled || text === lastText) return
        if (text.trimStart().startsWith('<')) {
          throw new Error('server returned HTML, not JSON — run the app via `npm run serve`')
        }
        const data = JSON.parse(text)
        lastText = text
        setWorkload(data)
        setError(null)
      } catch (err) {
        // polling hits transient states while the file is being saved;
        // only surface errors when nothing has loaded yet
        if (!cancelled && first) {
          setError(`failed to load ${workloadUrl(pathParam)} — ${err.message}`)
        }
      }
    }

    tick(true)
    const id = setInterval(() => tick(false), POLL_MS)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const items = workload?.items ?? []
  const selected = flattenItems(items).find(({ item }) => item.id === selectedId)?.item ?? items[0]

  return (
    <div className="app">
      <TitleBar
        path={pathParam ?? 'none'}
        queueCount={workload ? flattenItems(items).length : undefined}
        onHome={() => setView('home')}
      />
      <div className="app-body">
        <NavRail view={view} onView={setView} />
        <div className="view-content">
          {view === 'radar' ? (
            error ? (
              <div className="appmsg">{error}</div>
            ) : pathParam && !workload ? (
              <div className="appmsg">loading workload…</div>
            ) : (
              <div className="body">
                <Sidebar items={items} selectedId={selectedId} onSelect={setSelectedId} />
                <div className="main">
                  {workload ? (
                    <>
                      {selected && <WorkflowPanel stages={deliverStages(selected)} tag={`deliver · ${selected.id}`} />}
                      <WorkloadProgressPanel counts={statusCounts(items)} />
                    </>
                  ) : (
                    <SelectWorkloadPanel />
                  )}
                </div>
              </div>
            )
          ) : view === 'home' ? (
            <HomeView path={pathParam} />
          ) : view === 'stack' ? (
            <StackView items={items} />
          ) : view === 'about' ? (
            <AboutView />
          ) : null}
        </div>
      </div>
    </div>
  )
}
