import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { STATUS_META, formatTime, formatIngredient } from '../lib/display'

export function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { recipes, addRecipesToList, toggleFavorite } = useApp()
  const [added, setAdded] = useState(false)

  const recipe = recipes.find((r) => r.id === id)

  if (!recipe) {
    return (
      <div className="empty">
        <div className="e-ic">🔍</div>
        <h3>Rezept nicht gefunden</h3>
        <Link to="/rezepte" className="btn" style={{ marginTop: 16 }}>
          Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const status = STATUS_META[recipe.status]
  const gallery = recipe.originalPhotos.length
    ? recipe.originalPhotos
    : [recipe.emoji]

  const handleAddToList = () => {
    addRecipesToList([recipe.id])
    setAdded(true)
  }

  return (
    <>
      <Link to="/rezepte" className="back-link">
        ← Zurück zu allen Rezepten
      </Link>

      <div className="page-head">
        <div className="eyebrow">{recipe.category}</div>
        <h2>{recipe.name}</h2>
        <p>
          {formatTime(recipe.timeMinutes)} · {recipe.servings} Portionen · Quelle:{' '}
          {recipe.source}
        </p>
      </div>

      <div className="detail-grid">
        <div>
          <div className="gallery">
            <div className="orig-label">ORIGINALFOTOS (QUELLE)</div>
            <div className="gallery-main">{recipe.recipeImage ?? gallery[0]}</div>
            <div className="gallery-thumbs">
              {gallery.map((g, i) => (
                <div className="gt" key={i}>{g}</div>
              ))}
            </div>
          </div>

          <div className="panel card" style={{ marginTop: 24 }}>
            <h4>Zubereitungsschritte</h4>
            <ol className="step-list">
              {recipe.steps.map((s, i) => (
                <li key={i}>
                  <span className="step-num">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          {recipe.notes && (
            <div style={{ marginTop: 20 }}>
              <div className="orig-label" style={{ marginBottom: 8 }}>
                NOTIZEN
              </div>
              <div className="notes-box">„{recipe.notes}"</div>
            </div>
          )}
        </div>

        <aside className="detail-side">
          <div className="panel card">
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={handleAddToList}
              >
                {added ? '✓ Hinzugefügt' : '🛒 Zur Einkaufsliste'}
              </button>
              <button
                className="btn"
                onClick={() => toggleFavorite(recipe.id)}
                aria-label="Favorit"
              >
                {recipe.favorite ? '★' : '☆'}
              </button>
            </div>
            <button
              className="btn btn-ghost"
              style={{ width: '100%' }}
              onClick={() => navigate('/hinzufuegen')}
            >
              ✎ Bearbeiten
            </button>
            {added && (
              <Link
                to="/einkaufsliste"
                className="btn btn-ghost btn-sm"
                style={{ width: '100%', marginTop: 8 }}
              >
                Zur Einkaufsliste →
              </Link>
            )}
          </div>

          <div className="panel card">
            <h4>Zutaten · {recipe.servings} Portionen</h4>
            <ul className="ingredient-list">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>
                  <span>{ing.name}</span>
                  <span className="qty">{formatIngredient(ing.amount, ing.unit)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel card">
            <h4>Details</h4>
            <div className="meta-row">
              <span>Status</span>
              <span className="status-pill">
                <span className={`status-dot ${status.cls}`} />
                {status.label}
              </span>
            </div>
            <div className="meta-row">
              <span>Quelle</span>
              <span>{recipe.source}</span>
            </div>
            <div className="meta-row">
              <span>Kategorie</span>
              <span>{recipe.category}</span>
            </div>
            <div className="meta-row">
              <span>Hinzugefügt</span>
              <span>{recipe.addedAt}</span>
            </div>
          </div>

          {recipe.tags.length > 0 && (
            <div className="panel card">
              <h4>Tags</h4>
              <div className="tag-row">
                {recipe.tags.map((t) => (
                  <span key={t} className="chip">#{t}</span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
