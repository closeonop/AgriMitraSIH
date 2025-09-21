import { Field, FieldSoilData, FieldCropData, FieldAnalysis } from '../types/field'

// Mock field data for demonstration
const mockFields: Field[] = [
  {
    id: 'field-001',
    name: 'North Field',
    area: 2.5,
    location: {
      latitude: 20.2961,
      longitude: 85.8245,
      address: 'Village Khurda, Khurda District',
      district: 'Khurda',
      state: 'Odisha'
    },
    soilType: 'Alluvial',
    irrigationType: 'drip',
    crops: ['Rice', 'Wheat'],
    establishedDate: '2020-01-15',
    lastSoilTest: '2024-01-15',
    status: 'active',
    owner: 'Farmer A',
    notes: 'High-yield field with good drainage'
  },
  {
    id: 'field-002',
    name: 'South Field',
    area: 3.2,
    location: {
      latitude: 20.2850,
      longitude: 85.8150,
      address: 'Village Bhubaneswar, Khurda District',
      district: 'Khurda',
      state: 'Odisha'
    },
    soilType: 'Clay',
    irrigationType: 'sprinkler',
    crops: ['Cotton', 'Sugarcane'],
    establishedDate: '2019-03-20',
    lastSoilTest: '2024-02-10',
    status: 'active',
    owner: 'Farmer A',
    notes: 'Requires careful water management'
  },
  {
    id: 'field-003',
    name: 'East Field',
    area: 1.8,
    location: {
      latitude: 20.3000,
      longitude: 85.8300,
      address: 'Village Jatni, Khurda District',
      district: 'Khurda',
      state: 'Odisha'
    },
    soilType: 'Sandy Loam',
    irrigationType: 'flood',
    crops: ['Maize', 'Vegetables'],
    establishedDate: '2021-06-10',
    lastSoilTest: '2023-12-20',
    status: 'active',
    owner: 'Farmer A',
    notes: 'Good for vegetable cultivation'
  },
  {
    id: 'field-004',
    name: 'Greenhouse Complex',
    area: 0.5,
    location: {
      latitude: 20.2900,
      longitude: 85.8200,
      address: 'Main Farm, Khurda District',
      district: 'Khurda',
      state: 'Odisha'
    },
    soilType: 'Controlled Environment',
    irrigationType: 'drip',
    crops: ['Tomatoes', 'Peppers', 'Herbs'],
    establishedDate: '2022-01-01',
    lastSoilTest: '2024-01-01',
    status: 'active',
    owner: 'Farmer A',
    notes: 'Climate-controlled greenhouse facility'
  }
]

// Mock field soil data
const mockFieldSoilData: Record<string, FieldSoilData> = {
  'field-001': {
    fieldId: 'field-001',
    ph: 6.8,
    nitrogen: 45,
    phosphorus: 32,
    potassium: 58,
    organicMatter: 3.2,
    moisture: 65,
    temperature: 28,
    conductivity: 1.2,
    lastUpdated: '2024-01-15'
  },
  'field-002': {
    fieldId: 'field-002',
    ph: 7.2,
    nitrogen: 38,
    phosphorus: 28,
    potassium: 52,
    organicMatter: 2.8,
    moisture: 70,
    temperature: 26,
    conductivity: 1.5,
    lastUpdated: '2024-02-10'
  },
  'field-003': {
    fieldId: 'field-003',
    ph: 6.5,
    nitrogen: 42,
    phosphorus: 35,
    potassium: 48,
    organicMatter: 3.5,
    moisture: 55,
    temperature: 30,
    conductivity: 1.0,
    lastUpdated: '2023-12-20'
  },
  'field-004': {
    fieldId: 'field-004',
    ph: 6.9,
    nitrogen: 50,
    phosphorus: 40,
    potassium: 62,
    organicMatter: 4.0,
    moisture: 75,
    temperature: 25,
    conductivity: 1.1,
    lastUpdated: '2024-01-01'
  }
}

// Field service functions
export const getAllFields = async (): Promise<Field[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockFields
}

export const getFieldById = async (fieldId: string): Promise<Field | null> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockFields.find(field => field.id === fieldId) || null
}

export const getFieldsByOwner = async (owner: string): Promise<Field[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return mockFields.filter(field => field.owner === owner)
}

export const getFieldSoilData = async (fieldId: string): Promise<FieldSoilData | null> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  return mockFieldSoilData[fieldId] || null
}

export const createField = async (fieldData: Omit<Field, 'id'>): Promise<Field> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const newField: Field = {
    ...fieldData,
    id: `field-${Date.now()}`
  }
  mockFields.push(newField)
  return newField
}

export const updateField = async (fieldId: string, updates: Partial<Field>): Promise<Field | null> => {
  await new Promise(resolve => setTimeout(resolve, 700))
  const fieldIndex = mockFields.findIndex(field => field.id === fieldId)
  if (fieldIndex === -1) return null
  
  mockFields[fieldIndex] = { ...mockFields[fieldIndex], ...updates }
  return mockFields[fieldIndex]
}

export const deleteField = async (fieldId: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  const fieldIndex = mockFields.findIndex(field => field.id === fieldId)
  if (fieldIndex === -1) return false
  
  mockFields.splice(fieldIndex, 1)
  return true
}

export const getFieldAnalysis = async (fieldId: string): Promise<FieldAnalysis | null> => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const soilData = mockFieldSoilData[fieldId]
  if (!soilData) return null

  // Generate analysis based on soil data
  const analysis: FieldAnalysis = {
    fieldId,
    soilHealth: {
      overall: soilData.ph >= 6.5 && soilData.ph <= 7.5 ? 'good' : 'fair',
      ph: {
        value: soilData.ph,
        status: soilData.ph < 6.0 ? 'low' : soilData.ph > 8.0 ? 'high' : 'optimal'
      },
      nutrients: {
        nitrogen: {
          value: soilData.nitrogen,
          status: soilData.nitrogen < 30 ? 'low' : soilData.nitrogen > 60 ? 'high' : 'optimal'
        },
        phosphorus: {
          value: soilData.phosphorus,
          status: soilData.phosphorus < 25 ? 'low' : soilData.phosphorus > 50 ? 'high' : 'optimal'
        },
        potassium: {
          value: soilData.potassium,
          status: soilData.potassium < 40 ? 'low' : soilData.potassium > 70 ? 'high' : 'optimal'
        }
      },
      organicMatter: {
        value: soilData.organicMatter,
        status: soilData.organicMatter < 2.0 ? 'low' : soilData.organicMatter > 4.0 ? 'high' : 'optimal'
      }
    },
    recommendations: generateRecommendations(soilData),
    riskFactors: generateRiskFactors(soilData),
    lastAnalyzed: soilData.lastUpdated
  }

  return analysis
}

const generateRecommendations = (soilData: FieldSoilData): string[] => {
  const recommendations: string[] = []
  
  if (soilData.ph < 6.0) {
    recommendations.push('Apply lime to increase soil pH')
  } else if (soilData.ph > 8.0) {
    recommendations.push('Apply sulfur or organic matter to reduce soil pH')
  }
  
  if (soilData.nitrogen < 30) {
    recommendations.push('Apply nitrogen-rich fertilizer or compost')
  }
  
  if (soilData.phosphorus < 25) {
    recommendations.push('Apply phosphorus fertilizer (DAP or SSP)')
  }
  
  if (soilData.potassium < 40) {
    recommendations.push('Apply potassium fertilizer (MOP or SOP)')
  }
  
  if (soilData.organicMatter < 2.0) {
    recommendations.push('Increase organic matter through composting and cover crops')
  }
  
  if (soilData.moisture < 40) {
    recommendations.push('Improve irrigation scheduling and water retention')
  }
  
  return recommendations
}

const generateRiskFactors = (soilData: FieldSoilData): string[] => {
  const risks: string[] = []
  
  if (soilData.ph < 5.5 || soilData.ph > 8.5) {
    risks.push('Extreme pH levels may affect nutrient availability')
  }
  
  if (soilData.moisture > 80) {
    risks.push('High moisture levels may lead to root rot and fungal diseases')
  } else if (soilData.moisture < 30) {
    risks.push('Low moisture levels may cause drought stress')
  }
  
  if (soilData.conductivity > 2.0) {
    risks.push('High salinity may affect plant growth')
  }
  
  if (soilData.organicMatter < 1.5) {
    risks.push('Low organic matter reduces soil fertility and structure')
  }
  
  return risks
}

// Search and filter functions
export const searchFields = async (query: string): Promise<Field[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const lowercaseQuery = query.toLowerCase()
  return mockFields.filter(field => 
    field.name.toLowerCase().includes(lowercaseQuery) ||
    field.location.address.toLowerCase().includes(lowercaseQuery) ||
    field.soilType.toLowerCase().includes(lowercaseQuery) ||
    field.crops.some(crop => crop.toLowerCase().includes(lowercaseQuery))
  )
}

export const getFieldsByDistrict = async (district: string): Promise<Field[]> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  return mockFields.filter(field => 
    field.location.district.toLowerCase() === district.toLowerCase()
  )
}

export const updateFieldSoilData = async (fieldId: string, soilData: Partial<FieldSoilData>): Promise<FieldSoilData | null> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  
  if (mockFieldSoilData[fieldId]) {
    mockFieldSoilData[fieldId] = {
      ...mockFieldSoilData[fieldId],
      ...soilData,
      lastUpdated: new Date().toISOString().split('T')[0]
    }
    return mockFieldSoilData[fieldId]
  }
  
  return null
}

export const createFieldSoilData = async (fieldId: string, soilData: Omit<FieldSoilData, 'fieldId' | 'lastUpdated'>): Promise<FieldSoilData> => {
  await new Promise(resolve => setTimeout(resolve, 700))
  
  const newSoilData: FieldSoilData = {
    ...soilData,
    fieldId,
    lastUpdated: new Date().toISOString().split('T')[0]
  }
  
  mockFieldSoilData[fieldId] = newSoilData
  return newSoilData
}