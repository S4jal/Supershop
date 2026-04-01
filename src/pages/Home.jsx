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
            { name: 'Fresh Fruits', emoji: '🍎🍌🥭', color: 'from-green-400 to-emerald-600', cat: 'fruits' },
            { name: 'Fish & Seafood', emoji: '🐟🦐', color: 'from-blue-400 to-cyan-600', cat: 'fish' },
            { name: 'Meat & Poultry', emoji: '🍗🥩', color: 'from-red-400 to-rose-600', cat: 'meat' },
            { name: 'Dairy & Eggs', emoji: '🥛🧀🥚', color: 'from-amber-400 to-yellow-600', cat: 'dairy' },
          ].map((c, i) => (
            <a
              key={i}
              href={`/products?category=${c.cat}`}
              className={`bg-gradient-to-br ${c.color} rounded-xl p-5 text-white hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <div className="text-3xl mb-2">{c.emoji}</div>
              <h3 className="font-semibold">{c.name}</h3>
              <p className="text-sm text-white/80 mt-1">Shop now →</p>
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
