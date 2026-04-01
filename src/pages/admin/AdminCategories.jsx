import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const EMOJI_OPTIONS = ['📦','🍚','🫘','🫗','🌶️','🥛','🍎','🥬','🍪','🥤','🍗','🐟','🧴','👶','🧹','🏠','🎉','💊','🧊','🍕']

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', slug: '', icon: '📦', color: '#16a34a', sort_order: 0 })

  useEffect(() => { loadCategories() }, [])

  async function loadCategories() {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setCategories(data || [])
    setLoading(false)
  }

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', slug: '', icon: '📦', color: '#16a34a', sort_order: categories.length + 1 })
    setShowModal(true)
  }

  const openEdit = (cat) => {
    setEditing(cat)
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, color: cat.color, sort_order: cat.sort_order })
    setShowModal(true)
  }

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSave = async () => {
    if (!form.name) { toast.error('Category name is required'); return }

    const payload = {
      ...form,
      slug: form.slug || generateSlug(form.name),
      sort_order: Number(form.sort_order),
    }

    if (editing) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
      if (error) { toast.error(error.message); return }
      toast.success('Category updated!')
    } else {
      const { error } = await supabase.from('categories').insert(payload)
      if (error) { toast.error(error.message); return }
      toast.success('Category added!')
    }

    setShowModal(false)
    loadCategories()
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? Products in this category will be uncategorized.`)) return
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) { toast.error(error.message); return }
    toast.success('Category deleted')
    loadCategories()
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
        <h1 className="text-2xl font-bold text-gray-800">Categories ({categories.length})</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition text-sm font-medium">
          <FiPlus size={18} /> Add Category
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ backgroundColor: cat.color + '20' }}>
              {cat.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800">{cat.name}</h3>
              <p className="text-xs text-gray-400">/{cat.slug} · Order: {cat.sort_order}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openEdit(cat)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg">
                <FiEdit2 size={16} />
              </button>
              <button onClick={() => handleDelete(cat.id, cat.name)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-4xl mb-3">📂</p>
          <p>No categories yet. Add your first one!</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-5 border-b flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">{editing ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg"><FiX size={20} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value, slug: editing ? f.slug : generateSlug(e.target.value) }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                <input type="text" value={form.slug} onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {EMOJI_OPTIONS.map(e => (
                    <button key={e} onClick={() => setForm(f => ({ ...f, icon: e }))}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition ${form.icon === e ? 'bg-primary-100 ring-2 ring-primary-500' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      {e}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
                      className="w-10 h-10 rounded-lg border cursor-pointer" />
                    <input type="text" value={form.color} onChange={(e) => setForm(f => ({ ...f, color: e.target.value }))}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                  </div>
                </div>
                <div className="w-24">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm(f => ({ ...f, sort_order: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary-500" />
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">
                {editing ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
