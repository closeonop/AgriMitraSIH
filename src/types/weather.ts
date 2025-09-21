export interface WeatherData {
  current: CurrentWeather
  forecast: WeatherForecast[]
  alerts: WeatherAlert[]
}

export interface CurrentWeather {
  temperature: number
  humidity: number
  rainfall: number
  windSpeed: number
  pressure: number
  uvIndex: number
  condition: string
  icon: string
  timestamp: string
}

export interface WeatherForecast {
  date: string
  high: number
  low: number
  condition: string
  icon: string
  rainfall: number
  windSpeed: number
  humidity: number
}

export interface WeatherAlert {
  id: number
  type: 'warning' | 'info' | 'critical'
  title: string
  description: string
  severity: 'low' | 'medium' | 'high'
  startTime: string
  endTime: string
}

export interface WeatherImpact {
  cropId: number
  impact: 'positive' | 'negative' | 'neutral'
  description: string
  recommendations: string[]
}

export interface OdishaTownData {
  id: string
  name: string
  district: string
  coordinates: {
    lat: number
    lng: number
  }
  weather: CurrentWeather
  soilQuality: SoilQualityData
  rainfallAnalysis: RainfallAnalysis
}

export interface SoilQualityData {
  type: string
  ph: number
  nitrogen: number
  phosphorus: number
  potassium: number
  organicMatter: number
  moisture: number
  salinity: number
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  suitableCrops: string[]
  recommendations: string[]
}

export interface RainfallAnalysis {
  currentMonth: number
  lastMonth: number
  yearToDate: number
  average: number
  trend: 'increasing' | 'decreasing' | 'stable'
  prediction: {
    nextWeek: number
    nextMonth: number
  }
}
