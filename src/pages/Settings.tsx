import { useState } from 'react'

const ROWS = [
  { ic: '🌙', title: 'Dunkles Design', desc: 'Dark Gourmet Archive – aktuell aktiv.', on: true },
  { ic: '🍽', title: 'Standard-Portionen', desc: 'Vorgabe für neue Rezepte.', on: false },
  { ic: '🔔', title: 'Erinnerungen', desc: 'Hinweis bei ungeprüften Rezepten.', on: true },
  { ic: '📷', title: 'Auto-Analyse beim Import', desc: 'Erkennung direkt nach dem Upload starten.', on: true },
  { ic: '☁️', title: 'Synchronisierung', desc: 'Cloud-Backup (folgt mit echtem Login).', on: false },
]

export function Settings() {
  const [states, setStates] = useState(ROWS.map((r) => r.on))

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Konfiguration</div>
        <h2>Einstellungen</h2>
        <p>Passe das Archiv an. (Platzhalter – ohne echte Speicherung)</p>
      </div>

      <div className="proto-banner">
        <span>✦</span> Platzhalter-Seite · Einstellungen werden im Prototyp nicht
        dauerhaft gespeichert.
      </div>

      <div className="card panel">
        <div className="settings-list">
          {ROWS.map((row, i) => (
            <div className="setting-row" key={row.title}>
              <div className="sr-ic">{row.ic}</div>
              <div className="sr-main">
                <h4>{row.title}</h4>
                <p>{row.desc}</p>
              </div>
              <button
                className={`switch${states[i] ? ' on' : ''}`}
                onClick={() =>
                  setStates((prev) => prev.map((s, idx) => (idx === i ? !s : s)))
                }
                aria-label={row.title}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card panel" style={{ marginTop: 18 }}>
        <h4>Über</h4>
        <div className="meta-row">
          <span>App</span>
          <span>Gourmet Archive</span>
        </div>
        <div className="meta-row">
          <span>Version</span>
          <span>0.1.0 · Prototyp</span>
        </div>
        <div className="meta-row">
          <span>Daten</span>
          <span>Demo · Reset bei Neuladen</span>
        </div>
      </div>
    </>
  )
}
