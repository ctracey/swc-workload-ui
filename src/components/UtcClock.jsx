import { useEffect, useState } from 'react'
import Readout from './Readout.jsx'

function utcTime() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${p(d.getUTCHours())}:${p(d.getUTCMinutes())}:${p(d.getUTCSeconds())}`
}

export default function UtcClock() {
  const [time, setTime] = useState(utcTime)
  useEffect(() => {
    const id = setInterval(() => setTime(utcTime()), 1000)
    return () => clearInterval(id)
  }, [])
  return <Readout label="UTC" value={time} />
}
