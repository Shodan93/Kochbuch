import type { RecipeStatus } from '../types'

/** Mappt einen Status auf CSS-Klasse + Label für die Anzeige. */
export const STATUS_META: Record<RecipeStatus, { cls: string; label: string }> = {
  'Neu importiert': { cls: 'status--new', label: 'Neu importiert' },
  'Muss geprüft werden': { cls: 'status--check', label: 'Muss geprüft werden' },
  'Fertig gespeichert': { cls: 'status--saved', label: 'Fertig gespeichert' },
  'Schon gekocht': { cls: 'status--cooked', label: 'Schon gekocht' },
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} Min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m === 0 ? `${h} Std` : `${h} Std ${m} Min`
}

/** Zutat schön darstellen (Detailseite). */
export function formatIngredient(amount: number | null, unit: string): string {
  if (amount === null) return 'nach Bedarf'
  const a = Number.isInteger(amount) ? String(amount) : String(amount).replace('.', ',')
  return unit ? `${a} ${unit}` : a
}
