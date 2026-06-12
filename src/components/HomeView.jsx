import SelectWorkloadPanel from './SelectWorkloadPanel.jsx'

export default function HomeView({ path }) {
  return (
    <div className="main">
      <SelectWorkloadPanel initialPath={path ?? ''} />
    </div>
  )
}
