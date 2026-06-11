import Title from './Title.jsx'
import Readouts from './Readouts.jsx'

export default function TitleBar({ path, queueCount }) {
  return (
    <header className="rail">
      <div className="brand">
        <Title text="SWC" highlight="WORKLOAD" />
      </div>
      <Readouts path={path} queueCount={queueCount} />
    </header>
  )
}
