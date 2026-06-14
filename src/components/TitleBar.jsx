import Title from './Title.jsx'
import Readouts from './Readouts.jsx'

export default function TitleBar({ path, queueCount, onHome }) {
  return (
    <header className="rail">
      <div className="brand">
        <a className="homelink" href={window.location.pathname} title="Home" onClick={(e) => { e.preventDefault(); onHome?.() }}>
          <Title text="SWC" highlight="WORKLOAD" />
        </a>
      </div>
      <Readouts path={path} queueCount={queueCount} />
    </header>
  )
}
