import { useState, useEffect } from 'react'
import { sampleCrops, yieldPredictions, recommendations } from '../utils/mockData'
import { Crop, YieldPrediction } from '../types'

export const useCropData = () => {
  const [crops, setCrops] = useState<Crop[]>(sampleCrops)
  const [predictions, setPredictions] = useState<YieldPrediction[]>(yieldPredictions)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCropById = (id: number) => {
    return crops.find(crop => crop.id === id)
  }

  const getPredictionByCropId = (cropId: number) => {
    return predictions.find(pred => pred.cropId === cropId)
  }

  const getRecommendationsByCropId = (cropId: number) => {
    return recommendations.filter(rec => rec.cropId === cropId)
  }

  const updateCropHealth = (cropId: number, healthScore: number) => {
    setCrops(prev => prev.map(crop => 
      crop.id === cropId 
        ? { 
            ...crop, 
            healthScore,
            status: healthScore >= 80 ? 'healthy' : healthScore >= 60 ? 'warning' : 'critical'
          }
        : crop
    ))
  }

  const addCrop = (crop: Omit<Crop, 'id'>) => {
    const newCrop: Crop = {
      ...crop,
      id: Math.max(...crops.map(c => c.id)) + 1
    }
    setCrops(prev => [...prev, newCrop])
  }

  const updateCrop = (id: number, updates: Partial<Crop>) => {
    setCrops(prev => prev.map(crop => 
      crop.id === id ? { ...crop, ...updates } : crop
    ))
  }

  const deleteCrop = (id: number) => {
    setCrops(prev => prev.filter(crop => crop.id !== id))
  }

  const getCropStats = () => {
    const totalCrops = crops.length
    const healthyCrops = crops.filter(crop => crop.status === 'healthy').length
    const warningCrops = crops.filter(crop => crop.status === 'warning').length
    const criticalCrops = crops.filter(crop => crop.status === 'critical').length
    const averageHealth = crops.reduce((sum, crop) => sum + crop.healthScore, 0) / totalCrops
    const totalArea = crops.reduce((sum, crop) => sum + crop.area, 0)

    return {
      totalCrops,
      healthyCrops,
      warningCrops,
      criticalCrops,
      averageHealth: Math.round(averageHealth),
      totalArea
    }
  }

  const refreshData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In real app, fetch from API
    } catch (err) {
      setError('Failed to fetch crop data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshData()
  }, [])

  return {
    crops,
    predictions,
    recommendations,
    loading,
    error,
    getCropById,
    getPredictionByCropId,
    getRecommendationsByCropId,
    updateCropHealth,
    addCrop,
    updateCrop,
    deleteCrop,
    getCropStats,
    refreshData
  }
}
