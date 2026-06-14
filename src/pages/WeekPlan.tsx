const DAYS = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
const SLOTS = ['Mittag', 'Abend']

export function WeekPlan() {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Planung</div>
        <h2>Wochenplan</h2>
        <p>Plane deine Woche und erzeuge später daraus die Einkaufsliste. (Platzhalter)</p>
      </div>

      <div className="proto-banner">
        <span>✦</span> Platzhalter-Ansicht · die volle Planungs-Logik folgt in einer
        späteren Version.
      </div>

      <div className="week-grid">
        {DAYS.map((day) => (
          <div className="card day-col" key={day}>
            <h4>{day}</h4>
            {SLOTS.map((slot) => (
              <div className="slot" key={slot}>
                <div className="slot-label">{slot}</div>
                ＋ Rezept zuweisen
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
