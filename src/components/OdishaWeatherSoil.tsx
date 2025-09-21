import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Progress } from './ui/progress'
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer,
  Eye,
  Gauge,
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  Leaf,
  Beaker,
  RefreshCw
} from 'lucide-react'
import { odishaTownsData } from '../utils/mockData'
import { WeatherService } from '../services/weatherService'
import type { OdishaTownData } from '../types/weather'

const weatherIcons = {
  'sunny': Sun,
  'partly-cloudy': Cloud,
  'cloudy': Cloud,
  'rainy': CloudRain,
  'clear': Sun,
  'stormy': CloudRain,
  'snowy': Cloud
}

const getWeatherIcon = (condition: string) => {
  const IconComponent = weatherIcons[condition as keyof typeof weatherIcons] || Cloud
  return <IconComponent className="h-6 w-6" />
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'increasing':
      return <TrendingUp className="h-4 w-4 text-green-500" />
    case 'decreasing':
      return <TrendingDown className="h-4 w-4 text-red-500" />
    default:
      return <Minus className="h-4 w-4 text-gray-500" />
  }
}

const getQualityColor = (quality: string) => {
  switch (quality) {
    case 'excellent':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'fair':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function OdishaWeatherSoil() {
  const [selectedTown, setSelectedTown] = useState<OdishaTownData>(odishaTownsData[0])
  const [realTimeWeather, setRealTimeWeather] = useState<any>(null)
  const [isLoadingRealTime, setIsLoadingRealTime] = useState(false)
  const [useRealTimeData, setUseRealTimeData] = useState(false)
  const weatherService = new WeatherService()

  const fetchRealTimeWeather = async (townData: OdishaTownData) => {
    setIsLoadingRealTime(true)
    try {
      const weather = await weatherService.getCurrentWeather(townData.coordinates.lat, townData.coordinates.lng)
      setRealTimeWeather(weather)
      setUseRealTimeData(true)
    } catch (error) {
      console.error('Failed to fetch real-time weather:', error)
      setUseRealTimeData(false)
    } finally {
      setIsLoadingRealTime(false)
    }
  }

  // Auto-fetch real-time weather when town changes
  useEffect(() => {
    fetchRealTimeWeather(selectedTown)
  }, [selectedTown])

  const currentWeather = useRealTimeData && realTimeWeather ? {
    temperature: realTimeWeather.current.temperature,
    humidity: realTimeWeather.current.humidity,
    condition: realTimeWeather.current.condition,
    windSpeed: realTimeWeather.current.windSpeed,
    pressure: realTimeWeather.current.pressure,
    uvIndex: realTimeWeather.current.uvIndex,
    rainfall: 0, // Not available in real-time API
    icon: realTimeWeather.current.icon,
    timestamp: realTimeWeather.current.timestamp
  } : selectedTown.weather

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Odisha Weather & Soil Analysis</h2>
          <p className="text-gray-600">Real-time weather conditions and soil health data for Odisha districts</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => fetchRealTimeWeather(selectedTown)}
            disabled={isLoadingRealTime}
            variant="outline"
            size="sm"
          >
            {isLoadingRealTime ? (
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {useRealTimeData ? 'Refresh' : 'Get Live Data'}
          </Button>
        </div>
      </div>

      {/* Town Selector */}
      <div className="flex flex-wrap gap-2">
        {odishaTownsData.map((town) => (
          <Button
            key={town.id}
            variant={selectedTown.id === town.id ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedTown(town)
            }}
            className="flex items-center gap-2"
          >
            <MapPin className="h-3 w-3" />
            {town.name}
          </Button>
        ))}
      </div>

      {/* Real-time Data Indicator */}
      {useRealTimeData && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-800">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live weather data for {selectedTown.name}</span>
          </div>
        </div>
      )}

      <Tabs defaultValue="weather" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="soil">Soil Health</TabsTrigger>
          <TabsTrigger value="rainfall">Rainfall Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="weather" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Weather Card */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Current Weather - {selectedTown.name}</span>
                  {getWeatherIcon(currentWeather.condition)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-3xl font-bold">{currentWeather.temperature}°C</div>
                    <div className="text-gray-600 capitalize">{currentWeather.condition.replace('-', ' ')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Feels like</div>
                    <div className="text-lg font-semibold">{currentWeather.temperature + 2}°C</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>Humidity: {currentWeather.humidity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <span>Wind: {currentWeather.windSpeed} km/h</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-blue-600" />
                    <span>Rainfall: {currentWeather.rainfall || 0} mm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-purple-500" />
                    <span>Pressure: {currentWeather.pressure} hPa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">UV Index</span>
                  <span className="font-medium">{currentWeather.uvIndex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Visibility</span>
                  <span className="font-medium">10 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Dew Point</span>
                  <span className="font-medium">{Math.round(currentWeather.temperature - 5)}°C</span>
                </div>
              </CardContent>
            </Card>

            {/* Air Quality */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Air Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">AQI</span>
                    <Badge variant="secondary">Good</Badge>
                  </div>
                  <Progress value={35} className="h-2" />
                  <div className="text-xs text-gray-500">
                    Air quality is satisfactory for most people
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="soil" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Soil Overview */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-green-600" />
                  Soil Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Soil Type</span>
                    <span className="font-medium">{selectedTown.soilQuality.type}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Quality</span>
                    <Badge className={getQualityColor(selectedTown.soilQuality.quality)}>
                      {selectedTown.soilQuality.quality}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">pH Level</span>
                    <span className="font-medium">{selectedTown.soilQuality.ph}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nutrient Levels */}
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Beaker className="h-5 w-5 text-blue-600" />
                  Nutrient Levels
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Nitrogen</span>
                      <span className="text-sm font-medium">{selectedTown.soilQuality.nitrogen} ppm</span>
                    </div>
                    <Progress value={(selectedTown.soilQuality.nitrogen / 400) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Phosphorus</span>
                      <span className="text-sm font-medium">{selectedTown.soilQuality.phosphorus} ppm</span>
                    </div>
                    <Progress value={(selectedTown.soilQuality.phosphorus / 60) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Potassium</span>
                      <span className="text-sm font-medium">{selectedTown.soilQuality.potassium} ppm</span>
                    </div>
                    <Progress value={(selectedTown.soilQuality.potassium / 500) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Organic Matter</span>
                      <span className="text-sm font-medium">{selectedTown.soilQuality.organicMatter}%</span>
                    </div>
                    <Progress value={(selectedTown.soilQuality.organicMatter / 5) * 100} className="h-2" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Moisture</span>
                    <span className="font-medium">{selectedTown.soilQuality.moisture}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salinity</span>
                    <span className="font-medium">{selectedTown.soilQuality.salinity} dS/m</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Suitable Crops */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Suitable Crops & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Recommended Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTown.soilQuality.suitableCrops.map((crop, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Soil Recommendations</h4>
                    <ul className="space-y-2">
                      {selectedTown.soilQuality.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rainfall" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Current Month */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {selectedTown.rainfallAnalysis.currentMonth} mm
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {getTrendIcon(selectedTown.rainfallAnalysis.trend)}
                  <span className="capitalize">{selectedTown.rainfallAnalysis.trend}</span>
                </div>
              </CardContent>
            </Card>

            {/* Last Month */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Last Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700 mb-1">
                  {selectedTown.rainfallAnalysis.lastMonth} mm
                </div>
                <div className="text-sm text-gray-600">
                  Previous period
                </div>
              </CardContent>
            </Card>

            {/* Year to Date */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Year to Date</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {selectedTown.rainfallAnalysis.yearToDate} mm
                </div>
                <div className="text-sm text-gray-600">
                  vs {selectedTown.rainfallAnalysis.average} mm avg
                </div>
                <Progress 
                  value={(selectedTown.rainfallAnalysis.yearToDate / selectedTown.rainfallAnalysis.average) * 100} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>

            {/* Predictions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Forecast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Week</span>
                  <span className="font-medium">{selectedTown.rainfallAnalysis.prediction.nextWeek} mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Month</span>
                  <span className="font-medium">{selectedTown.rainfallAnalysis.prediction.nextMonth} mm</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}