import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { 
  TrendingUp, 
  TrendingDown, 
  Cloud, 
  Sun, 
  CloudRain, 
  Droplets,
  Wind,
  Thermometer,
  Leaf,
  BarChart3,
  MapPin,
  RefreshCw
} from 'lucide-react'
import { locationWeatherData, odishaTownsData } from '../utils/mockData'
import { WeatherService } from '../services/weatherService'
import { useTranslation } from 'react-i18next'

// Updated Odisha weather data for dashboard
const odishaWeatherData = [
  {
    location: 'Bhubaneswar',
    temperature: 32,
    condition: 'partly-cloudy',
    humidity: 68,
    windSpeed: 12,
    trend: 'stable'
  },
  {
    location: 'Cuttack',
    temperature: 30,
    condition: 'cloudy',
    humidity: 72,
    windSpeed: 8,
    trend: 'decreasing'
  },
  {
    location: 'Puri',
    temperature: 28,
    condition: 'rainy',
    humidity: 85,
    windSpeed: 15,
    trend: 'increasing'
  },
  {
    location: 'Berhampur',
    temperature: 31,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 10,
    trend: 'stable'
  }
]

const weatherIcons = {
  'sunny': Sun,
  'partly-cloudy': Cloud,
  'cloudy': Cloud,
  'rainy': CloudRain,
  'stormy': CloudRain,
  'snowy': Cloud,
  'clear': Sun
}

const getWeatherIcon = (condition: string) => {
  const IconComponent = weatherIcons[condition as keyof typeof weatherIcons] || Cloud
  return <IconComponent className="h-5 w-5" />
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return <TrendingUp className="h-4 w-4 text-green-500" />
    case 'decreasing':
      return <TrendingDown className="h-4 w-4 text-red-500" />
    default:
      return <div className="h-4 w-4" />
  }
}

export default function Dashboard() {
  const { t } = useTranslation()
  const [realTimeWeather, setRealTimeWeather] = useState<any>(null)
  const [isLoadingRealTime, setIsLoadingRealTime] = useState(false)
  const weatherService = new WeatherService()

  const fetchRealTimeWeather = async () => {
    setIsLoadingRealTime(true)
    try {
      // Fetch real-time weather for Bhubaneswar (capital of Odisha)
      const weather = await weatherService.getCurrentWeather(20.2961, 85.8245)
      setRealTimeWeather(weather)
    } catch (error) {
      console.error('Failed to fetch real-time weather:', error)
    } finally {
      setIsLoadingRealTime(false)
    }
  }

  useEffect(() => {
    fetchRealTimeWeather()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 lg:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={fetchRealTimeWeather}
              disabled={isLoadingRealTime}
              variant="outline"
              size="sm"
              className="text-sm lg:text-base flex-1 sm:flex-none"
            >
              {isLoadingRealTime ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">{t('dashboard.refreshWeather')}</span>
              <span className="sm:hidden">{t('dashboard.refresh')}</span>
            </Button>
          </div>
        </div>

        {/* Real-time Weather Alert */}
        {realTimeWeather && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 lg:p-6 mx-2 sm:mx-0">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-blue-900 text-sm sm:text-base">{t('dashboard.liveWeatherUpdate')}</h3>
                <p className="text-blue-700 text-xs sm:text-sm truncate sm:whitespace-normal">
                  {realTimeWeather.temperature}°C, {realTimeWeather.condition} • Humidity: {realTimeWeather.humidity}% • Wind: {realTimeWeather.windSpeed} km/h
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 px-2 sm:px-0">
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 lg:px-6 pt-4 lg:pt-6">
              <CardTitle className="text-xs lg:text-sm font-medium">{t('dashboard.activeFarms')}</CardTitle>
              <Leaf className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="text-xl lg:text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.fromLastMonth', { change: '+12%' })}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 lg:px-6 pt-4 lg:pt-6">
              <CardTitle className="text-xs lg:text-sm font-medium">{t('dashboard.cropYield')}</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="text-xl lg:text-2xl font-bold">94.2%</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.fromLastSeason', { change: '+5.1%' })}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 lg:px-6 pt-4 lg:pt-6">
              <CardTitle className="text-xs lg:text-sm font-medium">{t('dashboard.soilHealth')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="text-xl lg:text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.excellentCondition')}
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 lg:px-6 pt-4 lg:pt-6">
              <CardTitle className="text-xs lg:text-sm font-medium">{t('dashboard.weatherAlerts')}</CardTitle>
              <Cloud className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
              <div className="text-xl lg:text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                {t('dashboard.alertsSummary')}
              </p>
            </CardContent>
        </Card>
      </div>

        {/* Weather Overview */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 lg:px-6 pt-4 lg:pt-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Cloud className="h-5 w-5" />
              {t('dashboard.weatherOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {odishaWeatherData.map((weather, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 lg:p-6 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-2 lg:mb-4">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-medium text-sm lg:text-base truncate">{weather.location}</span>
                    </div>
                    <div className="flex-shrink-0">
                      {getTrendIcon(weather.trend)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-xl lg:text-2xl font-bold">{weather.temperature}°C</div>
                    <div className="flex-shrink-0">
                      {getWeatherIcon(weather.condition)}
                    </div>
                  </div>
                  <div className="space-y-2 text-xs lg:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 flex-shrink-0" />
                      <span>Humidity: {weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-3 w-3 flex-shrink-0" />
                      <span>Wind: {weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Soil Health Summary */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 lg:px-6 pt-4 lg:pt-6">
            <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
              <Leaf className="h-5 w-5" />
              {t('dashboard.soilHealthSummary')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 lg:p-6 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{t('dashboard.phLevel')}</h3>
                  <div className="text-xl lg:text-2xl">🧪</div>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-green-600 mb-2">6.8</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">{t('dashboard.optimalRange')}</div>
                <div className="bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 rounded-full h-2 transition-all duration-300" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 lg:p-6 rounded-lg border hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{t('dashboard.nitrogen')}</h3>
                  <div className="text-xl lg:text-2xl">🌿</div>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-blue-600 mb-2">{t('dashboard.medium')}</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">{t('dashboard.goodForCropGrowth')}</div>
                <div className="bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 rounded-full h-2 transition-all duration-300" style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 lg:p-6 rounded-lg border hover:shadow-sm transition-shadow sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{t('dashboard.moisture')}</h3>
                  <div className="text-xl lg:text-2xl">💧</div>
                </div>
                <div className="text-xl lg:text-2xl font-bold text-purple-600 mb-2">78%</div>
                <div className="text-xs lg:text-sm text-gray-600 mb-3 lg:mb-4">{t('dashboard.adequateMoistureLevel')}</div>
                <div className="bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 rounded-full h-2 transition-all duration-300" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="shadow-sm">
          <CardHeader className="px-4 lg:px-6 pt-4 lg:pt-6">
            <CardTitle className="text-lg lg:text-xl">{t('dashboard.recentActivities')}</CardTitle>
          </CardHeader>
          <CardContent className="px-4 lg:px-6 pb-4 lg:pb-6">
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                <div className="text-lg lg:text-xl flex-shrink-0">🌱</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{t('dashboard.newCropPlanted')}</p>
                    <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{t('dashboard.hoursAgo', { count: 2 })}</span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.tomatoesPlanted')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="text-lg lg:text-xl flex-shrink-0">💧</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{t('dashboard.irrigationCompleted')}</p>
                    <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{t('dashboard.hoursAgo', { count: 5 })}</span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.automatedIrrigation')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
                <div className="text-lg lg:text-xl flex-shrink-0">📊</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                    <p className="font-semibold text-gray-900 text-sm lg:text-base">{t('dashboard.soilAnalysisReport')}</p>
                    <span className="text-xs lg:text-sm text-gray-500 flex-shrink-0">{t('dashboard.dayAgo', { count: 1 })}</span>
                  </div>
                  <p className="text-xs lg:text-sm text-gray-600">{t('dashboard.phLevelsAnalysis')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}