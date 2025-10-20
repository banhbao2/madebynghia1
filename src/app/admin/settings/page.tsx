'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-browser'
import { RestaurantSettings } from '@/types/settings'
import { toast } from 'sonner'

const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'hours' | 'delivery' | 'social'>('general')

  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('restaurant_settings')
        .select('*')
        .single()

      if (error) throw error

      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!settings) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('restaurant_settings')
        .update(settings)
        .eq('id', settings.id)

      if (error) throw error

      toast.success('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!settings) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No settings found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Restaurant-Einstellungen</h1>
          <p className="text-gray-600 mt-1">Konfigurieren Sie Ihre Restaurantinformationen und Präferenzen</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400"
        >
          {saving ? 'Wird gespeichert...' : 'Änderungen speichern'}
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'general', label: 'Allgemeine Infos', icon: '🏪' },
              { id: 'hours', label: 'Öffnungszeiten', icon: '🕐' },
              { id: 'delivery', label: 'Lieferung & Steuer', icon: '🚚' },
              { id: 'social', label: 'Soziale Medien', icon: '📱' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralInfoTab settings={settings} setSettings={setSettings} />
          )}
          {activeTab === 'hours' && (
            <BusinessHoursTab settings={settings} setSettings={setSettings} />
          )}
          {activeTab === 'delivery' && (
            <DeliveryTaxTab settings={settings} setSettings={setSettings} />
          )}
          {activeTab === 'social' && (
            <SocialMediaTab settings={settings} setSettings={setSettings} />
          )}
        </div>
      </div>
    </div>
  )
}

// General Info Tab
function GeneralInfoTab({
  settings,
  setSettings,
}: {
  settings: RestaurantSettings
  setSettings: (s: RestaurantSettings) => void
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Restaurant Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Restaurant Name *
          </label>
          <input
            type="text"
            value={settings.restaurant_name}
            onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={settings.phone || ''}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={settings.email || ''}
            onChange={(e) => setSettings({ ...settings, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="info@restaurant.com"
          />
        </div>

        {/* Notification Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order Notification Email
          </label>
          <input
            type="email"
            value={settings.notification_email || ''}
            onChange={(e) => setSettings({ ...settings, notification_email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="orders@restaurant.com"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={settings.restaurant_description}
          onChange={(e) => setSettings({ ...settings, restaurant_description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={3}
        />
      </div>

      {/* Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address
          </label>
          <input
            type="text"
            value={settings.address || ''}
            onChange={(e) => setSettings({ ...settings, address: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <input
            type="text"
            value={settings.city || ''}
            onChange={(e) => setSettings({ ...settings, city: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State
            </label>
            <input
              type="text"
              value={settings.state || ''}
              onChange={(e) => setSettings({ ...settings, state: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              maxLength={2}
              placeholder="CA"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              value={settings.zip_code || ''}
              onChange={(e) => setSettings({ ...settings, zip_code: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Logo URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Logo URL
        </label>
        <input
          type="url"
          value={settings.logo_url || ''}
          onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="https://example.com/logo.png"
        />
      </div>

      {/* Order Notifications */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.order_notification_enabled}
            onChange={(e) =>
              setSettings({ ...settings, order_notification_enabled: e.target.checked })
            }
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable email notifications for new orders
          </span>
        </label>
      </div>
    </div>
  )
}

// Business Hours Tab
function BusinessHoursTab({
  settings,
  setSettings,
}: {
  settings: RestaurantSettings
  setSettings: (s: RestaurantSettings) => void
}) {
  const updateHours = (day: string, field: string, value: any) => {
    setSettings({
      ...settings,
      business_hours: {
        ...settings.business_hours,
        [day]: {
          ...settings.business_hours[day],
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="space-y-4">
      {DAYS_OF_WEEK.map((day) => {
        const hours = settings.business_hours[day]
        return (
          <div
            key={day}
            className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
          >
            <div className="w-32">
              <p className="font-medium text-gray-900 capitalize">{day}</p>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hours.closed}
                onChange={(e) => updateHours(day, 'closed', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-600">Closed</span>
            </label>

            {!hours.closed && (
              <>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Open:</label>
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => updateHours(day, 'open', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Close:</label>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => updateHours(day, 'close', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Delivery & Tax Tab
function DeliveryTaxTab({
  settings,
  setSettings,
}: {
  settings: RestaurantSettings
  setSettings: (s: RestaurantSettings) => void
}) {
  return (
    <div className="space-y-6">
      {/* Order Types */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900">Order Types</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.delivery_enabled}
            onChange={(e) => setSettings({ ...settings, delivery_enabled: e.target.checked })}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Delivery</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.pickup_enabled}
            onChange={(e) => setSettings({ ...settings, pickup_enabled: e.target.checked })}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <span className="text-sm font-medium text-gray-700">Enable Pickup</span>
        </label>
      </div>

      {/* Delivery Settings */}
      {settings.delivery_enabled && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Delivery Fee (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.delivery_fee}
              onChange={(e) =>
                setSettings({ ...settings, delivery_fee: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Order (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.delivery_minimum}
              onChange={(e) =>
                setSettings({ ...settings, delivery_minimum: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Free Delivery Threshold (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.free_delivery_threshold}
              onChange={(e) =>
                setSettings({ ...settings, free_delivery_threshold: parseFloat(e.target.value) })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      )}

      {/* Tax Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tax Rate (%)
        </label>
        <input
          type="number"
          step="0.0001"
          min="0"
          max="1"
          value={settings.tax_rate}
          onChange={(e) => setSettings({ ...settings, tax_rate: parseFloat(e.target.value) })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter as decimal (e.g., 0.0875 for 8.75%)
        </p>
      </div>
    </div>
  )
}

// Social Media Tab
function SocialMediaTab({
  settings,
  setSettings,
}: {
  settings: RestaurantSettings
  setSettings: (s: RestaurantSettings) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Facebook URL
        </label>
        <input
          type="url"
          value={settings.facebook_url || ''}
          onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="https://facebook.com/yourpage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instagram URL
        </label>
        <input
          type="url"
          value={settings.instagram_url || ''}
          onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="https://instagram.com/yourpage"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Twitter URL
        </label>
        <input
          type="url"
          value={settings.twitter_url || ''}
          onChange={(e) => setSettings({ ...settings, twitter_url: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="https://twitter.com/yourpage"
        />
      </div>
    </div>
  )
}
