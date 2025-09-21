import React, { useState } from 'react'
import { Field } from '../types/field'
import { createField, updateField } from '../services/fieldService'

interface FieldEditorProps {
  field?: Field | null
  onSave: (field: Field) => void
  onCancel: () => void
  isOpen: boolean
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onSave, onCancel, isOpen }) => {
  const [formData, setFormData] = useState({
    name: field?.name || '',
    area: field?.area || 0,
    soilType: field?.soilType || '',
    irrigationType: field?.irrigationType || 'drip',
    crops: field?.crops || [],
    address: field?.location?.address || '',
    district: field?.location?.district || '',
    state: field?.location?.state || 'Odisha',
    latitude: field?.location?.latitude || 0,
    longitude: field?.location?.longitude || 0,
    notes: field?.notes || ''
  })

  const [newCrop, setNewCrop] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const soilTypes = [
    'Alluvial',
    'Clay',
    'Sandy Loam',
    'Loamy',
    'Sandy',
    'Black Cotton',
    'Red Soil',
    'Laterite',
    'Controlled Environment'
  ]

  const irrigationTypes = [
    { value: 'drip', label: 'Drip Irrigation' },
    { value: 'sprinkler', label: 'Sprinkler' },
    { value: 'flood', label: 'Flood Irrigation' },
    { value: 'furrow', label: 'Furrow Irrigation' }
  ]

  const commonCrops = [
    'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Vegetables',
    'Tomatoes', 'Peppers', 'Herbs', 'Pulses', 'Groundnut', 'Mustard'
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Field name is required'
    }
    if (formData.area <= 0) {
      newErrors.area = 'Area must be greater than 0'
    }
    if (!formData.soilType) {
      newErrors.soilType = 'Soil type is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.district.trim()) {
      newErrors.district = 'District is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const fieldData = {
        name: formData.name,
        area: formData.area,
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.address,
          district: formData.district,
          state: formData.state
        },
        soilType: formData.soilType,
        irrigationType: formData.irrigationType as 'drip' | 'sprinkler' | 'flood' | 'furrow',
        crops: formData.crops,
        establishedDate: field?.establishedDate || new Date().toISOString().split('T')[0],
        lastSoilTest: field?.lastSoilTest || new Date().toISOString().split('T')[0],
        status: field?.status || 'active' as const,
        owner: field?.owner || 'Current User',
        notes: formData.notes
      }

      let savedField: Field
      if (field) {
        savedField = await updateField(field.id, fieldData) as Field
      } else {
        savedField = await createField(fieldData)
      }

      onSave(savedField)
    } catch (error) {
      console.error('Error saving field:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'area' || name === 'latitude' || name === 'longitude' ? parseFloat(value) || 0 : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const addCrop = () => {
    if (newCrop.trim() && !formData.crops.includes(newCrop.trim())) {
      setFormData(prev => ({
        ...prev,
        crops: [...prev.crops, newCrop.trim()]
      }))
      setNewCrop('')
    }
  }

  const removeCrop = (cropToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      crops: prev.crops.filter(crop => crop !== cropToRemove)
    }))
  }

  const addCommonCrop = (crop: string) => {
    if (!formData.crops.includes(crop)) {
      setFormData(prev => ({
        ...prev,
        crops: [...prev.crops, crop]
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {field ? 'Edit Field' : 'Add New Field'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Field Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., North Field"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area (hectares) *
                </label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="2.5"
                />
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>
            </div>

            {/* Soil and Irrigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soil Type *
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.soilType ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select soil type</option>
                  {soilTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.soilType && <p className="text-red-500 text-sm mt-1">{errors.soilType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Irrigation Type
                </label>
                <select
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  {irrigationTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Location</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Village/Town, District"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.district ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Khurda"
                  />
                  {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Odisha"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="0.000001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="20.2961"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="0.000001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="85.8245"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Crops */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Crops</h3>
              
              {/* Current crops */}
              {formData.crops.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.crops.map((crop, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                    >
                      {crop}
                      <button
                        type="button"
                        onClick={() => removeCrop(crop)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add new crop */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCrop())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add crop (e.g., Rice)"
                />
                <button
                  type="button"
                  onClick={addCrop}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Add
                </button>
              </div>

              {/* Common crops */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Quick add common crops:</p>
                <div className="flex flex-wrap gap-2">
                  {commonCrops.map(crop => (
                    <button
                      key={crop}
                      type="button"
                      onClick={() => addCommonCrop(crop)}
                      disabled={formData.crops.includes(crop)}
                      className={`px-3 py-1 text-sm rounded-full border ${
                        formData.crops.includes(crop)
                          ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Additional notes about this field..."
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : (field ? 'Update Field' : 'Create Field')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default FieldEditor