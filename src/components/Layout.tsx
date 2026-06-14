import { useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'

const NAV = [
  { to: '/', label: 'Dashboard', icon: '◆', end: true },
  { to: '/rezepte', label: 'Rezepte', icon: '❦', end: false },
  { to: '/hinzufuegen', label: 'Rezept hinzufügen', icon: '＋', end: false },
  { to: '/einkaufsliste', label: 'Einkaufsliste', icon: '🛒', end: false },
  { to: '/wochenplan', label: 'Wochenplan', icon: '🗓', end: false },
  { to: '/einstellungen', label: 'Einstellungen', icon: '⚙', end: false },
]

export function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { shoppingList } = useApp()

  const openCount = shoppingList.filter((i) => !i.checked && !i.haveAtHome).length

  return (
    <div className="app-shell">
      <aside className={`sidebar${open ? ' open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">❦</div>
          <div className="brand-text">
            <h1>Gourmet</h1>
            <span>Archive</span>
          </div>
        </div>

        <nav onClick={() => setOpen(false)}>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-ic">{item.icon}</span>
              {item.label}
              {item.to === '/einkaufsliste' && openCount > 0 && (
                <span className="nav-badge">{openCount}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          Prototyp · Demo-Daten<br />
          Dark Gourmet Archive
        </div>
      </aside>

      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="main">
        <header className="topbar">
          <div className="brand-mark">❦</div>
          <strong style={{ fontFamily: 'var(--font-serif)', fontSize: 18 }}>
            Gourmet Archive
          </strong>
          <button
            className="burger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menü"
          >
            ☰
          </button>
        </header>

        {/* key auf Location → Scroll-Reset bei Navigation */}
        <main className="content" key={location.pathname}>
          {children}
        </main>
      </div>
    </div>
  )
}
