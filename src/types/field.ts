export interface Field {
  id: string
  name: string
  area: number // in hectares
  location: {
    latitude?: number
    longitude?: number
    address: string
    district: string
    state: string
  }
  soilType: string
  irrigationType: 'manual' | 'drip' | 'sprinkler' | 'flood' | 'none'
  crops: string[] // current crops grown
  establishedDate: string
  lastSoilTest?: string
  status: 'active' | 'fallow' | 'preparation'
  owner: string
  notes?: string
}

export interface FieldSoilData {
  fieldId: string
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  moisture: number
  temperature: number
  conductivity: number
  lastUpdated: string
}

export interface FieldCropData {
  fieldId: string
  cropId: string
  cropName: string
  variety: string
  plantingDate: string
  expectedHarvest: string
  currentStage: string
  healthScore: number
  progress: number
}

export interface FieldAnalysis {
  fieldId: string
  soilHealth: {
    overall: 'excellent' | 'good' | 'fair' | 'poor'
    ph: { value: number; status: 'low' | 'optimal' | 'high' }
    nutrients: {
      nitrogen: { value: number; status: 'low' | 'optimal' | 'high' }
      phosphorus: { value: number; status: 'low' | 'optimal' | 'high' }
      potassium: { value: number; status: 'low' | 'optimal' | 'high' }
    }
    organicMatter: { value: number; status: 'low' | 'optimal' | 'high' }
  }
  recommendations: string[]
  riskFactors: string[]
  lastAnalyzed: string
}