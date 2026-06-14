import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { Ingredient, Recipe, RecipeCategory } from '../types'

const SOURCE_TILES = [
  { key: 'Foto', icon: '📷', label: 'Foto aufnehmen' },
  { key: 'Galerie', icon: '🖼', label: 'Mehrere Fotos' },
  { key: 'Screenshot', icon: '📱', label: 'Screenshot' },
  { key: 'Text', icon: '📝', label: 'Text einfügen' },
]

const CATEGORIES: RecipeCategory[] = [
  'Vorspeise', 'Hauptgericht', 'Beilage', 'Dessert', 'Backen',
  'Frühstück', 'Suppe', 'Salat', 'Getränk',
]

// Demo-"Analyse"-Ergebnis (würde später aus OCR + KI kommen).
const DEMO_RESULT = {
  name: 'Toskanische Tomatensuppe',
  category: 'Suppe' as RecipeCategory,
  servings: 4,
  timeMinutes: 30,
  ingredients: [
    { name: 'Passierte Tomaten', amount: 800, unit: 'g' },
    { name: 'Zwiebel', amount: 1, unit: '' },
    { name: 'Knoblauch', amount: 2, unit: 'Zehe' },
    { name: 'Gemüsebrühe', amount: 500, unit: 'ml' },
    { name: 'Sahne', amount: 100, unit: 'ml' },
    { name: 'Basilikum', amount: 1, unit: 'Bund' },
    { name: 'Olivenöl', amount: 2, unit: 'EL' },
    { name: 'Salz', amount: null, unit: '' },
  ] as Ingredient[],
  steps: [
    'Zwiebel und Knoblauch fein hacken und in Olivenöl andünsten.',
    'Passierte Tomaten und Gemüsebrühe zugeben.',
    '15 Minuten köcheln lassen.',
    'Sahne einrühren, mit Salz abschmecken und mit Basilikum servieren.',
  ],
  notes: 'Erkannt aus Screenshot. Bitte Mengen prüfen.',
}

export function AddRecipe() {
  const navigate = useNavigate()
  const { addRecipe } = useApp()

  const [step, setStep] = useState(1)
  const [sources, setSources] = useState<string[]>([])
  const [pastedText, setPastedText] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  // Bearbeitbare Felder (Schritt 3)
  const [name, setName] = useState('')
  const [category, setCategory] = useState<RecipeCategory>('Hauptgericht')
  const [servings, setServings] = useState(4)
  const [timeMinutes, setTimeMinutes] = useState(30)
  const [notes, setNotes] = useState('')
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [steps, setSteps] = useState<string[]>([])

  const toggleSource = (key: string) =>
    setSources((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key],
    )

  const canAnalyze = sources.length > 0 || pastedText.trim().length > 0

  const runAnalysis = () => {
    setStep(2)
    setAnalyzing(true)
    // Simulierte Analyse (~1 Sekunde)
    setTimeout(() => {
      setAnalyzing(false)
      setName(DEMO_RESULT.name)
      setCategory(DEMO_RESULT.category)
      setServings(DEMO_RESULT.servings)
      setTimeMinutes(DEMO_RESULT.timeMinutes)
      setNotes(DEMO_RESULT.notes)
      setIngredients(DEMO_RESULT.ingredients.map((i) => ({ ...i })))
      setSteps([...DEMO_RESULT.steps])
    }, 1100)
  }

  const updateIngredient = (i: number, patch: Partial<Ingredient>) =>
    setIngredients((prev) =>
      prev.map((ing, idx) => (idx === i ? { ...ing, ...patch } : ing)),
    )
  const removeIngredient = (i: number) =>
    setIngredients((prev) => prev.filter((_, idx) => idx !== i))
  const addIngredient = () =>
    setIngredients((prev) => [...prev, { name: '', amount: null, unit: '' }])

  const updateStep = (i: number, val: string) =>
    setSteps((prev) => prev.map((s, idx) => (idx === i ? val : s)))
  const addStep = () => setSteps((prev) => [...prev, ''])
  const removeStep = (i: number) =>
    setSteps((prev) => prev.filter((_, idx) => idx !== i))

  const save = () => {
    const recipe: Recipe = {
      id: `new-${Date.now()}`,
      name: name.trim() || 'Neues Rezept',
      category,
      emoji: '🍲',
      originalPhotos: ['🍲', '📝'],
      servings,
      timeMinutes,
      ingredients: ingredients.filter((i) => i.name.trim()),
      steps: steps.filter((s) => s.trim()),
      notes,
      tags: ['importiert'],
      source: 'Screenshot',
      status: 'Muss geprüft werden',
      favorite: false,
      addedAt: new Date().toISOString().slice(0, 10),
    }
    addRecipe(recipe)
    navigate(`/rezept/${recipe.id}`)
  }

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Neues Rezept</div>
        <h2>Rezept hinzufügen</h2>
        <p>Aus Foto, Screenshot oder Text in drei Schritten ein digitales Rezept.</p>
      </div>

      <div className="steps-head">
        {[
          { n: 1, t: 'Quelle wählen', s: 'Foto oder Text' },
          { n: 2, t: 'Analyse', s: 'Erkennung (Demo)' },
          { n: 3, t: 'Bearbeiten & Speichern', s: 'Feinschliff' },
        ].map((w) => (
          <div
            key={w.n}
            className={`wstep${step === w.n ? ' active' : ''}${step > w.n ? ' done' : ''}`}
          >
            <span className="wstep-num">{step > w.n ? '✓' : w.n}</span>
            <span className="wstep-label">
              {w.t}
              <small>{w.s}</small>
            </span>
          </div>
        ))}
      </div>

      {/* ---------- Schritt 1 ---------- */}
      {step === 1 && (
        <div className="card" style={{ padding: 26 }}>
          <div className="dropzone">
            <div className="dz-ic">📷</div>
            <h4>Foto oder mehrere Fotos hochladen</h4>
            <p>Im Prototyp wird der Upload nur simuliert.</p>
            <button
              className="btn btn-primary"
              onClick={() => toggleSource('Foto')}
            >
              {sources.includes('Foto') ? '✓ Foto ausgewählt' : 'Upload simulieren'}
            </button>
          </div>

          <div className="source-tiles">
            {SOURCE_TILES.map((t) => (
              <button
                key={t.key}
                className={`source-tile${sources.includes(t.key) ? ' added' : ''}`}
                onClick={() => toggleSource(t.key)}
              >
                <span className="st-ic">{t.icon}</span>
                {t.label}
                {sources.includes(t.key) && ' ✓'}
              </button>
            ))}
          </div>

          <div className="field" style={{ marginTop: 22 }}>
            <label>Oder Text einfügen</label>
            <textarea
              placeholder="Rezepttext hier einfügen…"
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
            />
          </div>

          <div className="wizard-nav">
            <span />
            <button
              className="btn btn-primary"
              disabled={!canAnalyze}
              onClick={runAnalysis}
            >
              Analysieren →
            </button>
          </div>
        </div>
      )}

      {/* ---------- Schritt 2 ---------- */}
      {step === 2 && (
        <div className="card" style={{ padding: 26 }}>
          {analyzing ? (
            <div className="analyzing">
              <div className="spinner" />
              <h3>Analyse läuft…</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Zutaten, Mengen und Schritte werden erkannt (Demo).
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ marginBottom: 8 }}>Analyse-Vorschau</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: 0 }}>
                Folgende Daten wurden erkannt. Im nächsten Schritt kannst du alles
                anpassen.
              </p>
              <div className="proto-banner" style={{ marginTop: 16 }}>
                <span>✦</span> {ingredients.length} Zutaten &amp; {steps.length}{' '}
                Schritte erkannt · Kategorie: {category}
              </div>
              <div className="panel" style={{ padding: 0, marginTop: 8 }}>
                <ul className="ingredient-list">
                  {ingredients.map((ing, i) => (
                    <li key={i}>
                      <span>{ing.name}</span>
                      <span className="qty">
                        {ing.amount === null
                          ? 'nach Bedarf'
                          : `${ing.amount} ${ing.unit}`.trim()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="wizard-nav">
                <button className="btn btn-ghost" onClick={() => setStep(1)}>
                  ← Zurück
                </button>
                <button className="btn btn-primary" onClick={() => setStep(3)}>
                  Bearbeiten →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ---------- Schritt 3 ---------- */}
      {step === 3 && (
        <div className="card" style={{ padding: 26 }}>
          <div className="field">
            <label>Rezeptname</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="two-col">
            <div className="field">
              <label>Kategorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RecipeCategory)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Portionen</label>
              <input
                type="number"
                min={1}
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="field">
            <label>Zubereitungszeit (Minuten)</label>
            <input
              type="number"
              min={1}
              value={timeMinutes}
              onChange={(e) => setTimeMinutes(Number(e.target.value))}
            />
          </div>

          <div className="field">
            <label>Zutaten</label>
            {ingredients.map((ing, i) => (
              <div className="ing-edit-row" key={i}>
                <input
                  placeholder="Menge"
                  value={ing.amount ?? ''}
                  onChange={(e) =>
                    updateIngredient(i, {
                      amount: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                />
                <input
                  placeholder="Einheit"
                  value={ing.unit}
                  onChange={(e) => updateIngredient(i, { unit: e.target.value })}
                />
                <input
                  placeholder="Zutat"
                  value={ing.name}
                  onChange={(e) => updateIngredient(i, { name: e.target.value })}
                />
                <button className="icon-btn" onClick={() => removeIngredient(i)}>
                  ✕
                </button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addIngredient}>
              ＋ Zutat
            </button>
          </div>

          <div className="field">
            <label>Zubereitungsschritte</label>
            {steps.map((s, i) => (
              <div
                key={i}
                style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}
              >
                <span className="step-num" style={{ marginTop: 8 }}>{i + 1}</span>
                <textarea
                  style={{ minHeight: 52 }}
                  value={s}
                  onChange={(e) => updateStep(i, e.target.value)}
                />
                <button className="icon-btn" onClick={() => removeStep(i)}>✕</button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addStep}>
              ＋ Schritt
            </button>
          </div>

          <div className="field">
            <label>Notizen</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>

          <div className="wizard-nav">
            <button className="btn btn-ghost" onClick={() => setStep(2)}>
              ← Zurück
            </button>
            <button className="btn btn-primary" onClick={save}>
              ✓ Rezept speichern
            </button>
          </div>
        </div>
      )}
    </>
  )
}
