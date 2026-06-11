import Readout from './Readout.jsx'
import UtcClock from './UtcClock.jsx'
import OnlineIndicator from './OnlineIndicator.jsx'

export default function Readouts({ path, queueCount }) {
  return (
    <div className="readouts">
      <Readout label="PATH" value={path ?? '—'} />
      <Readout label="QUEUE" value={queueCount ?? '—'} />
      <UtcClock />
      <OnlineIndicator />
    </div>
  )
}
