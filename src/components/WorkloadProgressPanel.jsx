import Panel from './Panel.jsx'
import PieChart from './PieChart.jsx'

export default function WorkloadProgressPanel({ counts }) {
  return (
    <Panel title="Workload Progress" right="leaf items">
      <PieChart counts={counts} />
    </Panel>
  )
}
