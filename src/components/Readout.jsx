export default function Readout({ label, value }) {
  return (
    <div className="ro">
      <span>{label}</span>
      <b>{value}</b>
    </div>
  )
}
