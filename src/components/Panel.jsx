export default function Panel({ title, tag, right, rivets = 'abcd', children }) {
  return (
    <div className="panel">
      {[...rivets].map((r) => (
        <span key={r} className={`rivet ${r}`}></span>
      ))}
      <div className="phead">
        <span className="tk"></span>
        <span>{title}</span>
        {tag && <span className="tag">{tag}</span>}
        {right && <span className="right">{right}</span>}
      </div>
      <div className="pbody">{children}</div>
    </div>
  )
}
