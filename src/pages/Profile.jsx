import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiUser, FiPackage, FiLogOut, FiEdit2, FiChevronRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  out_for_delivery: 'bg-orange-100 text-orange-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function Profile() {
  const { user, profile, signOut, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', road: '', house: '' })
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('orders')

  useEffect(() => {
    if (!user) { navigate('/account', { replace: true }); return }
    if (profile) {
      setForm({
        name: profile.name || '',
        phone: profile.phone || '',
        road: profile.default_road || '',
        house: profile.default_house || '',
      })
    }
    loadOrders()
    // Auto open edit mode if redirected from checkout with missing address
    if (redirectTo && !profile?.default_road) {
      setTab('profile')
      setEditing(true)
    }
  }, [user, profile])

  async function loadOrders() {
    if (!profile?.phone) { setLoadingOrders(false); return }
    const { data } = await supabase.from('orders').select('*')
      .eq('customer_phone', profile.phone)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoadingOrders(false)
  }

  async function handleSaveProfile(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        default_road: form.road,
        default_house: form.house,
      })
      toast.success('Profile updated')
      setEditing(false)
      if (redirectTo) navigate(redirectTo)
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
    toast.success('Signed out')
  }

  if (!user) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Profile header */}
      <div className="bg-white rounded-xl border p-5 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center">
              <FiUser size={24} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">{profile?.name || 'Customer'}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              {profile?.phone && <p className="text-xs text-gray-400">{profile.phone}</p>}
            </div>
          </div>
          <button onClick={handleSignOut}
            className="flex items-center gap-1 text-sm text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition">
            <FiLogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('orders')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'orders' ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
          }`}>
          <FiPackage size={16} /> My Orders
        </button>
        <button onClick={() => setTab('profile')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition ${
            tab === 'profile' ? 'bg-primary-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
          }`}>
          <FiUser size={16} /> Profile Settings
        </button>
      </div>

      {/* Orders tab */}
      {tab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl border p-12 text-center">
              <span className="text-5xl block mb-3">📦</span>
              <h3 className="text-lg font-semibold text-gray-700">No orders yet</h3>
              <p className="text-gray-500 text-sm mt-1">Start shopping to see your orders here</p>
              <Link to="/products"
                className="inline-block mt-4 bg-primary-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(order => (
                <Link key={order.id} to={`/track?q=${order.order_number}`}
                  className="bg-white rounded-xl border p-4 flex items-center justify-between hover:shadow-sm transition block">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">#{order.order_number}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${statusColors[order.status]}`}>
                        {order.status === 'out_for_delivery' ? 'Out for Delivery' : order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-700 mt-1">৳{Number(order.total).toLocaleString()}</p>
                  </div>
                  <FiChevronRight size={18} className="text-gray-400" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile settings tab */}
      {tab === 'profile' && (
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-800">Profile Information</h2>
            {!editing && (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-1 text-sm text-primary-600 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition">
                <FiEdit2 size={14} /> Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default Road</label>
                  <select value={form.road} onChange={(e) => setForm(p => ({ ...p, road: e.target.value }))}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm bg-white">
                    <option value="">Select Road</option>
                    {Array.from({ length: 18 }, (_, i) => (
                      <option key={i + 1} value={`Road No ${i + 1}`}>Road No {i + 1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Default House/Flat</label>
                  <input type="text" value={form.house} onChange={(e) => setForm(p => ({ ...p, house: e.target.value }))}
                    placeholder="e.g. House 12, Flat 3A"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setEditing(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Name</p>
                <p className="font-medium text-gray-800">{profile?.name || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400">Phone</p>
                <p className="font-medium text-gray-800">{profile?.phone || '—'}</p>
              </div>
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-400">Default Address</p>
                <p className="font-medium text-gray-800">
                  {profile?.default_house && profile?.default_road
                    ? `${profile.default_house}, ${profile.default_road}, Alam Nagar`
                    : '—'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
