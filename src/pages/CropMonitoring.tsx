import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useField } from '../contexts/FieldContext'

interface CropData {
  id: string
  name: string
  variety: string
  plantingDate: string
  expectedHarvest: string
  currentStage: string
  health: 'excellent' | 'good' | 'fair' | 'poor'
  progress: number
  area: number
  icon: string
}

interface DiseaseAlert {
  id: string
  crop: string
  disease: string
  severity: 'low' | 'medium' | 'high'
  affected: number
  treatment: string
  detected: string
}

interface GrowthStage {
  stage: string
  description: string
  duration: string
  status: 'completed' | 'current' | 'upcoming'
  icon: string
}

const CropMonitoring = () => {
  const { t } = useTranslation()
  const { selectedField } = useField()
  const [selectedCrop, setSelectedCrop] = useState('wheat-001')
  const [showAddCropModal, setShowAddCropModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingCrop, setEditingCrop] = useState<CropData | null>(null)
  const [deletingCrop, setDeletingCrop] = useState<CropData | null>(null)
  const [crops, setCrops] = useState<CropData[]>([
    {
      id: 'wheat-001',
      name: 'Winter Wheat',
      variety: 'HD-2967',
      plantingDate: '2023-11-15',
      expectedHarvest: '2024-04-20',
      currentStage: 'Tillering',
      health: 'excellent',
      progress: 45,
      area: 5.2,
      icon: '🌾'
    },
    {
      id: 'rice-001',
      name: 'Basmati Rice',
      variety: 'Pusa Basmati 1121',
      plantingDate: '2023-06-20',
      expectedHarvest: '2023-11-15',
      currentStage: 'Harvested',
      health: 'good',
      progress: 100,
      area: 3.8,
      icon: '🌾'
    },
    {
      id: 'corn-001',
      name: 'Sweet Corn',
      variety: 'Sugar-75',
      plantingDate: '2024-01-10',
      expectedHarvest: '2024-05-15',
      currentStage: 'Germination',
      health: 'good',
      progress: 15,
      area: 2.1,
      icon: '🌽'
    },
    {
      id: 'tomato-001',
      name: 'Tomatoes',
      variety: 'Roma VF',
      plantingDate: '2023-12-01',
      expectedHarvest: '2024-03-15',
      currentStage: 'Flowering',
      health: 'fair',
      progress: 65,
      area: 1.5,
      icon: '🍅'
    }
  ])

  const [newCrop, setNewCrop] = useState<Partial<CropData>>({
    name: '',
    variety: '',
    plantingDate: '',
    expectedHarvest: '',
    currentStage: 'Germination',
    health: 'good',
    progress: 0,
    area: 0,
    icon: '🌱'
  })

  // Mock disease alerts
  const diseaseAlerts: DiseaseAlert[] = [
    {
      id: '1',
      crop: 'Tomatoes',
      disease: 'Early Blight',
      severity: 'medium',
      affected: 15,
      treatment: 'Apply copper-based fungicide every 7-10 days',
      detected: '2 days ago'
    },
    {
      id: '2',
      crop: 'Winter Wheat',
      disease: 'Rust',
      severity: 'low',
      affected: 5,
      treatment: 'Monitor closely, apply fungicide if spread increases',
      detected: '1 week ago'
    }
  ]

  // Growth stages for selected crop
  const growthStages: GrowthStage[] = [
    {
      stage: 'Planting',
      description: 'Seeds planted and initial watering',
      duration: '1-2 days',
      status: 'completed',
      icon: '🌱'
    },
    {
      stage: 'Germination',
      description: 'Seeds sprouting and first leaves appearing',
      duration: '7-14 days',
      status: 'completed',
      icon: '🌿'
    },
    {
      stage: 'Tillering',
      description: 'Multiple shoots developing from base',
      duration: '30-45 days',
      status: 'current',
      icon: '🌾'
    },
    {
      stage: 'Stem Extension',
      description: 'Rapid vertical growth and node development',
      duration: '20-30 days',
      status: 'upcoming',
      icon: '📏'
    },
    {
      stage: 'Flowering',
      description: 'Flower heads emerging and pollination',
      duration: '15-20 days',
      status: 'upcoming',
      icon: '🌸'
    },
    {
      stage: 'Grain Filling',
      description: 'Grain development and maturation',
      duration: '30-40 days',
      status: 'upcoming',
      icon: '🌾'
    },
    {
      stage: 'Harvest',
      description: 'Crop ready for harvesting',
      duration: '5-10 days',
      status: 'upcoming',
      icon: '🚜'
    }
  ]

  const selectedCropData = crops.find(crop => crop.id === selectedCrop) || crops[0]
  const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0)

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'poor': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStageStatus = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'current': return 'bg-blue-500 text-white'
      case 'upcoming': return 'bg-gray-300 text-gray-600'
      default: return 'bg-gray-300 text-gray-600'
    }
  }

  const addNewCrop = () => {
    if (!newCrop.name || !newCrop.variety || !newCrop.plantingDate || !newCrop.expectedHarvest || !newCrop.area) {
      alert('Please fill in all required fields')
      return
    }

    const cropId = `${newCrop.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const cropToAdd: CropData = {
      id: cropId,
      name: newCrop.name!,
      variety: newCrop.variety!,
      plantingDate: newCrop.plantingDate!,
      expectedHarvest: newCrop.expectedHarvest!,
      currentStage: newCrop.currentStage || 'Germination',
      health: newCrop.health as 'excellent' | 'good' | 'fair' | 'poor' || 'good',
      progress: newCrop.progress || 0,
      area: newCrop.area!,
      icon: newCrop.icon || '🌱'
    }

    setCrops([...crops, cropToAdd])
    setSelectedCrop(cropId)
    setShowAddCropModal(false)
    setNewCrop({
      name: '',
      variety: '',
      plantingDate: '',
      expectedHarvest: '',
      currentStage: 'Germination',
      health: 'good',
      progress: 0,
      area: 0,
      icon: '🌱'
    })
  }

  const updateCrop = () => {
    if (!editingCrop) return

    const updatedCrops = crops.map(crop => 
      crop.id === editingCrop.id ? editingCrop : crop
    )
    setCrops(updatedCrops)
    setShowEditModal(false)
    setEditingCrop(null)
  }

  const deleteCrop = () => {
    if (!deletingCrop) return

    const updatedCrops = crops.filter(crop => crop.id !== deletingCrop.id)
    setCrops(updatedCrops)
    
    // If the deleted crop was selected, select the first remaining crop
    if (selectedCrop === deletingCrop.id && updatedCrops.length > 0) {
      setSelectedCrop(updatedCrops[0].id)
    }
    
    setShowDeleteModal(false)
    setDeletingCrop(null)
  }

  const cropIcons = ['🌾', '🌽', '🍅', '🥕', '🥬', '🥒', '🌶️', '🍆', '🥔', '🧄', '🧅', '🌱', '🌿', '🍇', '🍎', '🍊']

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-lime-50 pt-20 relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/src/assets/images/dashboard-pattern.svg')`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Decorative Agricultural Elements */}
      <div className="absolute top-20 right-10 opacity-15">
        <img 
          src="/src/assets/images/crop-monitoring-icon.svg" 
          alt="Crop Monitoring" 
          className="w-24 h-24"
        />
      </div>
      <div className="absolute top-40 left-10 opacity-10">
        <img 
          src="/src/assets/images/crop-health-icon.svg" 
          alt="Crop Health" 
          className="w-20 h-20"
        />
      </div>
      <div className="absolute bottom-20 right-20 opacity-15">
        <div className="text-4xl animate-pulse">🌱</div>
      </div>
      <div className="absolute bottom-40 left-20 opacity-10">
        <div className="text-3xl">🚜</div>
      </div>
      
      <div className="container-custom py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Crop Monitoring
              </h1>
              <p className="text-lg text-gray-600">
                Track growth stages, monitor health, and detect diseases
                {selectedField && (
                  <span className="block text-sm text-green-600 mt-1">
                    Current Field: {selectedField.name} ({selectedField.size} ha)
                  </span>
                )}

        {/* Edit Crop Modal */}
        {showEditModal && editingCrop && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowEditModal(false)
                setEditingCrop(null)
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Edit Crop</h3>
                <button 
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCrop(null)
                  }}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 flex items-center justify-center w-10 h-10 border border-gray-300 hover:border-gray-400 bg-white shadow-sm"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    value={editingCrop.name}
                    onChange={(e) => setEditingCrop({...editingCrop, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Winter Wheat"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variety *
                  </label>
                  <input
                    type="text"
                    value={editingCrop.variety}
                    onChange={(e) => setEditingCrop({...editingCrop, variety: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., HD-2967"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Planting Date *
                    </label>
                    <input
                      type="date"
                      value={editingCrop.plantingDate}
                      onChange={(e) => setEditingCrop({...editingCrop, plantingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Harvest *
                    </label>
                    <input
                      type="date"
                      value={editingCrop.expectedHarvest}
                      onChange={(e) => setEditingCrop({...editingCrop, expectedHarvest: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (hectares) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={editingCrop.area}
                    onChange={(e) => setEditingCrop({...editingCrop, area: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 5.2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stage
                  </label>
                  <select
                    value={editingCrop.currentStage}
                    onChange={(e) => setEditingCrop({...editingCrop, currentStage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Tillering">Tillering</option>
                    <option value="Stem Extension">Stem Extension</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Grain Filling">Grain Filling</option>
                    <option value="Harvested">Harvested</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Health Status
                  </label>
                  <select
                    value={editingCrop.health}
                    onChange={(e) => setEditingCrop({...editingCrop, health: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Progress (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingCrop.progress}
                    onChange={(e) => setEditingCrop({...editingCrop, progress: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0-100"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {cropIcons.map((icon, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setEditingCrop({...editingCrop, icon})}
                        className={`p-2 text-xl border rounded-lg hover:bg-gray-50 ${
                          editingCrop.icon === icon ? 'border-green-500 bg-green-50' : 'border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false)
                    setEditingCrop(null)
                  }}
                  className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={updateCrop}
                  className="w-full sm:flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Crop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingCrop && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowDeleteModal(false)
                setDeletingCrop(null)
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delete Crop</h3>
                <button 
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingCrop(null)
                  }}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 flex items-center justify-center w-10 h-10 border border-gray-300 hover:border-gray-400 bg-white shadow-sm"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{deletingCrop.icon}</div>
                  <div>
                    <div className="font-bold text-gray-900">{deletingCrop.name}</div>
                    <div className="text-sm text-gray-600">{deletingCrop.variety}</div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Are you sure you want to delete this crop? This action cannot be undone.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false)
                    setDeletingCrop(null)
                  }}
                  className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteCrop}
                  className="w-full sm:flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Crop
                </button>
              </div>
            </div>
          </div>
        )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {selectedField ? 'Field Area' : 'Total Area'}
              </div>
              <div className="text-2xl font-bold text-green-600">
                {selectedField ? `${selectedField.size} ha` : `${totalArea.toFixed(1)} ha`}
              </div>
            </div>
          </div>
        </div>

        {/* Crop Selection */}
        <div className="card-elegant p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Crops</h2>
            <button 
              className="btn-primary"
              onClick={() => setShowAddCropModal(true)}
            >
              ➕ Add New Crop
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3 lg:gap-4">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className={`relative group p-3 lg:p-4 border-2 rounded-lg transition-all duration-200 hover:shadow-md ${
                  selectedCrop === crop.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingCrop(crop)
                      setShowEditModal(true)
                    }}
                    className="p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    title="Edit Crop"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDeletingCrop(crop)
                      setShowDeleteModal(true)
                    }}
                    className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete Crop"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Crop Card Content */}
                <div
                  onClick={() => setSelectedCrop(crop.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xl lg:text-2xl">{crop.icon}</div>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getHealthColor(crop.health)}`}>
                      {crop.health}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900 mb-1 text-sm lg:text-base">{crop.name}</div>
                  <div className="text-xs lg:text-sm text-gray-600 mb-2">{crop.variety}</div>
                  <div className="text-xs text-gray-500 mb-2">{crop.area} hectares</div>
                  <div className="text-xs text-gray-600 mb-2">{crop.currentStage}</div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${crop.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Crop Modal */}
        {showAddCropModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999] p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddCropModal(false)
              }
            }}
          >
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl relative">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add New Crop</h3>
                <button 
                  onClick={() => setShowAddCropModal(false)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 flex items-center justify-center w-10 h-10 border border-gray-300 hover:border-gray-400 bg-white shadow-sm"
                  aria-label="Close modal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crop Name *
                  </label>
                  <input
                    type="text"
                    value={newCrop.name || ''}
                    onChange={(e) => setNewCrop({...newCrop, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Winter Wheat"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variety *
                  </label>
                  <input
                    type="text"
                    value={newCrop.variety || ''}
                    onChange={(e) => setNewCrop({...newCrop, variety: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., HD-2967"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Planting Date *
                    </label>
                    <input
                      type="date"
                      value={newCrop.plantingDate || ''}
                      onChange={(e) => setNewCrop({...newCrop, plantingDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Harvest *
                    </label>
                    <input
                      type="date"
                      value={newCrop.expectedHarvest || ''}
                      onChange={(e) => setNewCrop({...newCrop, expectedHarvest: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (hectares) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={newCrop.area || ''}
                    onChange={(e) => setNewCrop({...newCrop, area: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 5.2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Stage
                  </label>
                  <select
                    value={newCrop.currentStage || 'Germination'}
                    onChange={(e) => setNewCrop({...newCrop, currentStage: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Tillering">Tillering</option>
                    <option value="Stem Extension">Stem Extension</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Grain Filling">Grain Filling</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Health Status
                  </label>
                  <select
                    value={newCrop.health || 'good'}
                    onChange={(e) => setNewCrop({...newCrop, health: e.target.value as 'excellent' | 'good' | 'fair' | 'poor'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                    {cropIcons.map((icon, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setNewCrop({...newCrop, icon})}
                        className={`p-2 text-xl border rounded-lg hover:bg-gray-50 ${
                          newCrop.icon === icon ? 'border-green-500 bg-green-50' : 'border-gray-300'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                <button
                  onClick={() => setShowAddCropModal(false)}
                  className="w-full sm:flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewCrop}
                  className="w-full sm:flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Crop
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Crop Details & Growth Stages */}
          <div className="lg:col-span-2">
            {/* Selected Crop Overview */}
            <div className="card-elegant p-4 lg:p-6 mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-3">
                <div className="flex items-center space-x-3 lg:space-x-4">
                  <div className="text-3xl lg:text-4xl">{selectedCropData.icon}</div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{selectedCropData.name}</h2>
                    <p className="text-sm lg:text-base text-gray-600">{selectedCropData.variety}</p>
                  </div>
                </div>
                <div className={`px-3 py-2 lg:px-4 lg:py-2 rounded-full border text-sm lg:text-base ${getHealthColor(selectedCropData.health)}`}>
                  {selectedCropData.health.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-4 lg:mb-6">
                <div className="text-center p-3 lg:p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl lg:text-2xl mb-1 lg:mb-2">📅</div>
                  <div className="text-xs lg:text-sm text-gray-600">Planted</div>
                  <div className="font-bold text-gray-900 text-xs lg:text-sm">{selectedCropData.plantingDate}</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-green-50 rounded-lg">
                  <div className="text-xl lg:text-2xl mb-1 lg:mb-2">🚜</div>
                  <div className="text-xs lg:text-sm text-gray-600">Harvest</div>
                  <div className="font-bold text-gray-900 text-xs lg:text-sm">{selectedCropData.expectedHarvest}</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl lg:text-2xl mb-1 lg:mb-2">📏</div>
                  <div className="text-xs lg:text-sm text-gray-600">Area</div>
                  <div className="font-bold text-gray-900 text-xs lg:text-sm">{selectedCropData.area} ha</div>
                </div>
                <div className="text-center p-3 lg:p-4 bg-orange-50 rounded-lg">
                  <div className="text-xl lg:text-2xl mb-1 lg:mb-2">📊</div>
                  <div className="text-xs lg:text-sm text-gray-600">Progress</div>
                  <div className="font-bold text-gray-900 text-xs lg:text-sm">{selectedCropData.progress}%</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500 to-lime-500 text-white p-3 lg:p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm lg:text-base">Current Stage: {selectedCropData.currentStage}</div>
                    <div className="text-green-100 text-xs lg:text-sm">Growth is on track</div>
                  </div>
                  <div className="text-xl lg:text-2xl font-bold">{selectedCropData.progress}%</div>
                </div>
                <div className="mt-2 lg:mt-3 bg-green-400 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${selectedCropData.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Growth Stages */}
            <div className="card-elegant p-4 lg:p-6">
              <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Growth Stages</h2>
              
              <div className="space-y-3 lg:space-y-4">
                {growthStages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-3 lg:space-x-4">
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold ${getStageStatus(stage.status)}`}>
                      {stage.status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1 sm:gap-0">
                        <h3 className="font-bold text-sm lg:text-base text-gray-900">{stage.stage}</h3>
                        <div className="text-xl lg:text-2xl">{stage.icon}</div>
                      </div>
                      <p className="text-gray-600 text-xs lg:text-sm mb-1">{stage.description}</p>
                      <p className="text-gray-500 text-xs">Duration: {stage.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disease Alerts & Actions */}
          <div className="lg:col-span-1">
            {/* Disease Alerts */}
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Disease Alerts</h3>
              
              {diseaseAlerts.length > 0 ? (
                <div className="space-y-4">
                  {diseaseAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{alert.disease}</h4>
                        <span className="text-xs px-2 py-1 rounded-full bg-white">
                          {alert.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm mb-2">
                        <strong>{alert.crop}</strong> - {alert.affected}% affected
                      </p>
                      <p className="text-xs mb-2">{alert.treatment}</p>
                      <p className="text-xs opacity-75">Detected {alert.detected}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-gray-600">No disease alerts</p>
                  <p className="text-sm text-gray-500">All crops are healthy</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary text-sm">
                  📸 Upload Field Photo
                </button>
                <button className="w-full btn-secondary text-sm">
                  🔍 Disease Scan
                </button>
                <button className="w-full btn-secondary text-sm">
                  📊 Growth Report
                </button>
                <button className="w-full btn-secondary text-sm">
                  ⏰ Set Reminders
                </button>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card-elegant p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl">💧</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Irrigation</div>
                    <div className="text-xs text-gray-500">2 hours ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl">🌱</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Fertilizer Applied</div>
                    <div className="text-xs text-gray-500">1 day ago</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-xl">🔍</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Field Inspection</div>
                    <div className="text-xs text-gray-500">3 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CropMonitoring