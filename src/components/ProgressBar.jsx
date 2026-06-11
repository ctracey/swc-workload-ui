export default function ProgressBar({ states }) {
  return (
    <div className="strip">
      {states.map((s, i) => (
        <i key={i} className={s}></i>
      ))}
    </div>
  )
}
