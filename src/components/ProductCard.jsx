import { Link } from 'react-router-dom'
import { FiPlus, FiMinus } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { cart, addToCart, updateQuantity } = useCart()
  const cartItem = cart.find(item => item.id === product.id)
  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const displayImage = product.image_url || product.emoji || product.image || '📦'
  const isUrl = typeof displayImage === 'string' && displayImage.startsWith('http')

  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col">
      {/* Image area */}
      <Link to={`/product/${product.id}`} className="relative p-4 pb-2 flex items-center justify-center min-h-[100px]">
        {isUrl ? (
          <img src={displayImage} alt={product.name} className="h-24 w-24 object-contain group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <span className="text-6xl group-hover:scale-110 transition-transform duration-300">{displayImage}</span>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            -{product.discount}%
          </span>
        )}
        {product.stock < 10 && (
          <span className="absolute top-2 right-2 bg-orange-100 text-orange-600 text-[10px] font-medium px-2 py-0.5 rounded-full">
            Low Stock
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-3 pt-1 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-primary-600 transition leading-snug">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mt-0.5">per {product.unit}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`text-xs ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
            ))}
          </div>
          <span className="text-[10px] text-gray-400">{product.rating}</span>
        </div>

        {/* Price + Cart */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-gray-800">৳{discountedPrice}</span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through ml-1.5">৳{product.price}</span>
            )}
          </div>

          {cartItem ? (
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <FiMinus size={14} />
              </button>
              <span className="w-7 text-center text-sm font-semibold">{cartItem.quantity}</span>
              <button
                onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition"
              >
                <FiPlus size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product)}
              className="px-3 py-1.5 bg-primary-600 text-white text-xs font-medium rounded-full hover:bg-primary-700 transition flex items-center gap-1"
            >
              <FiPlus size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
