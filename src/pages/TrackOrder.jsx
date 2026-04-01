import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FiSearch, FiCheckCircle, FiClock, FiTruck, FiPackage, FiXCircle } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const steps = [
  { key: 'pending', label: 'Order Placed', icon: FiClock, desc: 'Your order has been received' },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheckCircle, desc: 'Shop has confirmed your order' },
  { key: 'processing', label: 'Preparing', icon: FiPackage, desc: 'Your items are being packed' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: FiTruck, desc: 'On the way to your door' },
  { key: 'delivered', label: 'Delivered', icon: FiCheckCircle, desc: 'Order delivered successfully' },
]

export default function TrackOrder() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [order, setOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  // Auto-search from URL param
  useEffect(() => {
    if (query) {
      handleSearch({ preventDefault: () => {} })
    }
  }, [])

  // Realtime subscription
  useEffect(() => {
    if (!order) return
    const channel = supabase
      .channel(`order-${order.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${order.id}`,
      }, (payload) => {
        setOrder(prev => ({ ...prev, ...payload.new }))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [order?.id])

  async function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    setSearched(true)

    // Search by order number or phone
    const q = query.trim()
    let result = null

    // Try order number first
    const { data: byNumber } = await supabase.from('orders').select('*')
      .ilike('order_number', `%${q}%`).order('created_at', { ascending: false }).limit(1)

    if (byNumber && byNumber.length > 0) {
      result = byNumber[0]
    } else {
      // Try phone number
      const { data: byPhone } = await supabase.from('orders').select('*')
        .eq('customer_phone', q).order('created_at', { ascending: false }).limit(1)
      if (byPhone && byPhone.length > 0) {
        result = byPhone[0]
      }
    }

    if (result) {
      setOrder(result)
      const { data: items } = await supabase.from('order_items').select('*').eq('order_id', result.id)
      setOrderItems(items || [])
    } else {
      setOrder(null)
      setOrderItems([])
    }
    setLoading(false)
  }

  function getStepStatus(stepKey) {
    if (!order) return 'upcoming'
    if (order.status === 'cancelled') return stepKey === 'pending' ? 'cancelled' : 'upcoming'

    const orderIndex = steps.findIndex(s => s.key === order.status)
    const stepIndex = steps.findIndex(s => s.key === stepKey)

    if (stepIndex < orderIndex) return 'completed'
    if (stepIndex === orderIndex) return 'current'
    return 'upcoming'
  }

  const statusColors = {
    pending: 'text-yellow-600 bg-yellow-50',
    confirmed: 'text-blue-600 bg-blue-50',
    processing: 'text-purple-600 bg-purple-50',
    out_for_delivery: 'text-orange-600 bg-orange-50',
    delivered: 'text-green-600 bg-green-50',
    cancelled: 'text-red-600 bg-red-50',
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Track Your Order</h1>
      <p className="text-gray-500 text-sm mb-6">Enter your order number or phone number to track</p>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Order number (AN-XXXXX) or phone (01XXXXXXXXX)"
            className="w-full pl-4 pr-14 py-3.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none text-sm"
          />
          <button type="submit" disabled={loading}
            className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50">
            <FiSearch size={18} />
          </button>
        </div>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      )}

      {/* No result */}
      {searched && !loading && !order && (
        <div className="text-center py-12 bg-white rounded-xl border">
          <span className="text-5xl block mb-3">🔍</span>
          <h3 className="text-lg font-semibold text-gray-700">Order not found</h3>
          <p className="text-gray-500 text-sm mt-1">Check your order number or phone number and try again</p>
        </div>
      )}

      {/* Order found */}
      {order && !loading && (
        <div className="space-y-6">
          {/* Order header */}
          <div className="bg-white rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">#{order.order_number}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                {order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="font-medium text-gray-800">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="font-medium text-gray-800">{order.customer_phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-400">Delivery Address</p>
                <p className="font-medium text-gray-800">{order.customer_address}</p>
              </div>
              <div>
                <p className="text-gray-400">Payment</p>
                <p className="font-medium text-gray-800 capitalize">{order.payment_method}</p>
              </div>
              <div>
                <p className="text-gray-400">Total</p>
                <p className="font-bold text-gray-800 text-lg">৳{Number(order.total).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Estimated time banner */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className={`rounded-xl p-4 flex items-center gap-3 ${
              order.status === 'out_for_delivery'
                ? 'bg-orange-500 text-white'
                : 'bg-primary-700 text-white'
            }`}>
              <span className="text-3xl">
                {order.status === 'out_for_delivery' ? '🛵' :
                 order.status === 'processing' ? '📦' :
                 order.status === 'confirmed' ? '✅' : '⏳'}
              </span>
              <div>
                <p className="font-bold text-sm">
                  {order.status === 'pending' && 'Waiting for confirmation'}
                  {order.status === 'confirmed' && 'Order confirmed! Preparing soon...'}
                  {order.status === 'processing' && 'Your order is being packed'}
                  {order.status === 'out_for_delivery' && 'Delivery boy is on the way!'}
                </p>
                <p className="text-xs mt-0.5 text-white/80">
                  {order.status === 'pending' && 'Estimated delivery: 30-45 minutes'}
                  {order.status === 'confirmed' && 'Estimated delivery: 20-35 minutes'}
                  {order.status === 'processing' && 'Estimated delivery: 15-25 minutes'}
                  {order.status === 'out_for_delivery' && 'Arriving in 5-15 minutes'}
                </p>
              </div>
            </div>
          )}

          {order.status === 'delivered' && (
            <div className="rounded-xl p-4 flex items-center gap-3 bg-green-600 text-white">
              <span className="text-3xl">🎉</span>
              <div>
                <p className="font-bold text-sm">Order Delivered!</p>
                <p className="text-xs mt-0.5 text-white/80">
                  Delivered at {order.updated_at ? new Date(order.updated_at).toLocaleString() : 'recently'}
                </p>
              </div>
            </div>
          )}

          {/* Tracking timeline */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-gray-800 mb-5">Order Status</h3>

            {order.status === 'cancelled' ? (
              <div className="flex items-center gap-3 p-4 bg-red-50 rounded-xl">
                <FiXCircle size={24} className="text-red-500" />
                <div>
                  <p className="font-semibold text-red-700">Order Cancelled</p>
                  <p className="text-sm text-red-500">This order has been cancelled</p>
                </div>
              </div>
            ) : (
              <div className="space-y-0">
                {steps.map((step, i) => {
                  const status = getStepStatus(step.key)
                  const isLast = i === steps.length - 1
                  return (
                    <div key={step.key} className="flex gap-4">
                      {/* Line + dot */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          status === 'completed' ? 'bg-green-100 text-green-600' :
                          status === 'current' ? 'bg-primary-100 text-primary-600 ring-4 ring-primary-50' :
                          'bg-gray-100 text-gray-300'
                        }`}>
                          <step.icon size={18} />
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 h-10 ${
                            status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      {/* Content */}
                      <div className="pb-6">
                        <p className={`font-medium text-sm ${
                          status === 'completed' ? 'text-green-700' :
                          status === 'current' ? 'text-primary-700' :
                          'text-gray-400'
                        }`}>{step.label}</p>
                        <p className={`text-xs mt-0.5 ${
                          status === 'upcoming' ? 'text-gray-300' : 'text-gray-500'
                        }`}>{step.desc}</p>
                        {status === 'current' && (
                          <span className="inline-block mt-1.5 text-[11px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full animate-pulse">
                            Current Status
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Order items */}
          <div className="bg-white rounded-xl border p-5">
            <h3 className="font-bold text-gray-800 mb-3">Items ({orderItems.length})</h3>
            <div className="space-y-2">
              {orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm py-2 border-b last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.product_image || '📦'}</span>
                    <div>
                      <p className="font-medium text-gray-800">{item.product_name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">৳{Number(item.total)}</span>
                </div>
              ))}
            </div>
            <div className="border-t mt-3 pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>৳{Number(order.subtotal)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span>
                <span className={Number(order.delivery_charge) === 0 ? 'text-green-600' : ''}>
                  {Number(order.delivery_charge) === 0 ? 'FREE' : `৳${Number(order.delivery_charge)}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                <span>Total</span><span>৳{Number(order.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
