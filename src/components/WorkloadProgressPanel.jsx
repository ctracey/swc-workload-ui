import Panel from './Panel.jsx'
import PieChart from './PieChart.jsx'

export default function WorkloadProgressPanel({ counts }) {
  return (
    <Panel title="Workload Progress" tag="leaf items">
      <PieChart counts={counts} />
    </Panel>
  )
}
