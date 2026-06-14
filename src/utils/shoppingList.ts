import type { Ingredient, Recipe, ShoppingItem } from '../types'
import { categorizeIngredient } from './categorize'

// ---------------------------------------------------------------------------
// Einheiten-Logik
// ---------------------------------------------------------------------------

type Dimension = 'mass' | 'volume' | 'count'

// Umrechnungsfaktoren auf eine Basiseinheit pro Dimension.
const MASS: Record<string, number> = { mg: 0.001, g: 1, gr: 1, gramm: 1, kg: 1000 }
const VOLUME: Record<string, number> = { ml: 1, cl: 10, dl: 100, l: 1000, liter: 1000 }
// Zähleinheiten, die wie "Stück" zusammengezählt werden dürfen.
const COUNT: Record<string, number> = { '': 1, stück: 1, stk: 1, 'stk.': 1 }

interface UnitInfo {
  dimension: Dimension | null
  factor: number
}

function classifyUnit(unitRaw: string): UnitInfo {
  const u = unitRaw.trim().toLowerCase()
  if (u in MASS) return { dimension: 'mass', factor: MASS[u] }
  if (u in VOLUME) return { dimension: 'volume', factor: VOLUME[u] }
  if (u in COUNT) return { dimension: 'count', factor: COUNT[u] }
  // Alles andere (EL, TL, Prise, Bund, Zehe, Dose, Packung …) ist nicht
  // automatisch umrechenbar und wird nur mit exakt gleicher Einheit gemerged.
  return { dimension: null, factor: 1 }
}

/** Normalisiert einen Zutatennamen für den Abgleich (Klein, getrimmt). */
function normalizeName(name: string): string {
  return name.trim().toLowerCase()
}

// ---------------------------------------------------------------------------
// Mengen schön formatieren
// ---------------------------------------------------------------------------

function round(value: number): number {
  return Math.round(value * 100) / 100
}

/** Formatiert eine Basis-Menge (in g bzw. ml) zurück in eine lesbare Einheit. */
function formatMass(grams: number): { amount: number; unit: string } {
  if (grams >= 1000) return { amount: round(grams / 1000), unit: 'kg' }
  return { amount: round(grams), unit: 'g' }
}

function formatVolume(ml: number): { amount: number; unit: string } {
  if (ml >= 1000) return { amount: round(ml / 1000), unit: 'l' }
  return { amount: round(ml), unit: 'ml' }
}

export function formatQuantity(q: { amount: number | null; unit: string }): string {
  if (q.amount === null) return 'nach Bedarf'
  const amount = Number.isInteger(q.amount)
    ? String(q.amount)
    : String(q.amount).replace('.', ',')
  return q.unit ? `${amount} ${q.unit}` : amount
}

// ---------------------------------------------------------------------------
// Kernlogik: Zutaten aus mehreren Rezepten zu einer Einkaufsliste mergen
// ---------------------------------------------------------------------------

interface Bucket {
  // key: "mass" | "volume" | "count" | literal unit string (z. B. "el")
  dimension: Dimension | string
  baseSum: number
  hasNullAmount: boolean
  // gemerkte Originaleinheit für literal/count Buckets
  displayUnit: string
}

function buildItem(
  name: string,
  ingredients: { ingredient: Ingredient; recipe: string }[],
): ShoppingItem {
  const buckets = new Map<string, Bucket>()
  const fromRecipes = new Set<string>()

  for (const { ingredient, recipe } of ingredients) {
    fromRecipes.add(recipe)
    const info = classifyUnit(ingredient.unit)
    // Schlüssel: umrechenbare Einheiten teilen sich einen Bucket pro Dimension,
    // alles andere bekommt einen eigenen Bucket pro Einheiten-String.
    const key =
      info.dimension === 'mass' || info.dimension === 'volume'
        ? info.dimension
        : `lit:${ingredient.unit.trim().toLowerCase()}`

    let bucket = buckets.get(key)
    if (!bucket) {
      bucket = {
        dimension: info.dimension ?? `lit:${ingredient.unit.trim().toLowerCase()}`,
        baseSum: 0,
        hasNullAmount: false,
        displayUnit: ingredient.unit.trim(),
      }
      buckets.set(key, bucket)
    }

    if (ingredient.amount === null) {
      bucket.hasNullAmount = true
    } else {
      bucket.baseSum += ingredient.amount * info.factor
    }
  }

  // Buckets in lesbare Mengen umwandeln
  const quantities: ShoppingItem['quantities'] = []
  for (const [key, bucket] of buckets) {
    const hasSum = bucket.baseSum > 0
    if (key === 'mass') {
      if (hasSum) quantities.push(formatMass(bucket.baseSum))
      if (bucket.hasNullAmount && !hasSum) quantities.push({ amount: null, unit: 'g' })
    } else if (key === 'volume') {
      if (hasSum) quantities.push(formatVolume(bucket.baseSum))
      if (bucket.hasNullAmount && !hasSum) quantities.push({ amount: null, unit: 'ml' })
    } else {
      // count oder literal unit
      if (hasSum) {
        quantities.push({ amount: round(bucket.baseSum), unit: bucket.displayUnit })
      } else if (bucket.hasNullAmount) {
        quantities.push({ amount: null, unit: bucket.displayUnit })
      }
    }
  }

  // "bitte prüfen", wenn die gleiche Zutat in inkompatiblen Einheiten vorkommt
  // (z. B. 200 g Mehl und 2 EL Mehl) → mehrere Buckets.
  const needsCheck = buckets.size > 1

  return {
    id: `item-${name.replace(/\s+/g, '-')}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    category: categorizeIngredient(name),
    quantities: quantities.length > 0 ? quantities : [{ amount: null, unit: '' }],
    fromRecipes: [...fromRecipes],
    checked: false,
    haveAtHome: false,
    needsCheck,
    manual: false,
  }
}

/**
 * Erzeugt aus den ausgewählten Rezepten eine zusammengeführte Einkaufsliste.
 * Gleiche Zutaten werden zusammengeführt, kompatible Mengen addiert,
 * inkompatible Mengen getrennt gehalten und als "bitte prüfen" markiert.
 */
export function buildShoppingList(recipes: Recipe[]): ShoppingItem[] {
  const grouped = new Map<
    string,
    { displayName: string; entries: { ingredient: Ingredient; recipe: string }[] }
  >()

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const key = normalizeName(ingredient.name)
      let group = grouped.get(key)
      if (!group) {
        group = { displayName: ingredient.name.trim(), entries: [] }
        grouped.set(key, group)
      }
      group.entries.push({ ingredient, recipe: recipe.name })
    }
  }

  const items = [...grouped.values()].map((g) => buildItem(g.displayName, g.entries))
  return items
}
