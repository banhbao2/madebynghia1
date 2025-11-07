'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { MenuItem, MenuCategory } from '@/types/menu'
import { toast } from 'sonner'

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const supabase = createClient()

  useEffect(() => {
    fetchMenuItems()
  }, [])

  useEffect(() => {
    let filtered = menuItems

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [menuItems, selectedCategory, searchQuery])

  const fetchMenuItems = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error

      setMenuItems(data || [])

      // Extract unique categories
      const categoryMap = new Map<string, number>()
      data?.forEach(item => {
        categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1)
      })

      const cats = Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        count
      }))

      setCategories(cats)
    } catch (error) {
      console.error('Error fetching menu items:', error)
      toast.error('Failed to load menu items')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu item?')) return

    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMenuItems(prev => prev.filter(item => item.id !== id))
      toast.success('Menu item deleted successfully!')
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast.error('Failed to delete menu item')
    }
  }

  const handleToggleAvailability = async (item: MenuItem) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .update({ available: !item.available })
        .eq('id', item.id)

      if (error) throw error

      setMenuItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, available: !i.available } : i))
      )
    } catch (error) {
      console.error('Error updating availability:', error)
      toast.error('Failed to update availability')
    }
  }

  const openModal = (item?: MenuItem) => {
    setEditingItem(item || null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Menüverwaltung</h1>
          <p className="text-gray-600 mt-1">Verwalten Sie Ihre Restaurantmenüpositionen</p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Menüposition hinzufügen
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Menüpositionen suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                selectedCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle ({menuItems.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                  selectedCategory === cat.name
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">Keine Menüpositionen gefunden</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-300 to-gray-400">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600 font-semibold text-center px-4">
                    <div>
                      <div className="text-sm">YOUR CUSTOM</div>
                      <div className="text-sm">PICTURE HERE</div>
                    </div>
                  </div>
                )}
                {item.popular && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Beliebt
                  </span>
                )}
                {!item.available && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">Nicht verfügbar</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <p className="text-lg font-bold text-red-600">{item.price.toFixed(2)}€</p>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(item)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
                  >
                    Bearbeiten
                  </button>
                  <button
                    onClick={() => handleToggleAvailability(item)}
                    className={`flex-1 px-3 py-2 rounded-lg transition text-sm font-medium ${
                      item.available
                        ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {item.available ? 'Nicht verfügbar' : 'Verfügbar'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition text-sm font-medium"
                  >
                    Löschen
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <MenuItemModal
          item={editingItem}
          onClose={closeModal}
          onSave={fetchMenuItems}
        />
      )}
    </div>
  )
}

// Menu Item Modal Component
function MenuItemModal({
  item,
  onClose,
  onSave,
}: {
  item: MenuItem | null
  onClose: () => void
  onSave: () => void
}) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price || 0,
    category: item?.category || 'Pho',
    image: item?.image || '',
    popular: item?.popular || false,
    available: item?.available ?? true,
    sort_order: item?.sort_order || 0,
  })
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (item) {
        // Update existing item
        const { error } = await supabase
          .from('menu_items')
          .update(formData)
          .eq('id', item.id)

        if (error) throw error
        toast.success('Menu item updated successfully!')
      } else {
        // Create new item
        const { error } = await supabase
          .from('menu_items')
          .insert([formData])

        if (error) throw error
        toast.success('Menu item created successfully!')
      }

      onSave()
      onClose()
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast.error('Failed to save menu item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {item ? 'Menüposition bearbeiten' : 'Neue Menüposition hinzufügen'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name des Artikels *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Beschreibung *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={3}
              required
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preis (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="Pho">Pho</option>
                <option value="Sushi">Sushi</option>
                <option value="Rolls">Rolls</option>
                <option value="Appetizers">Appetizers</option>
                <option value="Beverages">Beverages</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bild-URL
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Sort Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sortierreihenfolge
            </label>
            <input
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <p className="text-xs text-gray-500 mt-1">Niedrigere Zahlen erscheinen zuerst</p>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Als beliebt markieren</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">Verfügbar (auf Lager)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={saving}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:bg-gray-400"
              disabled={saving}
            >
              {saving ? 'Wird gespeichert...' : item ? 'Artikel aktualisieren' : 'Artikel erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
