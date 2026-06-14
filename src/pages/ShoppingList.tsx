import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { SHOPPING_CATEGORY_ORDER } from '../utils/categorize'
import { formatQuantity } from '../utils/shoppingList'
import type { ShoppingCategory } from '../types'

export function ShoppingList() {
  const {
    shoppingList,
    toggleChecked,
    toggleHaveAtHome,
    removeItem,
    addManualItem,
    clearList,
  } = useApp()

  const [catFilter, setCatFilter] = useState<ShoppingCategory | 'all'>('all')
  const [newName, setNewName] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [newUnit, setNewUnit] = useState('')

  const grouped = useMemo(() => {
    const map = new Map<ShoppingCategory, typeof shoppingList>()
    for (const item of shoppingList) {
      if (catFilter !== 'all' && item.category !== catFilter) continue
      const arr = map.get(item.category) ?? []
      arr.push(item)
      map.set(item.category, arr)
    }
    return map
  }, [shoppingList, catFilter])

  const usedCategories = useMemo(
    () => [...new Set(shoppingList.map((i) => i.category))],
    [shoppingList],
  )

  const total = shoppingList.length
  const done = shoppingList.filter((i) => i.checked || i.haveAtHome).length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  const handleAdd = () => {
    if (!newName.trim()) return
    addManualItem(
      newName,
      newAmount.trim() === '' ? null : Number(newAmount.replace(',', '.')),
      newUnit.trim(),
    )
    setNewName('')
    setNewAmount('')
    setNewUnit('')
  }

  if (total === 0) {
    return (
      <>
        <div className="page-head">
          <div className="eyebrow">Intelligent</div>
          <h2>Einkaufsliste</h2>
          <p>Zutaten aus mehreren Rezepten – automatisch zusammengeführt und sortiert.</p>
        </div>
        <div className="empty card" style={{ padding: '60px 20px' }}>
          <div className="e-ic">🛒</div>
          <h3>Deine Einkaufsliste ist leer</h3>
          <p>
            Wähle in der Rezept-Übersicht ein oder mehrere Rezepte aus und erstelle
            daraus automatisch eine smarte Einkaufsliste.
          </p>
          <Link to="/rezepte" className="btn btn-primary" style={{ marginTop: 18 }}>
            Rezepte auswählen →
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Intelligent</div>
        <h2>Einkaufsliste</h2>
        <p>
          {total} Positionen · gleiche Zutaten zusammengeführt, Mengen addiert, nach
          Einkaufskategorien sortiert.
        </p>
      </div>

      <div className="progress-wrap">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: 13, whiteSpace: 'nowrap' }}>
          {done}/{total} erledigt
        </span>
        <button className="btn btn-danger btn-sm" onClick={clearList}>
          Liste leeren
        </button>
      </div>

      {/* Manuell ergänzen */}
      <div className="card" style={{ padding: 16, marginBottom: 22 }}>
        <div className="add-item-row">
          <input
            className="input"
            placeholder="Zutat manuell ergänzen…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <input
            className="input"
            placeholder="Menge"
            value={newAmount}
            onChange={(e) => setNewAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <input
            className="input"
            placeholder="Einheit"
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            ＋ Hinzufügen
          </button>
        </div>
      </div>

      {/* Kategorie-Filter */}
      <div className="toolbar">
        <button
          className={`toggle-pill${catFilter === 'all' ? ' on' : ''}`}
          onClick={() => setCatFilter('all')}
        >
          Alle ({total})
        </button>
        {SHOPPING_CATEGORY_ORDER.filter((c) => usedCategories.includes(c)).map((c) => (
          <button
            key={c}
            className={`toggle-pill${catFilter === c ? ' on' : ''}`}
            onClick={() => setCatFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Gruppierte Liste */}
      {SHOPPING_CATEGORY_ORDER.map((cat) => {
        const items = grouped.get(cat)
        if (!items || items.length === 0) return null
        return (
          <section className="shop-cat" key={cat}>
            <div className="shop-cat-head">
              <h4>{cat}</h4>
              <span className="count">{items.length}</span>
            </div>
            {items.map((item) => {
              const isDone = item.checked || item.haveAtHome
              return (
                <div
                  key={item.id}
                  className={`shop-item${item.checked ? ' checked' : ''}${
                    item.haveAtHome ? ' have' : ''
                  }`}
                >
                  <button
                    className={`check-box${item.checked ? ' on' : ''}`}
                    onClick={() => toggleChecked(item.id)}
                    aria-label="Abhaken"
                  >
                    {item.checked ? '✓' : ''}
                  </button>

                  <div className="si-main">
                    <div className="si-name">
                      {item.name}
                      {item.needsCheck && (
                        <span className="badge-check">⚠ bitte prüfen</span>
                      )}
                      {item.haveAtHome && (
                        <span className="badge-check" style={{ color: 'var(--status-saved)', background: 'rgba(127,176,105,0.14)' }}>
                          habe ich zuhause
                        </span>
                      )}
                    </div>
                    <div className="si-sub">
                      {item.manual
                        ? 'Manuell ergänzt'
                        : item.fromRecipes.length > 0
                          ? `aus: ${item.fromRecipes.join(', ')}`
                          : ''}
                    </div>
                  </div>

                  <div className={`si-qty${item.quantities.length > 1 ? ' multi' : ''}`}>
                    {item.quantities.map((q) => formatQuantity(q)).join(' + ')}
                  </div>

                  <div className="si-actions">
                    <button
                      className={`icon-btn${item.haveAtHome ? ' active' : ''}`}
                      onClick={() => toggleHaveAtHome(item.id)}
                      title="Habe ich zuhause"
                      aria-label="Habe ich zuhause"
                      disabled={item.checked}
                      style={isDone && !item.haveAtHome ? { opacity: 0.4 } : undefined}
                    >
                      🏠
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => removeItem(item.id)}
                      title="Entfernen"
                      aria-label="Entfernen"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        )
      })}
    </>
  )
}
