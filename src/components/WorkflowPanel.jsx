import Panel from './Panel.jsx'
import WorkflowChart from './WorkflowChart.jsx'

export default function WorkflowPanel({ stages, tag }) {
  return (
    <Panel title="Workflow" tag={tag}>
      <WorkflowChart stages={stages} />
    </Panel>
  )
}
