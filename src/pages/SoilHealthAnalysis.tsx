import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Field, FieldSoilData, FieldAnalysis } from '../types/field'
import { 
  getAllFields, 
  getFieldSoilData, 
  getFieldAnalysis,
  updateFieldSoilData,
  createFieldSoilData
} from '../services/fieldService'
import { useField } from '../contexts/FieldContext'
import FieldEditor from '../components/FieldEditor'

interface SoilData {
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  moisture: number
  temperature: number
  conductivity: number
}

interface NutrientRecommendation {
  nutrient: string
  current: number
  optimal: {
    min: number
    max: number
    display: string
  }
  recommendation: string
  priority: 'high' | 'medium' | 'low'
  status: 'low' | 'optimal' | 'high'
  icon: string
  fertilizer?: {
    name: string
    amount: string
    timing: string
    application: string
  }
}

const SoilHealthAnalysis = () => {
  const { t } = useTranslation()
  const { fields, selectedField, setSelectedField, loading } = useField()
  const [analysisDate, setAnalysisDate] = useState(new Date().toISOString().split('T')[0])
  const [fieldSoilData, setFieldSoilData] = useState<FieldSoilData | null>(null)
  const [fieldAnalysis, setFieldAnalysis] = useState<FieldAnalysis | null>(null)
  const [dataLoading, setDataLoading] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showInputForm, setShowInputForm] = useState(false)
  const [showFieldEditor, setShowFieldEditor] = useState(false)
  const [editingField, setEditingField] = useState<Field | null>(null)
  const [userSoilData, setUserSoilData] = useState<SoilData>({
    ph: 7.0,
    nitrogen: 200,
    phosphorus: 30,
    potassium: 150,
    organicMatter: 3.5,
    moisture: 25,
    temperature: 25,
    conductivity: 1.2
  })

  // Load field-specific data when selected field changes
  useEffect(() => {
    const loadFieldData = async () => {
      if (!selectedField) {
        setFieldSoilData(null)
        setFieldAnalysis(null)
        return
      }

      try {
        setDataLoading(true)
        const [soilData, analysis] = await Promise.all([
          getFieldSoilData(selectedField.id),
          getFieldAnalysis(selectedField.id)
        ])
        setFieldSoilData(soilData)
        setFieldAnalysis(analysis)
        if (soilData) {
          setAnalysisDate(new Date(soilData.lastUpdated).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }))
        }
      } catch (error) {
        // Silently handle error to avoid console spam
        setFieldSoilData(null)
        setFieldAnalysis(null)
      } finally {
        setDataLoading(false)
      }
    }

    loadFieldData()
  }, [selectedField])

  const handleFieldSave = (savedField: Field) => {
    refreshFields()
    setShowFieldEditor(false)
    setEditingField(null)
    if (!selectedField) {
      handleFieldSelect(savedField)
    }
  }

  const handleFieldCancel = () => {
    setShowFieldEditor(false)
    setEditingField(null)
  }

  const openFieldEditor = (field?: Field) => {
    setEditingField(field || null)
    setShowFieldEditor(true)
  }
   const handleFieldSelect = (field: Field) => {
     setSelectedField(field)
   }

   const handleSoilDataUpdate = async (newData: Partial<SoilData>) => {
    setUserSoilData(prev => ({ ...prev, ...newData }))
    
    if (selectedField) {
      try {
        await updateFieldSoilData(selectedField.id, {
          ph: newData.ph ?? userSoilData.ph,
          nitrogen: newData.nitrogen ?? userSoilData.nitrogen,
          phosphorus: newData.phosphorus ?? userSoilData.phosphorus,
          potassium: newData.potassium ?? userSoilData.potassium,
          organicMatter: newData.organicMatter ?? userSoilData.organicMatter,
          moisture: newData.moisture ?? userSoilData.moisture,
          temperature: newData.temperature ?? userSoilData.temperature,
          conductivity: newData.conductivity ?? userSoilData.conductivity
        })
        
        // Refresh field soil data
        const updatedSoilData = await getFieldSoilData(selectedField.id)
        if (updatedSoilData) {
          setFieldSoilData(updatedSoilData)
        }
      } catch (error) {
        console.error('Error updating soil data:', error)
      }
    }
  }

  // Convert field soil data to component format (either from field data or user input)
 // Soil type classification based on pH and other parameters
  const getSoilType = (soilData: SoilData): string => {
    const { ph, organicMatter, conductivity } = soilData;
    
    if (ph < 5.5) {
      return organicMatter > 3 ? 'Acidic Organic' : 'Acidic Mineral';
    } else if (ph > 8.5) {
      return conductivity > 4 ? 'Alkaline Saline' : 'Alkaline';
    } else if (ph >= 6.0 && ph <= 7.5) {
      if (organicMatter > 4) return 'Neutral Organic Rich';
      if (conductivity > 2) return 'Neutral Saline';
      return 'Neutral Loamy';
    } else if (ph < 6.0) {
      return 'Slightly Acidic';
    } else {
      return 'Slightly Alkaline';
    }
  };

  // Get soil type specific recommendations
  const getSoilTypeRecommendations = (soilType: string, soilData: SoilData): string[] => {
    const recommendations: string[] = [];
    
    switch (soilType) {
      case 'Acidic Organic':
        recommendations.push('Apply lime to raise pH to 6.0-7.0 range');
        recommendations.push('Excellent for acid-loving crops like blueberries, potatoes');
        recommendations.push('Monitor aluminum toxicity levels');
        break;
      
      case 'Acidic Mineral':
        recommendations.push('Apply agricultural lime (2-4 tons/hectare)');
        recommendations.push('Add organic matter to improve soil structure');
        recommendations.push('Use phosphorus fertilizers carefully due to fixation');
        break;
      
      case 'Alkaline Saline':
        recommendations.push('Apply gypsum to reduce salinity');
        recommendations.push('Improve drainage to prevent salt accumulation');
        recommendations.push('Use salt-tolerant crops like barley, sugar beet');
        break;
      
      case 'Alkaline':
        recommendations.push('Apply sulfur or organic acids to lower pH');
        recommendations.push('Use iron chelates for micronutrient deficiency');
        recommendations.push('Avoid over-irrigation to prevent further alkalinization');
        break;
      
      case 'Neutral Organic Rich':
        recommendations.push('Ideal soil condition - maintain current practices');
        recommendations.push('Suitable for most crops including vegetables, grains');
        recommendations.push('Continue organic matter additions');
        break;
      
      case 'Neutral Saline':
        recommendations.push('Improve drainage and leach excess salts');
        recommendations.push('Apply gypsum to displace sodium');
        recommendations.push('Monitor EC levels regularly');
        break;
      
      case 'Neutral Loamy':
        recommendations.push('Excellent soil for most crops');
        recommendations.push('Maintain balanced fertilization');
        recommendations.push('Practice crop rotation for sustainability');
        break;
      
      case 'Slightly Acidic':
        recommendations.push('Minor lime application may be beneficial');
        recommendations.push('Good for most crops, excellent for legumes');
        recommendations.push('Monitor phosphorus availability');
        break;
      
      case 'Slightly Alkaline':
        recommendations.push('Monitor for micronutrient deficiencies');
        recommendations.push('Suitable for most field crops');
        recommendations.push('Add organic matter to buffer pH');
        break;
      
      default:
        recommendations.push('Regular soil testing recommended');
        recommendations.push('Maintain balanced nutrition program');
    }
    
    // Add nutrient-specific recommendations
    if (soilData.nitrogen < 20) {
      recommendations.push('Apply nitrogen fertilizer (urea or ammonium sulfate)');
    } else if (soilData.nitrogen > 50) {
      recommendations.push('Reduce nitrogen application to prevent leaching');
    }
    
    if (soilData.phosphorus < 15) {
      recommendations.push('Apply phosphorus fertilizer (DAP or SSP)');
    }
    
    if (soilData.potassium < 100) {
      recommendations.push('Apply potassium fertilizer (MOP or SOP)');
    }
    
    if (soilData.organicMatter < 2) {
      recommendations.push('Increase organic matter through compost or green manure');
    }
    
    return recommendations;
  };

  const getDisplaySoilData = (): SoilData | null => {
    if (showInputForm) {
      return userSoilData
    }
    if (!fieldSoilData) return null
    return {
      ph: fieldSoilData.ph,
      nitrogen: fieldSoilData.nitrogen,
      phosphorus: fieldSoilData.phosphorus,
      potassium: fieldSoilData.potassium,
      organicMatter: fieldSoilData.organicMatter,
      moisture: fieldSoilData.moisture,
      temperature: fieldSoilData.temperature,
      conductivity: fieldSoilData.conductivity
    }
  }

  // Generate nutrient recommendations from field analysis or user input
  const getNutrientRecommendations = (): NutrientRecommendation[] => {
    const soilData = getDisplaySoilData()
    if (!soilData) return []
    
    const recommendations: NutrientRecommendation[] = []
    
    // Calculate nitrogen status and recommendations
    const nitrogenStatus = soilData.nitrogen < 150 ? 'low' : soilData.nitrogen > 300 ? 'high' : 'optimal'
    recommendations.push({
      nutrient: 'Nitrogen (N)',
      current: soilData.nitrogen,
      optimal: {
        min: 150,
        max: 300,
        display: '150-300 ppm'
      },
      recommendation: nitrogenStatus === 'low' ? 'Apply nitrogen-rich fertilizer like Urea (46-0-0) at 100-150 kg/ha' : 
                    nitrogenStatus === 'high' ? 'Reduce nitrogen application and monitor soil levels' : 'Maintain current nitrogen management practices',
      priority: nitrogenStatus === 'optimal' ? 'low' : 'high',
      status: nitrogenStatus,
      icon: '🌱',
      fertilizer: nitrogenStatus === 'low' ? {
        name: 'Urea (46-0-0)',
        amount: '100-150 kg/ha',
        timing: 'Split application: 50% at sowing, 25% at tillering, 25% at panicle initiation',
        application: 'Broadcast and incorporate into soil, avoid direct contact with seeds'
      } : nitrogenStatus === 'high' ? {
        name: 'Reduce current fertilizer',
        amount: 'Skip next application',
        timing: 'Monitor soil levels monthly',
        application: 'Allow natural depletion through crop uptake'
      } : undefined
    })
    
    // Calculate phosphorus status and recommendations
    const phosphorusStatus = soilData.phosphorus < 20 ? 'low' : soilData.phosphorus > 50 ? 'high' : 'optimal'
    recommendations.push({
      nutrient: 'Phosphorus (P)',
      current: soilData.phosphorus,
      optimal: {
        min: 20,
        max: 50,
        display: '20-50 ppm'
      },
      recommendation: phosphorusStatus === 'low' ? 'Apply phosphorus fertilizer like DAP (18-46-0) at 75-100 kg/ha' : 
                    phosphorusStatus === 'high' ? 'Reduce phosphorus application and use low-P fertilizers' : 'Maintain current phosphorus levels',
      priority: phosphorusStatus === 'optimal' ? 'low' : 'medium',
      status: phosphorusStatus,
      icon: '🧪',
      fertilizer: phosphorusStatus === 'low' ? {
        name: 'DAP (18-46-0)',
        amount: '75-100 kg/ha',
        timing: 'Apply at sowing as basal dose',
        application: 'Place 2-3 cm below and to the side of seeds'
      } : phosphorusStatus === 'high' ? {
        name: 'Reduce phosphorus input',
        amount: 'Use low-P fertilizers',
        timing: 'Next growing season',
        application: 'Switch to nitrogen-only fertilizers temporarily'
      } : undefined
    })
    
    // Calculate potassium status and recommendations
    const potassiumStatus = soilData.potassium < 100 ? 'low' : soilData.potassium > 200 ? 'high' : 'optimal'
    recommendations.push({
      nutrient: 'Potassium (K)',
      current: soilData.potassium,
      optimal: {
        min: 100,
        max: 200,
        display: '100-200 ppm'
      },
      recommendation: potassiumStatus === 'low' ? 'Apply potassium fertilizer like MOP (0-0-60) at 50-75 kg/ha' : 
                    potassiumStatus === 'high' ? 'Reduce potassium application and monitor levels' : 'Maintain current potassium management',
      priority: potassiumStatus === 'optimal' ? 'low' : 'medium',
      status: potassiumStatus,
      icon: '⚡',
      fertilizer: potassiumStatus === 'low' ? {
        name: 'MOP (0-0-60)',
        amount: '50-75 kg/ha',
        timing: 'Apply at sowing and top-dress at flowering',
        application: 'Broadcast and incorporate, avoid chloride-sensitive crops'
      } : potassiumStatus === 'high' ? {
        name: 'Reduce potassium input',
        amount: 'Skip K fertilizers',
        timing: 'Current season',
        application: 'Use NPK with lower K content'
      } : undefined
    })

    // Add organic matter recommendation
    const organicMatterStatus = soilData.organicMatter < 2.5 ? 'low' : soilData.organicMatter > 5.0 ? 'high' : 'optimal'
    recommendations.push({
      nutrient: 'Organic Matter',
      current: soilData.organicMatter,
      optimal: {
        min: 2.5,
        max: 5.0,
        display: '2.5-5.0%'
      },
      recommendation: organicMatterStatus === 'low' ? 'Increase organic matter through compost, crop residues, and cover crops' : 
                    organicMatterStatus === 'high' ? 'Maintain current organic matter levels' : 'Continue good organic matter management',
      priority: organicMatterStatus === 'low' ? 'high' : 'low',
      status: organicMatterStatus,
      icon: '🍂',
      fertilizer: organicMatterStatus === 'low' ? {
        name: 'Compost/FYM',
        amount: '5-10 tons/ha',
        timing: '2-3 weeks before sowing',
        application: 'Incorporate well into soil, ensure proper decomposition'
      } : undefined
    })
    
    return recommendations
  }

  const generateReport = () => {
    if (!selectedField || !fieldSoilData || !fieldAnalysis) return
    
    const reportContent = `SOIL HEALTH ANALYSIS REPORT
=============================

Field Information:
- Field Name: ${selectedField.name}
- Area: ${selectedField.area} hectares
- Location: ${selectedField.location.address}
- Soil Type: ${selectedField.soilType}
- Irrigation: ${selectedField.irrigationType}
- Current Crops: ${selectedField.crops.join(', ')}

Soil Analysis Results (${analysisDate}):
- pH Level: ${fieldSoilData.ph}
- Nitrogen: ${fieldSoilData.nitrogen} ppm
- Phosphorus: ${fieldSoilData.phosphorus} ppm
- Potassium: ${fieldSoilData.potassium} ppm
- Organic Matter: ${fieldSoilData.organicMatter}%
- Moisture: ${fieldSoilData.moisture}%
- Temperature: ${fieldSoilData.temperature}°C
- Conductivity: ${fieldSoilData.conductivity} dS/m

Soil Health Assessment:
- Overall Health: ${fieldAnalysis.soilHealth.overall.toUpperCase()}
- pH Status: ${fieldAnalysis.soilHealth.ph.status.toUpperCase()}
- Nitrogen Status: ${fieldAnalysis.soilHealth.nutrients.nitrogen.status.toUpperCase()}
- Phosphorus Status: ${fieldAnalysis.soilHealth.nutrients.phosphorus.status.toUpperCase()}
- Potassium Status: ${fieldAnalysis.soilHealth.nutrients.potassium.status.toUpperCase()}

Recommendations:
${fieldAnalysis.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Risk Factors:
${fieldAnalysis.riskFactors.map((risk, index) => `${index + 1}. ${risk}`).join('\n')}

Generated by AgriMitra - AI-Powered Agricultural Platform
Report Date: ${new Date().toLocaleDateString()}
`

    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `soil-health-report-${selectedField?.name || 'field'}-${analysisDate}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const scheduleTest = () => {
    alert('Test scheduling feature coming soon!')
  }

  const setReminders = () => {
    alert('Reminder feature coming soon!')
  }

  const compareFields = () => {
    alert('Field comparison feature coming soon!')
  }

  const runNewAnalysis = async () => {
    if (!selectedField) {
      alert('Please select a field first!')
      return
    }

    setIsAnalyzing(true)
    try {
      // Simulate analysis process
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Refresh the data
      const [soilData, analysis] = await Promise.all([
        getFieldSoilData(selectedField.id),
        getFieldAnalysis(selectedField.id)
      ])
      
      setFieldSoilData(soilData)
      setFieldAnalysis(analysis)
      setAnalysisDate(new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }))
      
      alert('New soil analysis completed successfully!')
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'low': return 'text-red-600 bg-red-50 border-red-200'
      case 'optimal': return 'text-green-600 bg-green-50 border-green-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'low': return '⬇️'
      case 'optimal': return '✅'
      case 'high': return '⬆️'
      default: return '➖'
    }
  }

  const getProgressPercentage = (current: number, optimal: { min: number; max: number }) => {
    if (current < optimal.min) {
      return (current / optimal.min) * 50
    } else if (current > optimal.max) {
      return 100
    } else {
      return 50 + ((current - optimal.min) / (optimal.max - optimal.min)) * 50
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-20">
      <div className="container-custom py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Soil Health Analysis</h1>
            <p className="text-gray-600 mt-2">Monitor and analyze soil conditions for optimal crop growth</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => openFieldEditor()}
              className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Add Field
            </button>
            {selectedField && (
              <button
                onClick={() => openFieldEditor(selectedField)}
                className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Field
              </button>
            )}
          </div>
        </div>

        {/* Field Selection */}
        <div className="card-elegant p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-900">Select Field for Analysis</h2>
            <button 
              onClick={runNewAnalysis}
              disabled={isAnalyzing || !selectedField}
              className={`btn-primary w-full sm:w-auto ${
                isAnalyzing || !selectedField 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'hover:bg-green-700'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <span className="inline-block animate-spin mr-2">⚡</span>
                  Analyzing...
                </>
              ) : (
                <>📊 New Analysis</>
              )}
            </button>
          </div>
          
          {loading || dataLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              <span className="ml-2 text-gray-600">Loading fields...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {fields.map((field) => (
                <button
                  key={field.id}
                  onClick={() => handleFieldSelect(field)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    selectedField?.id === field.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">🌾</div>
                  <div className="font-medium text-sm sm:text-base">{field.name}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{field.area} hectares</div>
                  <div className="text-xs text-gray-400 truncate">{field.location.address}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Soil Overview */}
          <div className="lg:col-span-2">
            {selectedField || showInputForm ? (
              <div className="card-elegant p-4 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {showInputForm ? 'Custom Soil Analysis' : `Soil Overview - ${selectedField?.name}`}
                  </h2>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => setShowInputForm(!showInputForm)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors flex-1 sm:flex-none ${
                        showInputForm 
                          ? 'bg-blue-500 text-white hover:bg-blue-600' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {showInputForm ? '📊 View Field Data' : '✏️ Custom Input'}
                    </button>
                  </div>
                </div>

                {showInputForm && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Enter Soil Parameters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">pH Level</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="14"
                          value={userSoilData.ph}
                          onChange={(e) => setUserSoilData({...userSoilData, ph: parseFloat(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nitrogen (ppm)</label>
                        <input
                          type="number"
                          min="0"
                          value={userSoilData.nitrogen}
                          onChange={(e) => setUserSoilData({...userSoilData, nitrogen: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phosphorus (ppm)</label>
                        <input
                          type="number"
                          min="0"
                          value={userSoilData.phosphorus}
                          onChange={(e) => setUserSoilData({...userSoilData, phosphorus: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Potassium (ppm)</label>
                        <input
                          type="number"
                          min="0"
                          value={userSoilData.potassium}
                          onChange={(e) => setUserSoilData({...userSoilData, potassium: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Moisture (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={userSoilData.moisture}
                          onChange={(e) => setUserSoilData({...userSoilData, moisture: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Temperature (°C)</label>
                        <input
                          type="number"
                          value={userSoilData.temperature}
                          onChange={(e) => setUserSoilData({...userSoilData, temperature: parseInt(e.target.value) || 0})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organic Matter (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={userSoilData.organicMatter}
                          onChange={(e) => handleSoilDataUpdate({ organicMatter: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Conductivity (dS/m)</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={userSoilData.conductivity}
                          onChange={(e) => handleSoilDataUpdate({ conductivity: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                  <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl sm:text-3xl mb-2">🧪</div>
                    <div className="text-xs sm:text-sm text-gray-600">pH Level</div>
                    <div className="text-lg sm:text-2xl font-bold text-blue-600">{getDisplaySoilData()?.ph || 'N/A'}</div>
                    <div className="text-xs text-gray-500">
                      {getDisplaySoilData()?.ph ? (getDisplaySoilData()!.ph < 6.5 ? 'Acidic' : getDisplaySoilData()!.ph > 7.5 ? 'Alkaline' : 'Neutral') : 'No data'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl sm:text-3xl mb-2">💧</div>
                    <div className="text-xs sm:text-sm text-gray-600">Moisture</div>
                    <div className="text-lg sm:text-2xl font-bold text-green-600">{getDisplaySoilData()?.moisture || 'N/A'}%</div>
                    <div className="text-xs text-gray-500">
                      {getDisplaySoilData()?.moisture ? (getDisplaySoilData()!.moisture > 25 ? 'Optimal' : 'Low') : 'No data'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl sm:text-3xl mb-2">🌡️</div>
                    <div className="text-xs sm:text-sm text-gray-600">Temperature</div>
                    <div className="text-lg sm:text-2xl font-bold text-orange-600">{getDisplaySoilData()?.temperature || 'N/A'}°C</div>
                    <div className="text-xs text-gray-500">
                      {getDisplaySoilData()?.temperature ? (getDisplaySoilData()!.temperature > 20 && getDisplaySoilData()!.temperature < 30 ? 'Good' : 'Moderate') : 'No data'}
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                    <div className="text-xs sm:text-sm text-gray-600">Conductivity</div>
                    <div className="text-lg sm:text-2xl font-bold text-purple-600">{getDisplaySoilData()?.conductivity || 'N/A'}</div>
                    <div className="text-xs text-gray-500">dS/m</div>
                  </div>
                </div>

                {/* Soil Type Classification */}
                {getDisplaySoilData() && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl mr-3">🏞️</div>
                      <h3 className="text-lg font-semibold text-indigo-800">Soil Type Classification</h3>
                    </div>
                    <div className="text-xl font-bold text-indigo-900 mb-2">
                      {getSoilType(getDisplaySoilData()!)}
                    </div>
                    <div className="text-sm text-indigo-700">
                      Based on pH ({getDisplaySoilData()!.ph}), organic matter ({getDisplaySoilData()!.organicMatter}%), and conductivity ({getDisplaySoilData()!.conductivity} dS/m)
                    </div>
                  </div>
                )}

                {/* Soil Type Recommendations */}
                {getDisplaySoilData() && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center mb-3">
                      <div className="text-2xl mr-3">💡</div>
                      <h3 className="text-lg font-semibold text-green-800">Soil Type Recommendations</h3>
                    </div>
                    <div className="space-y-2">
                      {getSoilTypeRecommendations(getSoilType(getDisplaySoilData()!), getDisplaySoilData()!).map((recommendation, index) => (
                        <div key={index} className="flex items-start">
                          <div className="text-green-600 mr-2 mt-1">•</div>
                          <div className="text-sm text-green-800">{recommendation}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Overall Health Score */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Overall Soil Health Score</h3>
                      <p className="text-green-100">Based on comprehensive analysis</p>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-bold">{fieldAnalysis?.healthScore || 85}</div>
                      <div className="text-green-100">out of 100</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card-elegant p-6 mb-8">
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌾</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Field</h3>
                  <p className="text-gray-500">Choose a field above to view its soil analysis</p>
                </div>
              </div>
            )}
            {/* Nutrient Analysis */}
             {(selectedField || showInputForm) && (
              <div className="card-elegant p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Nutrient Analysis</h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {getNutrientRecommendations().map((nutrient, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-xl sm:text-2xl">{nutrient.icon}</div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{nutrient.nutrient}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">
                            Current: {nutrient.current} | Optimal: {nutrient.optimal.min}-{nutrient.optimal.max}
                          </p>
                        </div>
                      </div>
                      <div className={`px-2 sm:px-3 py-1 rounded-full border text-xs sm:text-sm font-medium self-start ${getStatusColor(nutrient.status)}`}>
                        {getStatusIcon(nutrient.status)} {nutrient.status?.toUpperCase() || 'UNKNOWN'}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Low</span>
                        <span className="hidden sm:inline">Optimal Range</span>
                        <span className="sm:hidden">Optimal</span>
                        <span>High</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                        <div className="bg-gray-300 rounded-full h-2 sm:h-3 relative">
                          {/* Optimal range indicator */}
                          <div 
                            className="absolute bg-green-400 h-2 sm:h-3 rounded-full"
                            style={{
                              left: '50%',
                              width: '50%'
                            }}
                          ></div>
                          {/* Current level indicator */}
                          <div 
                            className="absolute bg-blue-500 h-2 sm:h-3 w-1 rounded-full"
                            style={{
                              left: `${getProgressPercentage(nutrient.current, nutrient.optimal)}%`
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Recommendation</h4>
                      <p className="text-gray-700 text-xs sm:text-sm mb-3">{nutrient.recommendation}</p>
                      
                      {/* Fertilizer Details */}
                      {nutrient.fertilizer && (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 mt-3">
                          <h5 className="font-semibold text-green-800 mb-3 flex items-center text-sm sm:text-base">
                            <span className="mr-2">🌾</span>
                            Fertilizer Recommendation
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Fertilizer:</span>
                              <p className="text-gray-600">{nutrient.fertilizer.name}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Amount:</span>
                              <p className="text-gray-600">{nutrient.fertilizer.amount}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="font-medium text-gray-700">Timing:</span>
                              <p className="text-gray-600">{nutrient.fertilizer.timing}</p>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="font-medium text-gray-700">Application:</span>
                              <p className="text-gray-600">{nutrient.fertilizer.application}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}
          </div>

          {/* Recommendations & Actions */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={runNewAnalysis}
                  disabled={isAnalyzing || !selectedField}
                  className={`w-full text-sm transition-colors ${
                    isAnalyzing || !selectedField 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : 'btn-primary hover:bg-green-700'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <span className="inline-block animate-spin mr-2">⚡</span>
                      Running Analysis...
                    </>
                  ) : (
                    <>🔬 Run New Analysis</>
                  )}
                </button>
                <button 
                  onClick={generateReport}
                  className="w-full btn-primary text-sm hover:bg-green-700 transition-colors"
                >
                  📋 Generate Report
                </button>
                <button 
                  onClick={scheduleTest}
                  className="w-full btn-secondary text-sm hover:bg-gray-300 transition-colors"
                >
                  🧪 Schedule Test
                </button>
                <button 
                  onClick={setReminders}
                  className="w-full btn-secondary text-sm hover:bg-gray-300 transition-colors"
                >
                  📱 Set Reminders
                </button>
                <button 
                  onClick={compareFields}
                  className="w-full btn-secondary text-sm hover:bg-gray-300 transition-colors"
                >
                  📊 Compare Fields
                </button>
              </div>
            </div>

            {/* Fertilizer Recommendations */}
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                <span className="mr-2">🌾</span>
                Smart Fertilizer Plan
              </h3>
              {selectedField && fieldAnalysis ? (
                <div className="space-y-4">
                  {getNutrientRecommendations()
                    .filter(nutrient => nutrient.fertilizer)
                    .map((nutrient, index) => (
                    <div key={index} className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">{nutrient.icon}</span>
                        <span className="font-semibold text-green-900">{nutrient.fertilizer?.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          nutrient.priority === 'high' ? 'bg-red-100 text-red-800' :
                          nutrient.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {nutrient.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <p className="text-green-800 text-sm mb-1 font-medium">{nutrient.fertilizer?.amount}</p>
                      <p className="text-green-700 text-xs">{nutrient.fertilizer?.timing}</p>
                    </div>
                  ))}
                  {getNutrientRecommendations().filter(nutrient => nutrient.fertilizer).length === 0 && (
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <span className="text-2xl mb-2 block">✅</span>
                      <p className="text-green-800 font-medium">All nutrients are optimal!</p>
                      <p className="text-green-600 text-sm">No additional fertilizers needed at this time.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <span className="text-2xl mb-2 block">🌱</span>
                  <p className="text-gray-600">Select a field to view fertilizer recommendations</p>
                </div>
              )}
            </div>

            {/* Historical Trends */}
            <div className="card-elegant p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trends</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">pH Level</span>
                  <span className="text-sm font-medium text-green-600">↗️ Improving</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Nitrogen</span>
                  <span className="text-sm font-medium text-blue-600">→ Stable</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Phosphorus</span>
                  <span className="text-sm font-medium text-red-600">↘️ Declining</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Organic Matter</span>
                  <span className="text-sm font-medium text-green-600">↗️ Improving</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Field Editor Modal */}
      <FieldEditor
        field={editingField}
        onSave={handleFieldSave}
        onCancel={handleFieldCancel}
        isOpen={showFieldEditor}
      />
    </div>
  )
}

export default SoilHealthAnalysis