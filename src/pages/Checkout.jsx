import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCheck, FiMapPin, FiEdit2, FiX } from 'react-icons/fi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, cartTotal, cartCount, clearCart } = useCart()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [paymentFields, setPaymentFields] = useState({})
  const [note, setNote] = useState('')
  const [payment, setPayment] = useState('cod')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [applyingCoupon, setApplyingCoupon] = useState(false)

  // Check login & address
  const isLoggedIn = !!user
  const hasAddress = !!(profile?.name && profile?.phone && profile?.default_road && profile?.default_house)

  useEffect(() => {
    supabase.from('payment_methods').select('*').eq('is_active', true).order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPaymentMethods(data)
          setPayment(data[0].key)
        }
      })
  }, [])

  const deliveryCharge = cartTotal >= 500 ? 0 : 50
  const finalTotal = cartTotal - couponDiscount + deliveryCharge

  // Re-validate coupon if cart changes
  useEffect(() => {
    if (!appliedCoupon) return
    if (appliedCoupon.min_order > 0 && cartTotal < appliedCoupon.min_order) {
      removeCoupon()
      toast.error('Coupon removed — cart no longer meets minimum order')
      return
    }
    // Recalculate discount
    let disc = appliedCoupon.discount_type === 'percentage'
      ? cartTotal * (appliedCoupon.discount_value / 100)
      : Number(appliedCoupon.discount_value)
    if (appliedCoupon.max_discount) disc = Math.min(disc, Number(appliedCoupon.max_discount))
    disc = Math.min(disc, cartTotal)
    setCouponDiscount(Math.round(disc))
  }, [cartTotal])

  async function applyCoupon() {
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    setApplyingCoupon(true)
    try {
      const { data, error } = await supabase.from('coupons').select('*')
        .eq('code', code).eq('is_active', true).single()

      if (error || !data) { toast.error('Invalid coupon code'); return }
      if (data.expires_at && new Date(data.expires_at) < new Date()) { toast.error('This coupon has expired'); return }
      if (data.usage_limit && data.used_count >= data.usage_limit) { toast.error('This coupon has reached its usage limit'); return }
      if (data.min_order > 0 && cartTotal < data.min_order) { toast.error(`Minimum order ৳${data.min_order} required`); return }

      let disc = data.discount_type === 'percentage'
        ? cartTotal * (data.discount_value / 100)
        : Number(data.discount_value)
      if (data.max_discount) disc = Math.min(disc, Number(data.max_discount))
      disc = Math.min(disc, cartTotal)

      setAppliedCoupon(data)
      setCouponDiscount(Math.round(disc))
      toast.success(`Coupon applied! You save ৳${Math.round(disc)}`)
    } catch {
      toast.error('Failed to apply coupon')
    } finally {
      setApplyingCoupon(false)
    }
  }

  function removeCoupon() {
    setAppliedCoupon(null)
    setCouponDiscount(0)
    setCouponCode('')
  }

  const selectedMethod = paymentMethods.find(m => m.key === payment)
  const activeFields = selectedMethod?.fields || []

  const handlePaymentFieldChange = (fieldName, value) => {
    setPaymentFields(prev => ({ ...prev, [fieldName]: value }))
  }

  const handlePaymentSelect = (key) => {
    setPayment(key)
    setPaymentFields({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isLoggedIn) {
      toast.error('Please sign in first')
      navigate('/account')
      return
    }

    if (!hasAddress) {
      toast.error('Please add your delivery address in profile')
      navigate('/profile')
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

      const orderData = {
        order_number: orderNumber,
        customer_name: profile.name,
        customer_phone: profile.phone,
        customer_address: `${profile.default_house}, ${profile.default_road}, Alam Nagar`,
        customer_area: 'Alam Nagar',
        delivery_note: note,
        payment_method: payment,
        coupon_code: appliedCoupon?.code || null,
        discount: Math.round(couponDiscount),
        subtotal: Math.round(cartTotal),
        delivery_charge: deliveryCharge,
        total: Math.round(finalTotal),
        status: 'pending',
      }
      if (activeFields.length > 0) {
        orderData.payment_details = paymentFields
      }

      const { data: order, error: orderError } = await supabase.from('orders')
        .insert(orderData).select().single()

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

      // Increment coupon used_count
      if (appliedCoupon) {
        supabase.from('coupons').update({ used_count: appliedCoupon.used_count + 1 }).eq('id', appliedCoupon.id)
      }

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
          Thank you, {profile?.name}! Your order will be delivered to {profile?.default_road}, Alam Nagar within 2 hours.
        </p>
        <p className="text-sm text-gray-400 mt-2">Order confirmation sent to {profile?.phone}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <Link to="/track"
            className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-primary-700 transition">
            Track Order
          </Link>
          <Link to="/"
            className="inline-flex items-center gap-2 border-2 border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-50 transition">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  // Not logged in
  if (!isLoggedIn) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">🔐</span>
        <h2 className="text-xl font-bold text-gray-800">Sign in to continue</h2>
        <p className="text-gray-500 mt-2 text-sm">You need an account to place orders</p>
        <Link to="/account"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-full mt-6 hover:bg-primary-700 transition">
          Sign In / Sign Up
        </Link>
      </div>
    )
  }

  // Logged in but no address
  if (!hasAddress) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <span className="text-6xl block mb-4">📍</span>
        <h2 className="text-xl font-bold text-gray-800">Add your delivery address</h2>
        <p className="text-gray-500 mt-2 text-sm">Please complete your profile with name, phone, and address to place orders</p>
        <Link to="/profile?redirect=/checkout"
          className="inline-flex items-center gap-2 bg-primary-600 text-white font-semibold px-6 py-3 rounded-full mt-6 hover:bg-primary-700 transition">
          Complete Profile
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
          <div className="lg:col-span-2 space-y-6">

            {/* Delivery address from profile */}
            <div className="bg-white rounded-xl border p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800">Delivery Address</h3>
                <Link to="/profile" className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                  <FiEdit2 size={14} /> Change
                </Link>
              </div>
              <div className="flex items-start gap-3 p-3 bg-primary-50 rounded-xl">
                <FiMapPin size={20} className="text-primary-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">{profile.name}</p>
                  <p className="text-sm text-gray-600">{profile.default_house}, {profile.default_road}, Alam Nagar</p>
                  <p className="text-sm text-gray-500">{profile.phone}</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Note (optional)</label>
                <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Any special instructions"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
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
                      payment === method.key ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <input type="radio" name="payment" value={method.key} checked={payment === method.key} readOnly className="hidden" />
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{method.name}</p>
                      <p className="text-xs text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedMethod?.account_info && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm font-semibold text-yellow-800 mb-1">{selectedMethod.name} Payment Info:</p>
                  <p className="text-sm text-yellow-700 whitespace-pre-line">{selectedMethod.account_info}</p>
                </div>
              )}

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
              {/* Coupon */}
              <div className="border-t pt-3 mb-3">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🎟️</span>
                      <div>
                        <code className="text-xs font-bold text-green-800">{appliedCoupon.code}</code>
                        <p className="text-[11px] text-green-600">You save ৳{couponDiscount}</p>
                      </div>
                    </div>
                    <button type="button" onClick={removeCoupon} className="p-1 hover:bg-green-100 rounded text-green-600">
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code" className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary-500 uppercase" />
                    <button type="button" onClick={applyCoupon} disabled={applyingCoupon}
                      className="px-3 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition disabled:opacity-50">
                      {applyingCoupon ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span>৳{Math.round(cartTotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-৳{couponDiscount}</span>
                  </div>
                )}
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
