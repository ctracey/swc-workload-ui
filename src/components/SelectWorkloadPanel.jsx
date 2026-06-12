import { useState } from 'react'
import Panel from './Panel.jsx'

export default function SelectWorkloadPanel() {
  const [path, setPath] = useState('')

  // navigating with ?path= puts the session in the URL, so it is bookmarkable
  const openPath = (e) => {
    e.preventDefault()
    const folder = path.trim()
    if (!folder) return
    const url = new URL(window.location.href)
    url.searchParams.set('path', folder)
    window.location.href = url.toString()
  }

  return (
    <Panel title="Select Workload" tag="no source">
      <div className="picker">
        <p>No workload loaded. Enter the folder containing workload.json.</p>
        <form className="pathform" onSubmit={openPath}>
          <input
            className="pathinput"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="/absolute/path/to/folder"
            spellCheck="false"
            aria-label="Workload folder path"
          />
          <button type="submit" className="pickbtn">
            OPEN
          </button>
        </form>
      </div>
    </Panel>
  )
}
