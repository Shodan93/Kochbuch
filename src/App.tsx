import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Recipes } from './pages/Recipes'
import { RecipeDetail } from './pages/RecipeDetail'
import { AddRecipe } from './pages/AddRecipe'
import { ShoppingList } from './pages/ShoppingList'
import { WeekPlan } from './pages/WeekPlan'
import { Settings } from './pages/Settings'
import { NotFound } from './pages/NotFound'

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rezepte" element={<Recipes />} />
        <Route path="/rezept/:id" element={<RecipeDetail />} />
        <Route path="/hinzufuegen" element={<AddRecipe />} />
        <Route path="/einkaufsliste" element={<ShoppingList />} />
        <Route path="/wochenplan" element={<WeekPlan />} />
        <Route path="/einstellungen" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
