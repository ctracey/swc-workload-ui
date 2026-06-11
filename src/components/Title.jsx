export default function Title({ text, highlight }) {
  return (
    <div className="wordmark">
      {text}
      {highlight && <b>{highlight}</b>}
    </div>
  )
}
