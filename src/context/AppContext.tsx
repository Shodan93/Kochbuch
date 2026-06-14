import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Recipe, ShoppingCategory, ShoppingItem } from '../types'
import { DEMO_RECIPES } from '../data/recipes'
import { buildShoppingList } from '../utils/shoppingList'
import { categorizeIngredient } from '../utils/categorize'

interface AppState {
  recipes: Recipe[]
  selectedIds: string[]
  shoppingList: ShoppingItem[]

  // Rezept-Aktionen
  toggleSelect: (id: string) => void
  clearSelection: () => void
  toggleFavorite: (id: string) => void
  addRecipe: (recipe: Recipe) => void

  // Einkaufslisten-Aktionen
  createListFromRecipes: (recipeIds: string[]) => number
  addRecipesToList: (recipeIds: string[]) => number
  toggleChecked: (itemId: string) => void
  toggleHaveAtHome: (itemId: string) => void
  removeItem: (itemId: string) => void
  addManualItem: (name: string, amount: number | null, unit: string) => void
  clearList: () => void
}

const AppContext = createContext<AppState | null>(null)

/** Führt eine frisch gebaute Liste mit der bestehenden Liste zusammen. */
function mergeIntoExisting(
  existing: ShoppingItem[],
  fresh: ShoppingItem[],
): ShoppingItem[] {
  const byName = new Map(existing.map((i) => [i.name.toLowerCase(), i]))
  const result = [...existing]
  for (const item of fresh) {
    const key = item.name.toLowerCase()
    if (byName.has(key)) {
      // Existiert bereits – Quellen ergänzen, "bitte prüfen" markieren,
      // damit die Mengen vom Nutzer kontrolliert werden.
      const current = byName.get(key)!
      current.fromRecipes = [...new Set([...current.fromRecipes, ...item.fromRecipes])]
      current.quantities = [...current.quantities, ...item.quantities]
      current.needsCheck = true
    } else {
      result.push(item)
      byName.set(key, item)
    }
  }
  return result
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(DEMO_RECIPES)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([])

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }, [])

  const clearSelection = useCallback(() => setSelectedIds([]), [])

  const toggleFavorite = useCallback((id: string) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
    )
  }, [])

  const addRecipe = useCallback((recipe: Recipe) => {
    setRecipes((prev) => [recipe, ...prev])
  }, [])

  const createListFromRecipes = useCallback(
    (recipeIds: string[]): number => {
      const selected = recipes.filter((r) => recipeIds.includes(r.id))
      const list = buildShoppingList(selected)
      setShoppingList(list)
      return list.length
    },
    [recipes],
  )

  const addRecipesToList = useCallback(
    (recipeIds: string[]): number => {
      const selected = recipes.filter((r) => recipeIds.includes(r.id))
      const fresh = buildShoppingList(selected)
      setShoppingList((prev) => mergeIntoExisting(prev, fresh))
      return fresh.length
    },
    [recipes],
  )

  const toggleChecked = useCallback((itemId: string) => {
    setShoppingList((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i)),
    )
  }, [])

  const toggleHaveAtHome = useCallback((itemId: string) => {
    setShoppingList((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, haveAtHome: !i.haveAtHome } : i)),
    )
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setShoppingList((prev) => prev.filter((i) => i.id !== itemId))
  }, [])

  const addManualItem = useCallback(
    (name: string, amount: number | null, unit: string) => {
      const category: ShoppingCategory = categorizeIngredient(name)
      setShoppingList((prev) => [
        ...prev,
        {
          id: `manual-${Date.now()}`,
          name: name.trim(),
          category,
          quantities: [{ amount, unit }],
          fromRecipes: [],
          checked: false,
          haveAtHome: false,
          needsCheck: false,
          manual: true,
        },
      ])
    },
    [],
  )

  const clearList = useCallback(() => setShoppingList([]), [])

  const value = useMemo<AppState>(
    () => ({
      recipes,
      selectedIds,
      shoppingList,
      toggleSelect,
      clearSelection,
      toggleFavorite,
      addRecipe,
      createListFromRecipes,
      addRecipesToList,
      toggleChecked,
      toggleHaveAtHome,
      removeItem,
      addManualItem,
      clearList,
    }),
    [
      recipes,
      selectedIds,
      shoppingList,
      toggleSelect,
      clearSelection,
      toggleFavorite,
      addRecipe,
      createListFromRecipes,
      addRecipesToList,
      toggleChecked,
      toggleHaveAtHome,
      removeItem,
      addManualItem,
      clearList,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
