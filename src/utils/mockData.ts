import { SoilData } from '../types'
import { Crop, YieldPrediction } from '../types/crop'
import { WeatherData, WeatherAlert, CurrentWeather, WeatherForecast } from '../types/weather'
import type { OdishaTownData } from '../types/weather'

// Location-based weather data for Odisha districts
export const locationWeatherData: Record<string, WeatherData> = {
  'Bhubaneswar': {
    current: {
      temperature: 30,
      humidity: 65,
      rainfall: 0,
      windSpeed: 8,
      pressure: 1012,
      uvIndex: 6,
      condition: 'partly-cloudy',
      icon: 'partly-cloudy',
      timestamp: '2024-03-15T10:30:00Z'
    },
    forecast: [
      { date: '2024-03-15', high: 30, low: 22, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 2, windSpeed: 7, humidity: 55 },
      { date: '2024-03-16', high: 32, low: 24, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 5, humidity: 40 },
      { date: '2024-03-17', high: 31, low: 23, condition: 'cloudy', icon: 'cloudy', rainfall: 8, windSpeed: 9, humidity: 70 },
      { date: '2024-03-18', high: 29, low: 21, condition: 'rainy', icon: 'rainy', rainfall: 18, windSpeed: 14, humidity: 85 },
      { date: '2024-03-19', high: 28, low: 20, condition: 'rainy', icon: 'rainy', rainfall: 20, windSpeed: 16, humidity: 90 },
      { date: '2024-03-20', high: 30, low: 22, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 3, windSpeed: 8, humidity: 60 },
      { date: '2024-03-21', high: 31, low: 23, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 6, humidity: 45 }
    ],
    alerts: [
      { 
        id: 2,
        type: 'warning', 
        title: 'Monsoon Alert', 
        description: 'Heavy rainfall expected in Bhubaneswar district. Farmers advised to protect crops and ensure proper drainage.', 
        severity: 'high',
        startTime: '2024-07-19T00:00:00Z',
        endTime: '2024-07-20T23:59:59Z'
      }
    ]
  },
  'Cuttack': {
    current: {
      temperature: 29,
      humidity: 80,
      rainfall: 5,
      windSpeed: 10,
      pressure: 1010,
      uvIndex: 4,
      condition: 'cloudy',
      icon: 'cloudy',
      timestamp: '2024-03-15T10:30:00Z'
    },
    forecast: [
      { date: '2024-03-15', high: 29, low: 21, condition: 'cloudy', icon: 'cloudy', rainfall: 5, windSpeed: 10, humidity: 75 },
      { date: '2024-03-16', high: 30, low: 22, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 2, windSpeed: 8, humidity: 60 },
      { date: '2024-03-17', high: 28, low: 20, condition: 'rainy', icon: 'rainy', rainfall: 12, windSpeed: 15, humidity: 85 },
      { date: '2024-03-18', high: 31, low: 22, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 1, windSpeed: 7, humidity: 55 },
      { date: '2024-03-19', high: 32, low: 23, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 5, humidity: 40 },
      { date: '2024-03-20', high: 30, low: 21, condition: 'cloudy', icon: 'cloudy', rainfall: 6, windSpeed: 9, humidity: 70 },
      { date: '2024-03-21', high: 29, low: 20, condition: 'rainy', icon: 'rainy', rainfall: 14, windSpeed: 13, humidity: 80 }
    ],
    alerts: [
      { 
        id: 3,
        type: 'info', 
        title: 'Rainfall Alert', 
        description: 'Moderate rainfall expected in Cuttack district on Wednesday and Sunday. Plan agricultural activities accordingly.', 
        severity: 'medium',
        startTime: '2024-07-17T00:00:00Z',
        endTime: '2024-07-18T23:59:59Z'
      }
    ]
  },
  'Puri': {
    current: {
      temperature: 28,
      humidity: 85,
      rainfall: 0,
      windSpeed: 15,
      pressure: 1008,
      uvIndex: 7,
      condition: 'partly-cloudy',
      icon: 'partly-cloudy',
      timestamp: '2024-03-15T10:30:00Z'
    },
    forecast: [
      { date: '2024-03-15', high: 28, low: 24, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 1, windSpeed: 15, humidity: 85 },
      { date: '2024-03-16', high: 29, low: 25, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 12, humidity: 70 },
      { date: '2024-03-17', high: 27, low: 23, condition: 'rainy', icon: 'rainy', rainfall: 10, windSpeed: 18, humidity: 90 },
      { date: '2024-03-18', high: 26, low: 22, condition: 'rainy', icon: 'rainy', rainfall: 16, windSpeed: 20, humidity: 95 },
      { date: '2024-03-19', high: 28, low: 24, condition: 'cloudy', icon: 'cloudy', rainfall: 4, windSpeed: 14, humidity: 80 },
      { date: '2024-03-20', high: 30, low: 25, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 10, humidity: 65 },
      { date: '2024-03-21', high: 29, low: 24, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 2, windSpeed: 13, humidity: 75 }
    ],
    alerts: [
      { 
        id: 1,
        type: 'warning', 
        title: 'Coastal Weather Alert', 
        description: 'Strong coastal winds expected in Puri district. Secure crops and fishing equipment. Monitor cyclone updates.', 
        severity: 'high',
        startTime: '2024-07-21T00:00:00Z',
        endTime: '2024-07-22T23:59:59Z'
      }
    ]
  },
  'Berhampur': {
    current: {
      temperature: 31,
      humidity: 70,
      rainfall: 0,
      windSpeed: 8,
      pressure: 1014,
      uvIndex: 8,
      condition: 'sunny',
      icon: 'sunny',
      timestamp: '2024-03-15T10:30:00Z'
    },
    forecast: [
      { date: '2024-03-15', high: 31, low: 23, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 6, humidity: 45 },
      { date: '2024-03-16', high: 32, low: 24, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 2, windSpeed: 7, humidity: 50 },
      { date: '2024-03-17', high: 30, low: 22, condition: 'cloudy', icon: 'cloudy', rainfall: 5, windSpeed: 8, humidity: 65 },
      { date: '2024-03-18', high: 28, low: 21, condition: 'rainy', icon: 'rainy', rainfall: 15, windSpeed: 12, humidity: 80 },
      { date: '2024-03-19', high: 29, low: 22, condition: 'partly-cloudy', icon: 'partly-cloudy', rainfall: 3, windSpeed: 7, humidity: 55 },
      { date: '2024-03-20', high: 31, low: 23, condition: 'sunny', icon: 'sunny', rainfall: 0, windSpeed: 5, humidity: 40 },
      { date: '2024-03-21', high: 30, low: 22, condition: 'cloudy', icon: 'cloudy', rainfall: 8, windSpeed: 9, humidity: 70 }
    ],
    alerts: [
      { 
        id: 4,
        type: 'warning', 
        title: 'Heat Advisory', 
        description: 'High temperatures expected in Berhampur district. Ensure adequate irrigation and protect crops from heat stress.', 
        severity: 'medium',
        startTime: '2024-07-18T00:00:00Z',
        endTime: '2024-07-19T23:59:59Z'
      }
    ]
  }
}

// Soil health data by location
export const soilHealthData: Record<string, SoilData> = {
  'Bhubaneswar': {
    type: 'Red Laterite',
    ph: 6.2,
    organicMatter: 2.5,
    nitrogen: 'Medium',
    phosphorus: 'Low',
    potassium: 'High',
    recommendations: [
      'Add phosphorus-rich fertilizers for better crop growth',
      'Suitable for rice, vegetables, and fruit cultivation',
      'Improve organic matter content with compost'
    ],
    healthScore: 72
  },
  'Cuttack': {
    type: 'Alluvial',
    ph: 6.8,
    organicMatter: 3.2,
    nitrogen: 'High',
    phosphorus: 'Medium',
    potassium: 'High',
    recommendations: [
      'Excellent for rice cultivation due to high fertility',
      'Maintain proper drainage during monsoon',
      'Regular soil testing recommended'
    ],
    healthScore: 88
  },
  'Puri': {
    type: 'Coastal Sandy',
    ph: 7.1,
    organicMatter: 1.8,
    nitrogen: 'Low',
    phosphorus: 'Low',
    potassium: 'Medium',
    recommendations: [
      'Add organic matter to improve soil structure',
      'Suitable for coconut and cashew cultivation',
      'Regular application of nitrogen fertilizers needed'
    ],
    healthScore: 65
  },
  'Berhampur': {
    type: 'Red Sandy Loam',
    ph: 6.5,
    organicMatter: 2.3,
    nitrogen: 'Medium',
    phosphorus: 'Medium',
    potassium: 'High',
    recommendations: [
      'Good for cotton and groundnut cultivation',
      'Maintain soil moisture during dry periods',
      'Add lime to slightly increase pH'
    ],
    healthScore: 75
  }
}

export const sampleCrops: Crop[] = [
  {
    id: 1,
    name: 'Wheat',
    variety: 'HD-2967',
    plantingDate: '2024-01-15',
    expectedYield: 45.2,
    currentStage: 'Flowering',
    healthScore: 85,
    fieldId: 1,
    area: 2.5,
    status: 'healthy'
  },
  {
    id: 2,
    name: 'Rice',
    variety: 'Pusa Basmati',
    plantingDate: '2024-02-01',
    expectedYield: 38.7,
    currentStage: 'Tillering',
    healthScore: 92,
    fieldId: 2,
    area: 1.8,
    status: 'healthy'
  },
  {
    id: 3,
    name: 'Corn',
    variety: 'Pioneer 3394',
    plantingDate: '2024-02-15',
    expectedYield: 52.3,
    currentStage: 'Vegetative',
    healthScore: 78,
    fieldId: 3,
    area: 3.2,
    status: 'warning'
  },
  {
    id: 4,
    name: 'Cotton',
    variety: 'Bt Cotton',
    plantingDate: '2024-03-01',
    expectedYield: 28.9,
    currentStage: 'Germination',
    healthScore: 65,
    fieldId: 4,
    area: 2.1,
    status: 'warning'
  }
]

export const yieldPredictions: YieldPrediction[] = [
  {
    cropId: 1,
    predictedYield: 45.2,
    confidence: 87,
    factors: {
      weather: 85,
      soil: 90,
      irrigation: 78,
      pestControl: 92
    },
    risks: ['Potential drought in next 2 weeks', 'Aphid infestation risk'],
    recommendations: ['Increase irrigation frequency', 'Apply preventive pest control']
  },
  {
    cropId: 2,
    predictedYield: 38.7,
    confidence: 92,
    factors: {
      weather: 88,
      soil: 85,
      irrigation: 95,
      pestControl: 90
    },
    risks: ['Heavy rainfall expected'],
    recommendations: ['Monitor drainage', 'Adjust fertilizer schedule']
  }
]

export const currentWeather: CurrentWeather = {
  temperature: 28,
  humidity: 65,
  windSpeed: 8,
  uvIndex: 6,
  condition: 'Partly Cloudy',
  icon: 'partly-cloudy',
  timestamp: '2024-03-15T10:30:00Z',
  rainfall: 12,
  pressure: 1013
}

export const weatherForecast: WeatherForecast[] = [
  {
    date: '2024-03-15',
    high: 32,
    low: 18,
    condition: 'Sunny',
    icon: 'sunny',
    rainfall: 0,
    windSpeed: 6,
    humidity: 45
  },
  {
    date: '2024-03-16',
    high: 29,
    low: 20,
    condition: 'Rainy',
    icon: 'rainy',
    rainfall: 15,
    windSpeed: 12,
    humidity: 80
  },
  {
    date: '2024-03-17',
    high: 26,
    low: 16,
    condition: 'Cloudy',
    icon: 'cloudy',
    rainfall: 8,
    windSpeed: 10,
    humidity: 70
  },
  {
    date: '2024-03-18',
    high: 30,
    low: 19,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
    rainfall: 2,
    windSpeed: 7,
    humidity: 55
  },
  {
    date: '2024-03-19',
    high: 33,
    low: 21,
    condition: 'Sunny',
    icon: 'sunny',
    rainfall: 0,
    windSpeed: 5,
    humidity: 40
  },
  {
    date: '2024-03-20',
    high: 31,
    low: 20,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy',
    rainfall: 5,
    windSpeed: 8,
    humidity: 60
  },
  {
    date: '2024-03-21',
    high: 28,
    low: 17,
    condition: 'Rainy',
    icon: 'rainy',
    rainfall: 12,
    windSpeed: 15,
    humidity: 85
  }
]

export const weatherAlerts: WeatherAlert[] = [
  {
    id: 1,
    type: 'warning',
    title: 'Heavy Rain Alert',
    description: 'Heavy rainfall expected in the next 24 hours. Consider delaying field work.',
    severity: 'medium',
    startTime: '2024-03-16T00:00:00Z',
    endTime: '2024-03-17T00:00:00Z'
  },
  {
    id: 2,
    type: 'info',
    title: 'Temperature Drop',
    description: 'Temperature will drop significantly tonight. Protect sensitive crops.',
    severity: 'low',
    startTime: '2024-03-15T18:00:00Z',
    endTime: '2024-03-16T06:00:00Z'
  }
]

export const weatherData: WeatherData = {
  current: currentWeather,
  forecast: weatherForecast,
  alerts: weatherAlerts
}

// Legacy soil health data - now using location-based data above
export const generalSoilHealthData = {
  ph: 6.8,
  nitrogen: 45,
  phosphorus: 32,
  potassium: 58,
  moisture: 65,
  organicMatter: 3.2,
  healthScore: 78,
  recommendations: [
    'Add lime to increase pH level',
    'Apply nitrogen fertilizer',
    'Improve drainage system'
  ]
}

export const recommendations = [
  {
    id: 1,
    cropId: 1,
    type: 'irrigation' as const,
    priority: 'high' as const,
    title: 'Increase Irrigation Frequency',
    description: 'Wheat is in flowering stage and needs more water',
    action: 'Water every 3 days instead of 5 days',
    timing: 'Start immediately',
    cost: 0,
    expectedImpact: 15
  },
  {
    id: 2,
    cropId: 2,
    type: 'fertilization' as const,
    priority: 'medium' as const,
    title: 'Apply Phosphorus Fertilizer',
    description: 'Rice needs more phosphorus for better tillering',
    action: 'Apply 25kg DAP per hectare',
    timing: 'Next 3 days',
    cost: 1500,
    expectedImpact: 12
  },
  {
    id: 3,
    cropId: 3,
    type: 'pest_control' as const,
    priority: 'high' as const,
    title: 'Spray for Corn Borer',
    description: 'Corn borer activity detected in the field',
    action: 'Spray with Bt-based insecticide',
    timing: 'Today evening',
    cost: 800,
    expectedImpact: 20
  }
]

export const chatSuggestions = [
  'What is my expected yield for wheat?',
  'How should I irrigate my crops?',
  'What fertilizer should I use?',
  'Are there any pest problems?',
  'What does the weather forecast say?',
  'When should I harvest?'
]

export const chatbotResponses: Record<string, string> = {
  'yield': 'Based on your current conditions, I predict a yield of 45.2 tons per hectare for wheat. This is 8% higher than last year due to improved soil health and optimal weather conditions.',
  'irrigation': 'For optimal growth, I recommend watering your crops every 3-4 days during the current growth stage. Monitor soil moisture levels and adjust based on weather forecasts.',
  'fertilizer': 'Your soil analysis shows low nitrogen levels. I suggest applying 50kg of urea per hectare before the next irrigation cycle.',
  'pest': 'I\'ve detected signs of aphid infestation in your wheat field. Apply neem oil spray immediately and monitor for 3-5 days.',
  'weather': 'The weather forecast shows 70% chance of rain in the next 3 days. Consider delaying fertilizer application until after the rain.',
  'harvest': 'Based on your crop\'s current stage and weather conditions, optimal harvest time is in 15-20 days. Monitor grain moisture content closely.'
}

// Punjab Towns Weather and Soil Data
// Odisha towns data with weather, soil, and rainfall information
export const odishaTownsData: OdishaTownData[] = [
  {
    id: 'bhubaneswar',
    name: 'Bhubaneswar',
    district: 'Khordha',
    coordinates: { lat: 20.2961, lng: 85.8245 },
    weather: {
      temperature: 30,
      humidity: 75,
      rainfall: 5.2,
      windSpeed: 12,
      pressure: 1012,
      uvIndex: 6,
      condition: 'sunny',
      icon: '☀️',
      timestamp: new Date().toISOString()
    },
    soilQuality: {
      type: 'Red Laterite',
      ph: 6.2,
      nitrogen: 240,
      phosphorus: 28,
      potassium: 320,
      organicMatter: 2.5,
      moisture: 22,
      salinity: 0.3,
      quality: 'good',
      suitableCrops: ['Rice', 'Vegetables', 'Fruits', 'Pulses'],
      recommendations: ['Add phosphorus fertilizers', 'Improve organic content', 'Monitor soil moisture']
    },
    rainfallAnalysis: {
      currentMonth: 125,
      lastMonth: 98,
      yearToDate: 850,
      average: 1200,
      trend: 'increasing',
      prediction: { nextWeek: 45, nextMonth: 180 }
    }
  },
  {
    id: 'cuttack',
    name: 'Cuttack',
    district: 'Cuttack',
    coordinates: { lat: 20.4625, lng: 85.8828 },
    weather: {
      temperature: 29,
      humidity: 80,
      rainfall: 8.5,
      windSpeed: 10,
      pressure: 1014,
      uvIndex: 5,
      condition: 'rainy',
      icon: '🌧️',
      timestamp: new Date().toISOString()
    },
    soilQuality: {
      type: 'Alluvial',
      ph: 6.8,
      nitrogen: 250,
      phosphorus: 45,
      potassium: 320,
      organicMatter: 3.5,
      moisture: 30,
      salinity: 0.3,
      quality: 'excellent',
      suitableCrops: ['Rice', 'Jute', 'Sugarcane', 'Vegetables', 'Coconut'],
      recommendations: ['Excellent soil condition', 'Maintain drainage', 'Continue current practices']
    },
    rainfallAnalysis: {
      currentMonth: 145,
      lastMonth: 112,
      yearToDate: 920,
      average: 1350,
      trend: 'stable',
      prediction: { nextWeek: 55, nextMonth: 200 }
    }
  },
  {
    id: 'puri',
    name: 'Puri',
    district: 'Puri',
    coordinates: { lat: 19.8135, lng: 85.8312 },
    weather: {
      temperature: 28,
      humidity: 85,
      rainfall: 2.8,
      windSpeed: 15,
      pressure: 1010,
      uvIndex: 7,
      condition: 'cloudy',
      icon: '☁️',
      timestamp: new Date().toISOString()
    },
    soilQuality: {
      type: 'Sandy Loam',
      ph: 7.1,
      nitrogen: 180,
      phosphorus: 22,
      potassium: 280,
      organicMatter: 1.8,
      moisture: 15,
      salinity: 1.2,
      quality: 'fair',
      suitableCrops: ['Coconut', 'Cashew', 'Rice', 'Groundnut'],
      recommendations: ['Improve organic matter', 'Add nitrogen fertilizers', 'Monitor salinity levels']
    },
    rainfallAnalysis: {
      currentMonth: 85,
      lastMonth: 65,
      yearToDate: 680,
      average: 1100,
      trend: 'increasing',
      prediction: { nextWeek: 25, nextMonth: 120 }
    }
  },
  {
    id: 'berhampur',
    name: 'Berhampur',
    district: 'Ganjam',
    coordinates: { lat: 19.3149, lng: 84.7941 },
    weather: {
      temperature: 31,
      humidity: 70,
      rainfall: 1.5,
      windSpeed: 8,
      pressure: 1013,
      uvIndex: 8,
      condition: 'stormy',
      icon: '⛈️',
      timestamp: new Date().toISOString()
    },
    soilQuality: {
      type: 'Red Laterite',
      ph: 6.5,
      nitrogen: 220,
      phosphorus: 35,
      potassium: 350,
      organicMatter: 2.3,
      moisture: 18,
      salinity: 0.8,
      quality: 'good',
      suitableCrops: ['Cotton', 'Groundnut', 'Turmeric', 'Chili'],
      recommendations: ['Add lime to increase pH', 'Improve water retention', 'Regular soil testing']
    },
    rainfallAnalysis: {
      currentMonth: 65,
      lastMonth: 45,
      yearToDate: 520,
      average: 950,
      trend: 'stable',
      prediction: { nextWeek: 15, nextMonth: 85 }
    }
  },
  {
    id: 'rourkela',
    name: 'Rourkela',
    district: 'Sundargarh',
    coordinates: { lat: 22.2604, lng: 84.8536 },
    weather: {
      temperature: 26,
      humidity: 65,
      rainfall: 12.5,
      windSpeed: 9,
      pressure: 1016,
      uvIndex: 4,
      condition: 'rainy',
      icon: '🌧️',
      timestamp: new Date().toISOString()
    },
    soilQuality: {
      type: 'Clay Loam',
      ph: 6.0,
      nitrogen: 200,
      phosphorus: 30,
      potassium: 250,
      organicMatter: 2.8,
      moisture: 25,
      salinity: 0.4,
      quality: 'good',
      suitableCrops: ['Rice', 'Maize', 'Vegetables', 'Pulses'],
      recommendations: ['Add lime to increase pH', 'Maintain organic content', 'Good for diverse crops']
    },
    rainfallAnalysis: {
      currentMonth: 185,
      lastMonth: 155,
      yearToDate: 1150,
      average: 1400,
      trend: 'increasing',
      prediction: { nextWeek: 65, nextMonth: 250 }
    }
  },
  {
    id: 'sambalpur',
    name: 'Sambalpur',
    district: 'Sambalpur',
    coordinates: { lat: 21.4669, lng: 83.9812 },
    weather: {
      temperature: 32,
      humidity: 60,
      rainfall: 6.8,
      windSpeed: 11,
      pressure: 1011,
      uvIndex: 7,
      condition: 'partly-cloudy',
      icon: '⛅',
      timestamp: new Date().toISOString()
    },
    soilQuality: {
      type: 'Black Cotton',
      ph: 6.8,
      nitrogen: 280,
      phosphorus: 40,
      potassium: 380,
      organicMatter: 3.0,
      moisture: 20,
      salinity: 0.5,
      quality: 'excellent',
      suitableCrops: ['Rice', 'Cotton', 'Sugarcane', 'Turmeric', 'Vegetables'],
      recommendations: ['Excellent soil fertility', 'Maintain current practices', 'Perfect for cash crops']
    },
    rainfallAnalysis: {
      currentMonth: 105,
      lastMonth: 85,
      yearToDate: 780,
      average: 1250,
      trend: 'stable',
      prediction: { nextWeek: 35, nextMonth: 150 }
    }
  }
]
