export interface Crop {
  id: number
  name: string
  variety: string
  plantingDate: string
  expectedYield: number
  currentStage: string
  healthScore: number
  fieldId: number
  area: number
  status: 'healthy' | 'warning' | 'critical'
}

export interface CropStage {
  id: number
  name: string
  duration: number
  description: string
  requirements: string[]
}

export interface YieldPrediction {
  cropId: number
  predictedYield: number
  confidence: number
  factors: {
    weather: number
    soil: number
    irrigation: number
    pestControl: number
  }
  risks: string[]
  recommendations: string[]
}

export interface CropRecommendation {
  id: number
  cropId: number
  type: 'irrigation' | 'fertilization' | 'pest_control' | 'harvesting' | 'planting'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  action: string
  timing: string
  cost: number
  expectedImpact: number
}
