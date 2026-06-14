import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { STATUS_META, formatTime } from '../lib/display'

export function Dashboard() {
  const navigate = useNavigate()
  const { recipes } = useApp()

  const total = recipes.length
  const favorites = recipes.filter((r) => r.favorite)
  const toReview = recipes.filter(
    (r) => r.status === 'Muss geprüft werden' || r.status === 'Neu importiert',
  )
  const recent = [...recipes]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .slice(0, 4)

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Willkommen zurück</div>
        <h2>Dein Rezept-Archiv</h2>
        <p>Sammle, strukturiere und verwalte deine Rezepte an einem edlen Ort.</p>
      </div>

      <div className="proto-banner">
        <span>✦</span>
        Klickbarer Prototyp mit Demo-Daten · kein Login, keine echte OCR/KI, kein
        echter Upload. Der Zustand wird beim Neuladen zurückgesetzt.
      </div>

      <div className="stat-grid">
        <div className="card stat">
          <div className="stat-ic">❦</div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Gespeicherte Rezepte</div>
        </div>
        <div className="card stat">
          <div className="stat-ic">★</div>
          <div className="stat-value">{favorites.length}</div>
          <div className="stat-label">Favoriten</div>
        </div>
        <div className="card stat">
          <div className="stat-ic">🛈</div>
          <div className="stat-value">{toReview.length}</div>
          <div className="stat-label">Zu prüfen</div>
        </div>
        <div className="card stat">
          <div className="stat-ic">🍳</div>
          <div className="stat-value">
            {recipes.filter((r) => r.status === 'Schon gekocht').length}
          </div>
          <div className="stat-label">Schon gekocht</div>
        </div>
      </div>

      <div className="quick-grid">
        <button className="card quick" onClick={() => navigate('/hinzufuegen')}>
          <div className="quick-ic">＋</div>
          <div>
            <h4>Rezept hinzufügen</h4>
            <p>Foto, Screenshot oder Text in ein digitales Rezept verwandeln.</p>
          </div>
        </button>
        <button className="card quick" onClick={() => navigate('/rezepte')}>
          <div className="quick-ic">🛒</div>
          <div>
            <h4>Einkaufsliste erstellen</h4>
            <p>Rezepte auswählen und automatisch eine smarte Liste bauen.</p>
          </div>
        </button>
      </div>

      <div className="section-title">
        <h3>Zuletzt hinzugefügt</h3>
        <Link to="/rezepte">Alle ansehen →</Link>
      </div>
      <div className="list-rows">
        {recent.map((r) => (
          <Link key={r.id} to={`/rezept/${r.id}`} className="card mini-recipe">
            <div className="mini-thumb">{r.emoji}</div>
            <div className="mini-main">
              <h4>{r.name}</h4>
              <p>
                {r.category} · {formatTime(r.timeMinutes)} · {r.source}
              </p>
            </div>
            <span className="status-pill">
              <span className={`status-dot ${STATUS_META[r.status].cls}`} />
              {STATUS_META[r.status].label}
            </span>
          </Link>
        ))}
      </div>

      {toReview.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 34 }}>
            <h3>Muss noch geprüft werden</h3>
          </div>
          <div className="list-rows">
            {toReview.map((r) => (
              <Link key={r.id} to={`/rezept/${r.id}`} className="card mini-recipe">
                <div className="mini-thumb">{r.emoji}</div>
                <div className="mini-main">
                  <h4>{r.name}</h4>
                  <p>{r.source}</p>
                </div>
                <span className="status-pill">
                  <span className={`status-dot ${STATUS_META[r.status].cls}`} />
                  {STATUS_META[r.status].label}
                </span>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  )
}
