import type { ShoppingCategory } from '../types'

// Keyword-Wörterbuch: ordnet einen Zutatennamen einer Einkaufskategorie zu.
// Reihenfolge spielt keine Rolle – es wird auf Teilstrings geprüft.
const KEYWORDS: Record<ShoppingCategory, string[]> = {
  'Obst und Gemüse': [
    'apfel', 'banane', 'zitrone', 'limette', 'orange', 'beere', 'erdbeer',
    'tomate', 'zwiebel', 'knoblauch', 'karotte', 'möhre', 'kartoffel',
    'paprika', 'salat', 'spinat', 'brokkoli', 'zucchini', 'aubergine',
    'gurke', 'pilz', 'champignon', 'lauch', 'sellerie', 'ingwer', 'chili',
    'petersilie', 'basilikum', 'rucola', 'kürbis', 'mais', 'erbse', 'bohne',
    'avocado', 'rosmarin', 'thymian', 'schnittlauch', 'koriander', 'minze',
  ],
  'Fleisch und Fisch': [
    'hähnchen', 'huhn', 'hühner', 'rind', 'hack', 'schwein', 'speck',
    'schinken', 'wurst', 'lamm', 'pute', 'lachs', 'fisch', 'garnele',
    'thunfisch', 'filet', 'steak', 'salami', 'chorizo', 'pancetta',
  ],
  'Milchprodukte': [
    'milch', 'butter', 'sahne', 'joghurt', 'quark', 'käse', 'parmesan',
    'mozzarella', 'feta', 'frischkäse', 'schmand', 'crème', 'creme fraiche',
    'ricotta', 'mascarpone', 'ei', 'eier',
  ],
  'Brot und Backwaren': [
    'brot', 'brötchen', 'baguette', 'toast', 'semmel', 'lasagneplatte',
    'tortilla', 'wrap', 'fladenbrot', 'croutons',
  ],
  'Trockenwaren': [
    'mehl', 'zucker', 'reis', 'nudel', 'pasta', 'spaghetti', 'penne',
    'haferflocke', 'linse', 'couscous', 'quinoa', 'grieß', 'stärke',
    'backpulver', 'hefe', 'natron', 'vanillezucker', 'kakao', 'schokolade',
    'nuss', 'mandel', 'walnuss', 'haselnuss', 'rosine', 'honig', 'sirup',
    'gnocchi', 'polenta',
  ],
  'Gewürze und Öl': [
    'salz', 'pfeffer', 'öl', 'olivenöl', 'essig', 'paprikapulver', 'curry',
    'kreuzkümmel', 'kümmel', 'muskat', 'zimt', 'oregano', 'gewürz',
    'sojasauce', 'senf', 'vanille', 'lorbeer', 'safran', 'kurkuma',
    'chiliflocken', 'balsamico',
  ],
  'Konserven und Gläser': [
    'dose', 'passierte tomaten', 'tomatenmark', 'kichererbse', 'kidneybohne',
    'mais aus der dose', 'kokosmilch', 'pesto', 'oliven', 'kapern',
    'gemüsebrühe', 'brühe', 'fond', 'marmelade',
  ],
  'Tiefkühlprodukte': [
    'tk-', 'tiefkühl', 'gefroren', 'blätterteig', 'eiscreme',
  ],
  'Getränke': [
    'wasser', 'wein', 'bier', 'saft', 'cola', 'limonade', 'tee', 'kaffee',
    'brühe würfel',
  ],
  'Sonstiges': [],
}

/**
 * Bestimmt anhand des Namens die Einkaufskategorie einer Zutat.
 * Fällt auf "Sonstiges" zurück, wenn nichts passt.
 */
export function categorizeIngredient(name: string): ShoppingCategory {
  const n = name.toLowerCase()
  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    if (category === 'Sonstiges') continue
    if (keywords.some((kw) => n.includes(kw))) {
      return category as ShoppingCategory
    }
  }
  return 'Sonstiges'
}

/** Reihenfolge der Einkaufskategorien in der Liste. */
export const SHOPPING_CATEGORY_ORDER: ShoppingCategory[] = [
  'Obst und Gemüse',
  'Fleisch und Fisch',
  'Milchprodukte',
  'Brot und Backwaren',
  'Trockenwaren',
  'Gewürze und Öl',
  'Konserven und Gläser',
  'Tiefkühlprodukte',
  'Getränke',
  'Sonstiges',
]
