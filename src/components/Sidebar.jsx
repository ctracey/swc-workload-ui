import { useState } from 'react'
import WorkItemCard from './WorkItemCard.jsx'

export default function Sidebar({ items }) {
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? null)

  return (
    <aside className="sidebar">
      <div className="secbar">
        <span className="tk"></span>
        <span>Workitems</span>
        <span className="cnt">{items.length}</span>
      </div>
      <div className="cardlist" role="listbox" aria-label="Workitems">
        {items.map((item) => (
          <WorkItemCard
            key={item.id}
            item={item}
            selected={item.id === selectedId}
            onSelect={() => setSelectedId(item.id)}
          />
        ))}
      </div>
    </aside>
  )
}
