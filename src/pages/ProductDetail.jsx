import { useParams, Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi'
import { useProduct, useRelatedProducts } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { product, loading } = useProduct(id)
  const { cart, addToCart, updateQuantity } = useCart()
  const relatedProducts = useRelatedProducts(product?.category_id, product?.id)

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">😕</span>
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/products" className="text-primary-600 mt-4 inline-block">← Back to products</Link>
      </div>
    )
  }

  const cartItem = cart.find(item => item.id === product.id)
  const discountedPrice = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100))
    : product.price

  const displayImage = product.image_url || product.emoji || '📦'
  const isUrl = typeof displayImage === 'string' && displayImage.startsWith('http')

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-primary-600">Products</Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link to={`/products?category=${product.categories.slug}`} className="hover:text-primary-600">{product.categories.name}</Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Product detail */}
      <div className="bg-white rounded-2xl border p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-xl p-8 min-h-[300px]">
            {isUrl ? (
              <img src={displayImage} alt={product.name} className="max-h-[250px] object-contain" />
            ) : (
              <span className="text-[120px] md:text-[180px]">{displayImage}</span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.discount > 0 && (
              <span className="self-start bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full mb-3">
                {product.discount}% OFF
              </span>
            )}

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{product.name}</h1>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating) ? '' : 'text-gray-200'}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} rating</span>
            </div>

            <p className="text-gray-600 mt-4">{product.description}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Unit:</span>
                <span className="font-medium text-gray-800">{product.unit}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Availability:</span>
                <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-500'}`}>
                  {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="mt-6 p-4 bg-primary-50 rounded-xl">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-800">৳{discountedPrice}</span>
                {product.discount > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">৳{product.price}</span>
                    <span className="text-sm text-red-500 font-medium">Save ৳{Math.round(product.price - discountedPrice)}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">per {product.unit} (inclusive of all taxes)</p>
            </div>

            {/* Add to cart */}
            <div className="mt-6 flex items-center gap-4">
              {cartItem ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="text-xl font-bold w-8 text-center">{cartItem.quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}
                    className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700 transition"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product)}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition"
                >
                  <FiShoppingCart size={20} /> Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-5">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
