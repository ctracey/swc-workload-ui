const VIEWS = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <path d="M3 11L12 4L21 11"/>
        <path d="M5 11V20H19V11"/>
        <path d="M3 20H21"/>
        <rect x="10" y="13" width="4" height="7" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'radar',
    label: 'Radar',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <circle cx="12" cy="12" r="9"/>
        <path d="M12 3V21" opacity="0.45"/>
        <path d="M3 12H21" opacity="0.45"/>
        <path d="M12 12L12 3A9 9 0 0 1 18.36 5.64Z" fill="currentColor" fillOpacity="0.2" stroke="none"/>
        <path d="M12 12L18.36 5.64" stroke="currentColor"/>
        <rect x="14.5" y="7" width="2" height="2" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'stack',
    label: 'Stack',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <rect x="4" y="5" width="16" height="3.4" fill="currentColor" stroke="none"/>
        <rect x="4" y="10.3" width="16" height="3.4" fill="currentColor" stroke="none"/>
        <rect x="4" y="15.6" width="16" height="3.4" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About SWC',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
        <rect x="4" y="4" width="16" height="16"/>
        <rect x="11" y="8" width="2" height="2" fill="currentColor" stroke="none"/>
        <rect x="11" y="11.5" width="2" height="5.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
]

export default function NavRail({ view, onView }) {
  return (
    <nav className="navrail" aria-label="Main navigation">
      {VIEWS.map(({ id, label, icon }) => (
        <button
          key={id}
          className={`navbtn${view === id ? ' active' : ''}`}
          onClick={() => onView(id)}
          title={label}
          aria-label={label}
          aria-current={view === id ? 'page' : undefined}
        >
          {icon}
        </button>
      ))}
    </nav>
  )
}
