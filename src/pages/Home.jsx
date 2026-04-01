import HeroBanner from '../components/HeroBanner'
import CategoryBar from '../components/CategoryBar'
import ProductSection from '../components/ProductSection'
import { useFeaturedProducts, useBestSellers, useDiscountedProducts } from '../hooks/useProducts'

export default function Home() {
  const { products: featured, loading: fl } = useFeaturedProducts()
  const { products: bestSellers, loading: bl } = useBestSellers()
  const { products: discounted, loading: dl } = useDiscountedProducts()

  return (
    <div>
      <HeroBanner />
      <CategoryBar />

      {!dl && discounted.length > 0 && (
        <ProductSection
          title="🔥 Special Offers"
          products={discounted}
          linkTo="/products?filter=discount"
          linkText="See All Offers"
        />
      )}

      {!fl && featured.length > 0 && (
        <ProductSection
          title="⭐ Featured Products"
          products={featured}
          linkTo="/products"
        />
      )}

      {/* Category highlights */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Fresh Fruits', emoji: '🍎🍌🥭', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-800', sub: 'text-green-600', cat: 'fruits' },
            { name: 'Fish & Seafood', emoji: '🐟🦐', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', sub: 'text-blue-600', cat: 'fish' },
            { name: 'Meat & Poultry', emoji: '🍗🥩', bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', sub: 'text-red-600', cat: 'meat' },
            { name: 'Dairy & Eggs', emoji: '🥛🧀🥚', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', sub: 'text-amber-600', cat: 'dairy' },
          ].map((c, i) => (
            <a
              key={i}
              href={`/products?category=${c.cat}`}
              className={`${c.bg} border ${c.border} rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-1`}
            >
              <div className="text-3xl mb-2">{c.emoji}</div>
              <h3 className={`font-semibold ${c.text}`}>{c.name}</h3>
              <p className={`text-sm ${c.sub} mt-1`}>Shop now →</p>
            </a>
          ))}
        </div>
      </section>

      {!bl && bestSellers.length > 0 && (
        <ProductSection
          title="🏆 Best Sellers"
          products={bestSellers}
          linkTo="/products"
        />
      )}
    </div>
  )
}
