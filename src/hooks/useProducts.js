import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ category, search, filter, sort } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProducts()
  }, [category, search, filter, sort])

  async function loadProducts() {
    setLoading(true)
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

    const { data } = await query
    let result = data || []
    if (category && category !== 'all') {
      result = result.filter(p => p.categories !== null)
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
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  return { products, loading }
}

export function useBestSellers() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)')
      .eq('is_active', true).eq('is_bestseller', true).limit(8)
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  return { products, loading }
}

export function useDiscountedProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*, categories(name, slug)')
      .eq('is_active', true).gt('discount', 0).order('discount', { ascending: false }).limit(6)
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  return { products, loading }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase.from('products').select('*, categories(name, slug)').eq('id', id).single()
      .then(({ data }) => { setProduct(data); setLoading(false) })
  }, [id])

  return { product, loading }
}

export function useRelatedProducts(categoryId, excludeId) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    if (!categoryId) return
    supabase.from('products').select('*, categories(name, slug)')
      .eq('category_id', categoryId).eq('is_active', true).neq('id', excludeId).limit(4)
      .then(({ data }) => setProducts(data || []))
  }, [categoryId, excludeId])

  return products
}
