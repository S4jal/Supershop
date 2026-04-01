import { Link } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount } = useCart()

  const deliveryCharge = cartTotal >= 500 ? 0 : 50
  const finalTotal = cartTotal + deliveryCharge

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-8xl block mb-4">🛒</span>
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Looks like you haven't added anything yet</p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-full mt-6 hover:bg-primary-700 transition"
        >
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Shopping Cart ({cartCount} items)</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-500 hover:text-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map(item => {
            const discountedPrice = item.discount > 0
              ? Math.round(item.price * (1 - item.discount / 100))
              : item.price

            return (
              <div key={item.id} className="bg-white rounded-xl border p-4 flex gap-4">
                <Link to={`/product/${item.id}`} className="text-4xl shrink-0 w-16 h-16 flex items-center justify-center bg-gray-50 rounded-lg">
                  {item.image}
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.id}`} className="font-medium text-gray-800 hover:text-primary-600 line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">per {item.unit}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="font-semibold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center hover:bg-primary-700"
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-800">৳{discountedPrice * item.quantity}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-xl border p-5 sticky top-32">
            <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal ({cartCount} items)</span>
                <span className="font-medium">৳{Math.round(cartTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery Charge</span>
                <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE' : `৳${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-primary-600 bg-primary-50 p-2 rounded-lg">
                  Add ৳{Math.round(500 - cartTotal)} more for free delivery!
                </p>
              )}
              <div className="border-t pt-3 flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-lg text-gray-800">৳{Math.round(finalTotal)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full mt-5 flex items-center justify-center gap-2 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full mt-2 flex items-center justify-center gap-1 text-sm text-primary-600 py-2 hover:text-primary-700"
            >
              <FiArrowLeft size={14} /> Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
