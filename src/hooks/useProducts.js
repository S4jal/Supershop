import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { products as localProducts, featuredProducts as localFeatured, bestSellers as localBest, discountedProducts as localDiscounted } from '../data/products'

// Map local product category slug to a display name
const categoryNames = {
  rice: 'Rice & Flour', dal: 'Dal & Pulses', oil: 'Oil & Ghee', spices: 'Spices',
  dairy: 'Dairy', fruits: 'Fruits', vegetables: 'Vegetables', snacks: 'Snacks',
  beverages: 'Beverages', meat: 'Meat & Poultry', fish: 'Fish & Seafood',
  personal: 'Personal Care', baby: 'Baby Care',
}

function enrichLocal(p) {
  return {
    ...p,
    emoji: p.image,
    categories: { name: categoryNames[p.category] || p.category, slug: p.category },
    category_id: p.category,
    is_active: true,
  }
}

export function useProducts({ category, search, filter, sort } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [category, search, filter, sort])

  async function loadProducts() {
    setLoading(true)

    // Try Supabase first
    let query = supabase.from('products').select('*, categories(name, slug)').eq('is_active', true)

    if (category && category !== 'all') {
      query = query.eq('categories.slug', category)
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (filter === 'discount') {
      query = query.gt('discount', 0)
    }

    switch (sort) {
      case 'price-low': query = query.order('price', { ascending: true }); break
      case 'price-high': query = query.order('price', { ascending: false }); break
      case 'rating': query = query.order('rating', { ascending: false }); break
      case 'discount': query = query.order('discount', { ascending: false }); break
      default: query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    let result = data || []
    if (category && category !== 'all') {
      result = result.filter(p => p.categories !== null)
    }

    // Fallback to local data if Supabase returns empty or errors
    if (result.length === 0) {
      let local = localProducts.map(enrichLocal)

      if (category && category !== 'all') {
        local = local.filter(p => p.category === category)
      }
      if (search) {
        const q = search.toLowerCase()
        local = local.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
      }
      if (filter === 'discount') {
        local = local.filter(p => p.discount > 0)
      }

      switch (sort) {
        case 'price-low': local.sort((a, b) => a.price - b.price); break
        case 'price-high': local.sort((a, b) => b.price - a.price); break
        case 'rating': local.sort((a, b) => b.rating - a.rating); break
        case 'discount': local.sort((a, b) => b.discount - a.discount); break
      }

      result = local
    }

    setProducts(result)
    setLoading(false)
  }

  return { products, loading, reload: loadProducts }
}

export function useFeaturedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)')
      .eq('is_active', true).eq('is_featured', true).limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data)
        } else {
          setProducts(localFeatured.map(enrichLocal))
        }
        setLoading(false)
      })
  }, [])

  return { products, loading }
}

export function useBestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)')
      .eq('is_active', true).eq('is_bestseller', true).limit(8)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data)
        } else {
          setProducts(localBest.map(enrichLocal))
        }
        setLoading(false)
      })
  }, [])

  return { products, loading }
}

export function useDiscountedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)')
      .eq('is_active', true).gt('discount', 0).order('discount', { ascending: false }).limit(6)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data)
        } else {
          setProducts(localDiscounted.slice(0, 6).map(enrichLocal))
        }
        setLoading(false)
      })
  }, [])

  return { products, loading }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase.from('products').select('*, categories(name, slug)').eq('id', id).single()
      .then(({ data }) => {
        if (data) {
          setProduct(data)
        } else {
          // Fallback to local data
          const numId = Number(id)
          const local = localProducts.find(p => p.id === numId)
          setProduct(local ? enrichLocal(local) : null)
        }
        setLoading(false)
      })
  }, [id])

  return { product, loading }
}

export function useRelatedProducts(categoryId, excludeId) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!categoryId) return
    supabase.from('products').select('*, categories(name, slug)')
      .eq('category_id', categoryId).eq('is_active', true).neq('id', excludeId).limit(4)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setProducts(data)
        } else {
          // Fallback: filter local products by same category slug
          const related = localProducts
            .filter(p => p.category === categoryId && p.id !== Number(excludeId))
            .slice(0, 4)
            .map(enrichLocal)
          setProducts(related)
        }
      })
  }, [categoryId, excludeId])

  return products
}
