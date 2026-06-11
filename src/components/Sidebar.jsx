import WorkItemCard from './WorkItemCard.jsx'
import { flattenItems } from '../workload.js'

export default function Sidebar({ items, selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="secbar">
        <span className="tk"></span>
        <span>Workitems</span>
        <span className="cnt">{flattenItems(items).length}</span>
      </div>
      <div className="cardlist" role="listbox" aria-label="Workitems">
        {items.map((item, i) => (
          <WorkItemCard
            key={item.id}
            item={item}
            number={String(i + 1).padStart(2, '0')}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </aside>
  )
}
