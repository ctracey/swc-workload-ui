import WorkItemCard from './WorkItemCard.jsx'

export default function Sidebar({ items, selectedId, onSelect }) {
  return (
    <aside className="sidebar">
      <div className="secbar">
        <span className="tk"></span>
        <span>Workitems</span>
        <span className="cnt">{items.length}</span>
      </div>
      <div className="cardlist" role="listbox" aria-label="Workitems">
        {items.map((item, i) => (
          <WorkItemCard
            key={item.id}
            item={item}
            number={i + 1}
            selected={item.id === selectedId}
            onSelect={() => onSelect(item.id)}
          />
        ))}
      </div>
    </aside>
  )
}
