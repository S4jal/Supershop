import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const defaultForm = {
  code: '', discount_type: 'percentage', discount_value: '',
  min_order: '', max_discount: '', usage_limit: '',
  is_active: true, expires_at: '',
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadCoupons() }, [])

  async function loadCoupons() {
    setLoading(true)
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false })
    setCoupons(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  function openEdit(coupon) {
    setEditing(coupon)
    setForm({
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      min_order: coupon.min_order || '',
      max_discount: coupon.max_discount || '',
      usage_limit: coupon.usage_limit || '',
      is_active: coupon.is_active,
      expires_at: coupon.expires_at ? coupon.expires_at.slice(0, 16) : '',
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.code || !form.discount_value) {
      toast.error('Code and discount value are required')
      return
    }

    setSaving(true)
    try {
      const payload = {
        code: form.code.toUpperCase().trim(),
        discount_type: form.discount_type,
        discount_value: Number(form.discount_value),
        min_order: form.min_order ? Number(form.min_order) : 0,
        max_discount: form.max_discount ? Number(form.max_discount) : null,
        usage_limit: form.usage_limit ? Number(form.usage_limit) : null,
        is_active: form.is_active,
        expires_at: form.expires_at || null,
      }

      if (editing) {
        const { error } = await supabase.from('coupons').update(payload).eq('id', editing.id)
        if (error) throw error
        toast.success('Coupon updated')
      } else {
        const { error } = await supabase.from('coupons').insert(payload)
        if (error) throw error
        toast.success('Coupon created')
      }
      setShowModal(false)
      loadCoupons()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(coupon) {
    const { error } = await supabase.from('coupons').update({ is_active: !coupon.is_active }).eq('id', coupon.id)
    if (error) toast.error('Failed')
    else { toast.success(coupon.is_active ? 'Disabled' : 'Enabled'); loadCoupons() }
  }

  async function handleDelete(coupon) {
    if (!confirm(`Delete "${coupon.code}"?`)) return
    const { error } = await supabase.from('coupons').delete().eq('id', coupon.id)
    if (error) toast.error('Failed')
    else { toast.success('Deleted'); loadCoupons() }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Coupons</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium">
          <FiPlus size={16} /> Create Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <span className="text-5xl block mb-3">🎟️</span>
          <h3 className="text-lg font-semibold text-gray-700">No coupons yet</h3>
          <p className="text-gray-500 text-sm mt-1">Create your first coupon to attract customers</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map(coupon => {
            const isExpired = coupon.expires_at && new Date(coupon.expires_at) < new Date()
            const isUsedUp = coupon.usage_limit && coupon.used_count >= coupon.usage_limit
            return (
              <div key={coupon.id} className="bg-white rounded-xl border p-4 hover:shadow-sm transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🎟️</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="bg-gray-100 text-gray-800 font-bold px-2 py-0.5 rounded text-sm">{coupon.code}</code>
                        {isExpired && <span className="text-[11px] font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded">Expired</span>}
                        {isUsedUp && <span className="text-[11px] font-medium text-orange-500 bg-orange-50 px-1.5 py-0.5 rounded">Used up</span>}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {coupon.discount_type === 'percentage'
                          ? `${coupon.discount_value}% off`
                          : `৳${coupon.discount_value} off`}
                        {coupon.min_order > 0 && ` on orders ৳${coupon.min_order}+`}
                        {coupon.max_discount && ` (max ৳${coupon.max_discount})`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right text-xs text-gray-400 hidden sm:block">
                      <p>Used: {coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : ''}</p>
                      {coupon.expires_at && <p>Exp: {new Date(coupon.expires_at).toLocaleDateString()}</p>}
                    </div>
                    <button onClick={() => toggleActive(coupon)} className="flex items-center gap-1">
                      {coupon.is_active ? (
                        <FiToggleRight size={24} className="text-green-600" />
                      ) : (
                        <FiToggleLeft size={24} className="text-gray-400" />
                      )}
                    </button>
                    <button onClick={() => openEdit(coupon)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                      <FiEdit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(coupon)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Coupon' : 'Create Coupon'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Coupon Code *</label>
                <input type="text" name="code" value={form.code} onChange={handleChange} placeholder="e.g. WELCOME20"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm uppercase" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Discount Type</label>
                  <select name="discount_type" value={form.discount_type} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm bg-white">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (৳)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Discount Value * {form.discount_type === 'percentage' ? '(%)' : '(৳)'}
                  </label>
                  <input type="number" name="discount_value" value={form.discount_value} onChange={handleChange} placeholder="e.g. 20"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Min Order (৳)</label>
                  <input type="number" name="min_order" value={form.min_order} onChange={handleChange} placeholder="0"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Max Discount (৳)</label>
                  <input type="number" name="max_discount" value={form.max_discount} onChange={handleChange} placeholder="No limit"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Usage Limit</label>
                  <input type="number" name="usage_limit" value={form.usage_limit} onChange={handleChange} placeholder="Unlimited"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Expires At</label>
                  <input type="datetime-local" name="expires_at" value={form.expires_at} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                <label className="text-sm text-gray-700">Active</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
