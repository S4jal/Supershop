import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'
import ProductCard from './ProductCard'

export default function ProductSection({ title, products, linkTo, linkText = 'View All' }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="flex items-center gap-1 text-primary-600 text-sm font-medium hover:text-primary-700 transition">
            {linkText} <FiArrowRight size={16} />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
