import { useNavigate } from 'react-router-dom'
import type { Recipe } from '../types'
import { STATUS_META, formatTime } from '../lib/display'
import { useApp } from '../context/AppContext'

interface Props {
  recipe: Recipe
  selectable?: boolean
}

export function RecipeCard({ recipe, selectable = true }: Props) {
  const navigate = useNavigate()
  const { selectedIds, toggleSelect, toggleFavorite } = useApp()
  const selected = selectedIds.includes(recipe.id)
  const status = STATUS_META[recipe.status]

  return (
    <article
      className={`card recipe-card${selected ? ' selected' : ''}`}
      onClick={() => navigate(`/rezept/${recipe.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="thumb">
        <span aria-hidden>{recipe.emoji}</span>
        {selectable && (
          <button
            className={`thumb-select${selected ? ' on' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              toggleSelect(recipe.id)
            }}
            aria-label="Für Einkaufsliste auswählen"
            title="Für Einkaufsliste auswählen"
          >
            {selected ? '✓' : ''}
          </button>
        )}
        <button
          className="thumb-fav"
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(recipe.id)
          }}
          aria-label="Favorit"
        >
          {recipe.favorite ? '★' : '☆'}
        </button>
      </div>

      <div className="recipe-body">
        <div className="tag-row">
          <span className="chip amber">{recipe.category}</span>
        </div>
        <h3 className="recipe-title">{recipe.name}</h3>
        <div className="recipe-meta">
          <span>🕒 {formatTime(recipe.timeMinutes)}</span>
          <span>🍽 {recipe.servings} Port.</span>
        </div>
        <div className="recipe-foot">
          <span className="status-pill">
            <span className={`status-dot ${status.cls}`} />
            {status.label}
          </span>
          <span className="chip">{recipe.source}</span>
        </div>
      </div>
    </article>
  )
}
