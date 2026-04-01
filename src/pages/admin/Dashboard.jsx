import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiBox, FiTag, FiShoppingBag, FiDollarSign } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0 })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    const [
      { count: productCount },
      { count: categoryCount },
      { count: orderCount },
      { data: orders },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    ])

    const revenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0

    setStats({
      products: productCount || 0,
      categories: categoryCount || 0,
      orders: orderCount || 0,
      revenue,
    })
    setRecentOrders(orders || [])
    setLoading(false)
  }

  const statCards = [
    { label: 'Products', value: stats.products, icon: FiBox, color: 'bg-blue-500', link: '/admin/products' },
    { label: 'Categories', value: stats.categories, icon: FiTag, color: 'bg-green-500', link: '/admin/categories' },
    { label: 'Orders', value: stats.orders, icon: FiShoppingBag, color: 'bg-orange-500', link: '/admin/orders' },
    { label: 'Revenue', value: `৳${stats.revenue.toLocaleString()}`, icon: FiDollarSign, color: 'bg-purple-500', link: '/admin/orders' },
  ]

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <Link key={i} to={s.link} className="bg-white rounded-xl border p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{s.value}</p>
              </div>
              <div className={`${s.color} p-3 rounded-xl text-white`}>
                <s.icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-bold text-gray-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">View all</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Order #</th>
                  <th className="text-left p-3 font-medium text-gray-600">Customer</th>
                  <th className="text-left p-3 font-medium text-gray-600">Area</th>
                  <th className="text-left p-3 font-medium text-gray-600">Total</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{order.order_number}</td>
                    <td className="p-3">{order.customer_name}</td>
                    <td className="p-3">{order.customer_area}</td>
                    <td className="p-3 font-medium">৳{Number(order.total).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
