// ---------------------------------------------------------------------------
// Domain types for the Gourmet Archive prototype
// ---------------------------------------------------------------------------

/** Kochkategorie eines Rezeptes (Gericht-Art). */
export type RecipeCategory =
  | 'Vorspeise'
  | 'Hauptgericht'
  | 'Beilage'
  | 'Dessert'
  | 'Backen'
  | 'Frühstück'
  | 'Suppe'
  | 'Salat'
  | 'Getränk'

/** Woher das Rezept stammt. */
export type RecipeSource =
  | 'Kochbuch'
  | 'Loses Blatt'
  | 'Handschrift'
  | 'Screenshot'
  | 'Eigenes Rezept'

/** Bearbeitungsstatus eines Rezeptes. */
export type RecipeStatus =
  | 'Neu importiert'
  | 'Muss geprüft werden'
  | 'Fertig gespeichert'
  | 'Schon gekocht'

/** Einkaufskategorie (Supermarkt-Gang) einer Zutat. */
export type ShoppingCategory =
  | 'Obst und Gemüse'
  | 'Fleisch und Fisch'
  | 'Milchprodukte'
  | 'Brot und Backwaren'
  | 'Trockenwaren'
  | 'Gewürze und Öl'
  | 'Konserven und Gläser'
  | 'Tiefkühlprodukte'
  | 'Getränke'
  | 'Sonstiges'

/** Eine Zutat innerhalb eines Rezeptes. */
export interface Ingredient {
  name: string
  /** Menge als Zahl, falls bekannt (z. B. 200). `null` = "nach Geschmack". */
  amount: number | null
  /** Einheit (z. B. "g", "ml", "Stück", "EL"). Leerer String = ohne Einheit. */
  unit: string
}

export interface Recipe {
  id: string
  name: string
  category: RecipeCategory
  /** Emoji als Platzhalter-Visual (Prototyp ohne echte Bilder). */
  emoji: string
  /** Platzhalter-"Originalfotos": je Eintrag ein Emoji + Label. */
  originalPhotos: string[]
  /** Optionales, schön aufbereitetes Rezeptbild. */
  recipeImage?: string
  servings: number
  /** Zubereitungszeit in Minuten. */
  timeMinutes: number
  ingredients: Ingredient[]
  steps: string[]
  notes: string
  tags: string[]
  source: RecipeSource
  status: RecipeStatus
  favorite: boolean
  /** ISO-Datum, wann das Rezept hinzugefügt wurde. */
  addedAt: string
}

/** Ein Eintrag in der zusammengeführten Einkaufsliste. */
export interface ShoppingItem {
  id: string
  name: string
  category: ShoppingCategory
  /** Zusammengeführte Mengen (mehrere, falls Einheiten inkompatibel sind). */
  quantities: { amount: number | null; unit: string }[]
  /** Aus welchen Rezepten die Zutat stammt. */
  fromRecipes: string[]
  checked: boolean
  /** "habe ich zuhause" */
  haveAtHome: boolean
  /** Mengen konnten nicht sicher zusammengeführt werden. */
  needsCheck: boolean
  /** Manuell hinzugefügt (nicht aus einem Rezept). */
  manual: boolean
}
