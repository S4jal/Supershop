import { Link } from 'react-router-dom'
import { useCategories } from '../hooks/useCategories'

export default function CategoryBar() {
  const { categories, loading } = useCategories()

  if (loading) return null

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
          <Link
            to="/products"
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 transition shrink-0 min-w-[72px] group"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 transition-transform group-hover:scale-110">
              <span className="text-lg">🛒</span>
            </div>
            <span className="text-[11px] text-gray-600 font-medium text-center whitespace-nowrap">All Products</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.slug}`}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-50 transition shrink-0 min-w-[72px] group"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: cat.color + '15' }}
              >
                <span className="text-lg">{cat.icon}</span>
              </div>
              <span className="text-[11px] text-gray-600 font-medium text-center whitespace-nowrap">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
