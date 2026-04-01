import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheck } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, cartTotal, cartCount, clearCart } = useCart()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [paymentFields, setPaymentFields] = useState({})
  const [form, setForm] = useState({
    name: '',
    phone: '',
    road: '',
    house: '',
    note: '',
    payment: 'cod',
  })

  useEffect(() => {
    supabase.from('payment_methods').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPaymentMethods(data)
          setForm(prev => ({ ...prev, payment: data[0].key }))
        }
      })
  }, [])

  const deliveryCharge = cartTotal >= 500 ? 0 : 50
  const finalTotal = cartTotal + deliveryCharge

  const selectedMethod = paymentMethods.find(m => m.key === form.payment)
  const activeFields = selectedMethod?.fields || []

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePaymentFieldChange = (fieldName, value) => {
    setPaymentFields(prev => ({ ...prev, [fieldName]: value }))
  }

  const handlePaymentSelect = (key) => {
    setForm(prev => ({ ...prev, payment: key }))
    setPaymentFields({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.road || !form.house) {
      toast.error('Please fill all required fields')
      return
    }

    // Validate payment fields
    for (const field of activeFields) {
      if (field.required && !paymentFields[field.name]?.trim()) {
        toast.error(`Please fill "${field.label}"`)
        return
      }
    }

    setSubmitting(true)
    try {
      const orderNumber = 'AN-' + Date.now().toString(36).toUpperCase()

      const { data: order, error: orderError } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: `${form.house}, ${form.road}, Alam Nagar`,
        customer_area: 'Alam Nagar',
        delivery_note: form.note,
        payment_method: form.payment,
        payment_details: activeFields.length > 0 ? paymentFields : null,
        subtotal: Math.round(cartTotal),
        delivery_charge: deliveryCharge,
        total: Math.round(finalTotal),
        status: 'pending',
      }).select().single()

      if (orderError) throw orderError

      const orderItems = cart.map(item => {
        const price = item.discount > 0
          ? Math.round(item.price * (1 - item.discount / 100))
          : item.price
        return {
          order_id: order.id,
          product_id: item.id,
          product_name: item.name,
          product_image: item.image_url || item.emoji || item.image || '📦',
          price: price,
          quantity: item.quantity,
          total: price * item.quantity,
        }
      })

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
      if (itemsError) throw itemsError

      setOrderPlaced(true)
      clearCart()
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error('Failed to place order. Please try again.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🛒</span>
        <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
        <Link to="/products" className="text-primary-600 mt-4 inline-block">← Go shopping</Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FiCheck size={40} className="text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Order Placed Successfully! 🎉</h2>
        <p className="text-gray-500 mt-3">
          Thank you, {form.name}! Your order will be delivered to {form.road}, Alam Nagar within 2 hours.
        </p>
        <p className="text-sm text-gray-400 mt-2">Order confirmation sent to {form.phone}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-full mt-8 hover:bg-primary-700 transition"
        >
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-primary-600 mb-4 hover:text-primary-700">
        <FiArrowLeft size={14} /> Back to Cart
      </Link>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Delivery info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-gray-800 mb-4">Delivery Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Road Number *</label>
                  <select name="road" value={form.road} onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm bg-white">
                    <option value="">Select Road</option>
                    {Array.from({ length: 18 }, (_, i) => (
                      <option key={i + 1} value={`Road No ${i + 1}`}>Road No {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">House Name / Number / Flat *</label>
                  <input type="text" name="house" value={form.house} onChange={handleChange} placeholder="e.g. House 12, Flat 3A"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Note</label>
                  <input type="text" name="note" value={form.note} onChange={handleChange} placeholder="Any special instructions"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-bold text-gray-800 mb-4">Payment Method</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {paymentMethods.map(method => (
                  <label key={method.key}
                    onClick={() => handlePaymentSelect(method.key)}
                    className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition ${
                      form.payment === method.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="radio" name="payment" value={method.key} checked={form.payment === method.key} readOnly className="hidden" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Account info for selected method */}
              {selectedMethod?.account_info && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">{selectedMethod.name} Payment Info:</p>
                  <p className="text-sm text-yellow-700 whitespace-pre-line">{selectedMethod.account_info}</p>
                </div>
              )}

              {/* Dynamic payment fields */}
              {activeFields.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-sm font-semibold text-gray-700 mb-3">{selectedMethod?.name} Details</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {activeFields.map(field => (
                      <div key={field.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={field.type || 'text'}
                          value={paymentFields[field.name] || ''}
                          onChange={(e) => handlePaymentFieldChange(field.name, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white rounded-xl border p-5 sticky top-32">
              <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto mb-4">
                {cart.map(item => {
                  const price = item.discount > 0 ? Math.round(item.price * (1 - item.discount / 100)) : item.price
                  return (
                    <div key={item.id} className="flex items-center gap-2 text-sm">
                      <span className="text-lg">{item.image_url ? '📦' : (item.emoji || item.image || '📦')}</span>
                      <span className="flex-1 text-gray-600 line-clamp-1">{item.name}</span>
                      <span className="text-gray-400">×{item.quantity}</span>
                      <span className="font-medium">৳{price * item.quantity}</span>
                    </div>
                  )
                })}
              </div>
              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>৳{Math.round(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery</span>
                  <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                    {deliveryCharge === 0 ? 'FREE' : `৳${deliveryCharge}`}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold text-gray-800">Total</span>
                  <span className="font-bold text-lg text-gray-800">৳{Math.round(finalTotal)}</span>
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full mt-5 bg-primary-600 text-white font-semibold py-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50">
                {submitting ? 'Placing Order...' : `Place Order — ৳${Math.round(finalTotal)}`}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
