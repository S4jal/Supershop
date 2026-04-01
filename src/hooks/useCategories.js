import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const localCategories = [
  { id: 1, name: 'Rice & Flour', slug: 'rice', icon: '🍚', color: '#f59e0b', sort_order: 1 },
  { id: 2, name: 'Dal & Pulses', slug: 'dal', icon: '🫘', color: '#d97706', sort_order: 2 },
  { id: 3, name: 'Oil & Ghee', slug: 'oil', icon: '🫗', color: '#eab308', sort_order: 3 },
  { id: 4, name: 'Spices', slug: 'spices', icon: '🌶️', color: '#ef4444', sort_order: 4 },
  { id: 5, name: 'Dairy', slug: 'dairy', icon: '🥛', color: '#3b82f6', sort_order: 5 },
  { id: 6, name: 'Fruits', slug: 'fruits', icon: '🍎', color: '#22c55e', sort_order: 6 },
  { id: 7, name: 'Vegetables', slug: 'vegetables', icon: '🥕', color: '#65a30d', sort_order: 7 },
  { id: 8, name: 'Snacks', slug: 'snacks', icon: '🍪', color: '#f97316', sort_order: 8 },
  { id: 9, name: 'Beverages', slug: 'beverages', icon: '🥤', color: '#0ea5e9', sort_order: 9 },
  { id: 10, name: 'Meat & Poultry', slug: 'meat', icon: '🍗', color: '#dc2626', sort_order: 10 },
  { id: 11, name: 'Fish & Seafood', slug: 'fish', icon: '🐟', color: '#0284c7', sort_order: 11 },
  { id: 12, name: 'Personal Care', slug: 'personal', icon: '🧼', color: '#8b5cf6', sort_order: 12 },
  { id: 13, name: 'Baby Care', slug: 'baby', icon: '👶', color: '#ec4899', sort_order: 13 },
]

export function useCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('categories').select('*').order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setCategories(data)
        } else {
          setCategories(localCategories)
        }
        setLoading(false)
      })
  }, [])

  return { categories, loading }
}
