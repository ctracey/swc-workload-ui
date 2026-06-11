import WorkItemCard from './WorkItemCard.jsx'
import { flattenItems } from '../workload.js'

export default function Sidebar({ items, selectedId, onSelect }) {
  const entries = flattenItems(items)
  return (
    <aside className="sidebar">
      <div className="secbar">
        <span className="tk"></span>
        <span>Workitems</span>
        <span className="cnt">{entries.length}</span>
      </div>
      <div className="cardlist" role="listbox" aria-label="Workitems">
        {entries.map(({ item, number, depth }) => (
          <WorkItemCard
            key={item.id}
            item={item}
            number={number}
            depth={depth}
            selected={item.id === selectedId}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>
    </aside>
  )
}
