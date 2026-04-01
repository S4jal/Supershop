import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const defaultForm = { name: '', key: '', icon: '💳', description: '', account_info: '', is_active: true, sort_order: 0 }

export default function AdminPaymentMethods() {
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadMethods() }, [])

  async function loadMethods() {
    setLoading(true)
    const { data } = await supabase.from('payment_methods').select('*').order('sort_order')
    setMethods(data || [])
    setLoading(false)
  }

  function openAdd() {
    setEditing(null)
    setForm(defaultForm)
    setShowModal(true)
  }

  function openEdit(method) {
    setEditing(method)
    setForm({
      name: method.name,
      key: method.key,
      icon: method.icon,
      description: method.description || '',
      account_info: method.account_info || '',
      is_active: method.is_active,
      sort_order: method.sort_order || 0,
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.key) {
      toast.error('Name and Key are required')
      return
    }

    setSaving(true)
    try {
      if (editing) {
        const { error } = await supabase.from('payment_methods').update({
          name: form.name,
          key: form.key,
          icon: form.icon,
          description: form.description,
          account_info: form.account_info,
          is_active: form.is_active,
          sort_order: Number(form.sort_order),
        }).eq('id', editing.id)
        if (error) throw error
        toast.success('Payment method updated')
      } else {
        const { error } = await supabase.from('payment_methods').insert({
          name: form.name,
          key: form.key,
          icon: form.icon,
          description: form.description,
          account_info: form.account_info,
          is_active: form.is_active,
          sort_order: Number(form.sort_order),
        })
        if (error) throw error
        toast.success('Payment method added')
      }
      setShowModal(false)
      loadMethods()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  async function toggleActive(method) {
    const { error } = await supabase.from('payment_methods')
      .update({ is_active: !method.is_active }).eq('id', method.id)
    if (error) {
      toast.error('Failed to update')
    } else {
      toast.success(method.is_active ? 'Disabled' : 'Enabled')
      loadMethods()
    }
  }

  async function handleDelete(method) {
    if (!confirm(`Delete "${method.name}"?`)) return
    const { error } = await supabase.from('payment_methods').delete().eq('id', method.id)
    if (error) {
      toast.error('Failed to delete')
    } else {
      toast.success('Deleted')
      loadMethods()
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Payment Methods</h1>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium">
          <FiPlus size={16} /> Add Method
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <span className="text-5xl block mb-3">💳</span>
          <h3 className="text-lg font-semibold text-gray-700">No payment methods yet</h3>
          <p className="text-gray-500 text-sm mt-1">Add your first payment method to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-600">Icon</th>
                  <th className="text-left p-3 font-medium text-gray-600">Name</th>
                  <th className="text-left p-3 font-medium text-gray-600">Key</th>
                  <th className="text-left p-3 font-medium text-gray-600">Description</th>
                  <th className="text-left p-3 font-medium text-gray-600">Account Info</th>
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {methods.map(method => (
                  <tr key={method.id} className="hover:bg-gray-50">
                    <td className="p-3 text-2xl">{method.icon}</td>
                    <td className="p-3 font-medium text-gray-800">{method.name}</td>
                    <td className="p-3 text-gray-500"><code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">{method.key}</code></td>
                    <td className="p-3 text-gray-500">{method.description || '—'}</td>
                    <td className="p-3 text-gray-500 max-w-[200px] truncate">{method.account_info || '—'}</td>
                    <td className="p-3">
                      <button onClick={() => toggleActive(method)} className="flex items-center gap-1">
                        {method.is_active ? (
                          <><FiToggleRight size={22} className="text-green-600" /><span className="text-xs text-green-600 font-medium">Active</span></>
                        ) : (
                          <><FiToggleLeft size={22} className="text-gray-400" /><span className="text-xs text-gray-400 font-medium">Inactive</span></>
                        )}
                      </button>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(method)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                          <FiEdit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(method)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition">
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon (Emoji)</label>
                  <input type="text" name="icon" value={form.icon} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-2xl text-center" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. bKash, Nagad, Cash on Delivery"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key * <span className="text-gray-400 font-normal">(unique identifier)</span></label>
                <input type="text" name="key" value={form.key} onChange={handleChange} placeholder="e.g. bkash, nagad, cod"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Mobile payment, Pay when you receive"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Info <span className="text-gray-400 font-normal">(number/details shown to customer)</span></label>
                <textarea name="account_info" value={form.account_info} onChange={handleChange} rows={2}
                  placeholder="e.g. bKash: 01XXXXXXXXX (Personal)&#10;Send money and use Order ID as reference"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500" />
                <label className="text-sm text-gray-700">Active (visible to customers)</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 border rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Add Method'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
