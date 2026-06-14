import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { RecipeCard } from '../components/RecipeCard'
import type { RecipeCategory, RecipeStatus } from '../types'

const STATUSES: RecipeStatus[] = [
  'Neu importiert',
  'Muss geprüft werden',
  'Fertig gespeichert',
  'Schon gekocht',
]

export function Recipes() {
  const navigate = useNavigate()
  const { recipes, selectedIds, clearSelection, createListFromRecipes } = useApp()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<RecipeCategory | 'all'>('all')
  const [tag, setTag] = useState<string>('all')
  const [status, setStatus] = useState<RecipeStatus | 'all'>('all')
  const [favOnly, setFavOnly] = useState(false)

  const categories = useMemo(
    () => [...new Set(recipes.map((r) => r.category))].sort(),
    [recipes],
  )
  const tags = useMemo(
    () => [...new Set(recipes.flatMap((r) => r.tags))].sort(),
    [recipes],
  )

  const filtered = recipes.filter((r) => {
    if (favOnly && !r.favorite) return false
    if (category !== 'all' && r.category !== category) return false
    if (status !== 'all' && r.status !== status) return false
    if (tag !== 'all' && !r.tags.includes(tag)) return false
    if (query.trim()) {
      const q = query.toLowerCase()
      const hay = [r.name, r.category, ...r.tags, ...r.ingredients.map((i) => i.name)]
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const handleCreateList = () => {
    createListFromRecipes(selectedIds)
    navigate('/einkaufsliste')
  }

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Sammlung</div>
        <h2>Rezepte</h2>
        <p>{recipes.length} Rezepte im Archiv · wähle mehrere für die Einkaufsliste aus.</p>
      </div>

      <div className="toolbar">
        <div className="search">
          <span className="s-ic">⌕</span>
          <input
            placeholder="Suche nach Name, Zutat oder Tag…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="filter"
          value={category}
          onChange={(e) => setCategory(e.target.value as RecipeCategory | 'all')}
        >
          <option value="all">Alle Kategorien</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          className="filter"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          <option value="all">Alle Tags</option>
          {tags.map((t) => (
            <option key={t} value={t}>#{t}</option>
          ))}
        </select>
        <select
          className="filter"
          value={status}
          onChange={(e) => setStatus(e.target.value as RecipeStatus | 'all')}
        >
          <option value="all">Alle Status</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          className={`toggle-pill${favOnly ? ' on' : ''}`}
          onClick={() => setFavOnly((v) => !v)}
        >
          ★ Nur Favoriten
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="e-ic">🍽</div>
          <h3>Keine Rezepte gefunden</h3>
          <p>Passe Suche oder Filter an.</p>
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <div className="selbar">
          <span>
            <strong>{selectedIds.length}</strong> Rezept(e) ausgewählt
          </span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
              Auswahl löschen
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleCreateList}>
              🛒 Einkaufsliste aus Auswahl erstellen
            </button>
          </div>
        </div>
      )}
    </>
  )
}
