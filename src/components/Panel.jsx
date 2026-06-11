export default function Panel({ title, tag, rivets = 'abcd', children }) {
  return (
    <div className="panel">
      {[...rivets].map((r) => (
        <span key={r} className={`rivet ${r}`}></span>
      ))}
      <div className="phead">
        <span className="tk"></span>
        <span>{title}</span>
        {tag && <span className="right">{tag}</span>}
      </div>
      <div className="pbody">{children}</div>
    </div>
  )
}
