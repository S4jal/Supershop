import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiX } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const emptyField = { name: '', label: '', type: 'text', placeholder: '', required: true }
const defaultForm = { name: '', key: '', icon: '💳', description: '', account_info: '', fields: [], is_active: true, sort_order: 0 }

const fieldTypeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'tel', label: 'Phone Number' },
  { value: 'number', label: 'Number' },
  { value: 'email', label: 'Email' },
]

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
      fields: method.fields || [],
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

    // Validate fields have name and label
    for (const f of form.fields) {
      if (!f.name || !f.label) {
        toast.error('All customer fields must have a Field Key and Label')
        return
      }
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name,
        key: form.key,
        icon: form.icon,
        description: form.description,
        account_info: form.account_info,
        fields: form.fields,
        is_active: form.is_active,
        sort_order: Number(form.sort_order),
      }

      if (editing) {
        const { error } = await supabase.from('payment_methods').update(payload).eq('id', editing.id)
        if (error) throw error
        toast.success('Payment method updated')
      } else {
        const { error } = await supabase.from('payment_methods').insert(payload)
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

  // Field management
  function addField() {
    setForm(prev => ({ ...prev, fields: [...prev.fields, { ...emptyField }] }))
  }

  function updateField(index, key, value) {
    setForm(prev => {
      const fields = [...prev.fields]
      fields[index] = { ...fields[index], [key]: value }
      // Auto-generate field key from label
      if (key === 'label' && !editing) {
        fields[index].name = value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/_+$/, '')
      }
      return { ...prev, fields }
    })
  }

  function removeField(index) {
    setForm(prev => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }))
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
        <div className="space-y-4">
          {methods.map(method => (
            <div key={method.id} className="bg-white rounded-xl border p-4 hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{method.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-800">{method.name}</h3>
                      <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs text-gray-500">{method.key}</code>
                    </div>
                    <p className="text-sm text-gray-500">{method.description || 'No description'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleActive(method)} className="flex items-center gap-1">
                    {method.is_active ? (
                      <><FiToggleRight size={24} className="text-green-600" /><span className="text-xs text-green-600 font-medium">Active</span></>
                    ) : (
                      <><FiToggleLeft size={24} className="text-gray-400" /><span className="text-xs text-gray-400 font-medium">Inactive</span></>
                    )}
                  </button>
                  <button onClick={() => openEdit(method)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-600 transition">
                    <FiEdit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(method)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition">
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Show configured fields */}
              {method.fields && method.fields.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-gray-500 mb-2">Customer fills in:</p>
                  <div className="flex flex-wrap gap-2">
                    {method.fields.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs px-2.5 py-1 rounded-full font-medium">
                        {f.label} {f.required && <span className="text-red-400">*</span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {method.account_info && (
                <div className="mt-2 pt-2 border-t">
                  <p className="text-xs text-gray-400">Account info shown to customer: <span className="text-gray-600">{method.account_info}</span></p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Payment Method' : 'Add Payment Method'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                  <input type="text" name="icon" value={form.icon} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-2xl text-center" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. bKash"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Order</label>
                  <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Key * <span className="text-gray-400">(unique)</span></label>
                  <input type="text" name="key" value={form.key} onChange={handleChange} placeholder="e.g. bkash"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="e.g. Mobile payment"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Account Info <span className="text-gray-400">(shown after selection)</span></label>
                <textarea name="account_info" value={form.account_info} onChange={handleChange} rows={2}
                  placeholder="e.g. bKash: 01XXXXXXXXX (Personal)&#10;Send money and use Order ID as reference"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500 text-sm" />
              </div>

              {/* Customer Fields */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">Customer Input Fields</h3>
                    <p className="text-xs text-gray-400">Fields that customer must fill after selecting this method</p>
                  </div>
                  <button type="button" onClick={addField}
                    className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 px-2 py-1 hover:bg-primary-50 rounded-lg transition">
                    <FiPlus size={14} /> Add Field
                  </button>
                </div>

                {form.fields.length === 0 ? (
                  <div className="text-center py-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">No fields — customer won't need to enter anything extra</p>
                    <p className="text-xs text-gray-400">(Good for Cash on Delivery)</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {form.fields.map((field, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 relative">
                        <button type="button" onClick={() => removeField(index)}
                          className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded text-red-400 hover:text-red-600 transition">
                          <FiX size={14} />
                        </button>
                        <div className="grid grid-cols-2 gap-2 pr-8">
                          <div>
                            <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Label *</label>
                            <input type="text" value={field.label}
                              onChange={(e) => updateField(index, 'label', e.target.value)}
                              placeholder="e.g. bKash Number"
                              className="w-full px-2.5 py-1.5 border rounded text-sm focus:outline-none focus:border-primary-500" />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Type</label>
                            <select value={field.type}
                              onChange={(e) => updateField(index, 'type', e.target.value)}
                              className="w-full px-2.5 py-1.5 border rounded text-sm focus:outline-none focus:border-primary-500 bg-white">
                              {fieldTypeOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Placeholder</label>
                            <input type="text" value={field.placeholder}
                              onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                              placeholder="e.g. 01XXXXXXXXX"
                              className="w-full px-2.5 py-1.5 border rounded text-sm focus:outline-none focus:border-primary-500" />
                          </div>
                          <div className="flex items-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" checked={field.required}
                                onChange={(e) => updateField(index, 'required', e.target.checked)}
                                className="w-3.5 h-3.5 text-primary-600 rounded focus:ring-primary-500" />
                              <span className="text-xs text-gray-600">Required</span>
                            </label>
                          </div>
                        </div>
                        <div className="mt-1.5">
                          <span className="text-[10px] text-gray-400">Field key: <code className="bg-white px-1 rounded">{field.name || '...'}</code></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
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
