import { useState, useEffect } from 'react'
import { FiEye, FiX } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

const statusFlow = ['pending', 'confirmed', 'processing', 'delivered', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => { loadOrders() }, [])

  async function loadOrders() {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  const viewOrder = async (order) => {
    setSelectedOrder(order)
    const { data } = await supabase.from('order_items').select('*').eq('order_id', order.id)
    setOrderItems(data || [])
  }

  const updateStatus = async (orderId, newStatus) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    if (error) { toast.error(error.message); return }
    toast.success(`Order ${newStatus}`)
    loadOrders()
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }))
    }
  }

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Orders ({orders.length})</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['all', ...statusFlow].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition capitalize ${
              filterStatus === s ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}>
            {s} {s !== 'all' && `(${orders.filter(o => o.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Order #</th>
              <th className="text-left p-3 font-medium text-gray-600">Customer</th>
              <th className="text-left p-3 font-medium text-gray-600">Phone</th>
              <th className="text-left p-3 font-medium text-gray-600">Area</th>
              <th className="text-left p-3 font-medium text-gray-600">Total</th>
              <th className="text-left p-3 font-medium text-gray-600">Payment</th>
              <th className="text-left p-3 font-medium text-gray-600">Status</th>
              <th className="text-left p-3 font-medium text-gray-600">Date</th>
              <th className="text-left p-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium">{order.order_number}</td>
                <td className="p-3">{order.customer_name}</td>
                <td className="p-3">{order.customer_phone}</td>
                <td className="p-3">{order.customer_area}</td>
                <td className="p-3 font-medium">৳{Number(order.total).toLocaleString()}</td>
                <td className="p-3 capitalize">{order.payment_method}</td>
                <td className="p-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statusColors[order.status]}`}
                  >
                    {statusFlow.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-3 text-gray-500 text-xs">{new Date(order.created_at).toLocaleString()}</td>
                <td className="p-3">
                  <button onClick={() => viewOrder(order)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <FiEye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="p-8 text-center text-gray-500">No orders found</div>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">Order #{selectedOrder.order_number}</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Customer</p>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-medium">{selectedOrder.customer_phone}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-400">Address</p>
                  <p className="font-medium">{selectedOrder.customer_address}, {selectedOrder.customer_area}</p>
                </div>
                {selectedOrder.delivery_note && (
                  <div className="col-span-2">
                    <p className="text-gray-400">Note</p>
                    <p className="font-medium">{selectedOrder.delivery_note}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400">Payment</p>
                  <p className="font-medium capitalize">{selectedOrder.payment_method}</p>
                </div>
                <div>
                  <p className="text-gray-400">Status</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-3">Items</h3>
                <div className="space-y-2">
                  {orderItems.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span>{item.product_image || '📦'}</span>
                        <span>{item.product_name}</span>
                        <span className="text-gray-400">x{item.quantity}</span>
                      </div>
                      <span className="font-medium">৳{Number(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>৳{Number(selectedOrder.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>৳{Number(selectedOrder.delivery_charge)}</span></div>
                <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                  <span>Total</span><span>৳{Number(selectedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
