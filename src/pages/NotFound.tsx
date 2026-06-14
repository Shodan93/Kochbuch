import { Link } from 'react-router-dom'

export function NotFound() {
  return (
    <div className="empty">
      <div className="e-ic">🍂</div>
      <h3>Seite nicht gefunden</h3>
      <p>Diese Seite gibt es im Archiv nicht.</p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: 16 }}>
        Zum Dashboard
      </Link>
    </div>
  )
}
