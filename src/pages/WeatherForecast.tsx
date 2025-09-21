import { useState, useMemo, useCallback } from 'react';
import { locationWeatherData } from '../utils/mockData'
import { WeatherService } from '../services/weatherService'
import OdishaWeatherSoil from '../components/OdishaWeatherSoil'
import LocationSelector from '../components/LocationSelector'

interface WeatherData {
  day: string
  date: string
  temperature: { min: number; max: number }
  condition: string
  humidity: number
  windSpeed: number
  precipitation: number
  icon: string
}

interface WeatherAlert {
  id: string
  type: 'warning' | 'info' | 'danger'
  title: string
  message: string
  timestamp: string
}

const WeatherForecast = () => {
  const [selectedDay, setSelectedDay] = useState(0)
  const [currentLocation, setCurrentLocation] = useState('Bhubaneswar, Odisha')
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'forecast' | 'odisha'>('forecast')
  const [realTimeWeather, setRealTimeWeather] = useState<any>(null)
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false)

  // Default Odisha-specific weather alerts
  const defaultWeatherAlerts: WeatherAlert[] = [
    {
      id: '1',
      type: 'warning',
      title: 'Cyclone Watch - Odisha',
      message: 'Cyclonic conditions possible in coastal areas. Monitor weather updates for farming activities.',
      timestamp: '1 hour ago'
    },
    {
      id: '2',
      type: 'info',
      title: 'Rice Irrigation Advisory',
      message: 'Optimal conditions for rice irrigation in Odisha. Monsoon moisture levels are ideal.',
      timestamp: '3 hours ago'
    },
    {
      id: '3',
      type: 'warning',
      title: 'Cold Wave Warning',
      message: 'Temperature may drop below 5°C. Protect sensitive crops and livestock.',
      timestamp: '5 hours ago'
    }
  ]

  // Handle location selection with real-time weather fetching - Memoized to prevent infinite re-renders
  const handleLocationSelect = useCallback(async (location: string) => {
    setSelectedLocation(location)
    setCurrentLocation(`${location}, Odisha`)
    setIsLoadingWeather(true)
    
    try {
      const weatherService = new WeatherService()
      const weatherData = await weatherService.getWeatherByDistrict(location)
      setRealTimeWeather(weatherData)
    } catch (error) {
      console.error('Failed to fetch weather data:', error)
      setRealTimeWeather(null)
    } finally {
      setIsLoadingWeather(false)
    }
  }, [])

  // Default Odisha-specific weather data for 7 days (Tropical season)
  const defaultWeatherData: WeatherData[] = [
    {
      day: 'Today',
      date: '2024-01-15',
      temperature: { min: 18, max: 32 },
      condition: 'Partly Cloudy',
      humidity: 75,
      windSpeed: 15,
      precipitation: 10,
      icon: '⛅'
    },
    {
      day: 'Tomorrow',
      date: '2024-01-16',
      temperature: { min: 20, max: 34 },
      condition: 'Clear Sky',
      humidity: 68,
      windSpeed: 8,
      precipitation: 0,
      icon: '☀️'
    },
    {
      day: 'Wednesday',
      date: '2024-01-17',
      temperature: { min: 7, max: 23 },
      condition: 'Foggy Morning',
      humidity: 75,
      windSpeed: 6,
      precipitation: 0,
      icon: '🌫️'
    },
    {
      day: 'Thursday',
      date: '2024-01-18',
      temperature: { min: 9, max: 25 },
      condition: 'Sunny',
      humidity: 58,
      windSpeed: 10,
      precipitation: 0,
      icon: '☀️'
    },
    {
      day: 'Friday',
      date: '2024-01-19',
      temperature: { min: 8, max: 21 },
      condition: 'Light Rain',
      humidity: 82,
      windSpeed: 15,
      precipitation: 60,
      icon: '🌦️'
    },
    {
      day: 'Saturday',
      date: '2024-01-20',
      temperature: { min: 5, max: 18 },
      condition: 'Cloudy',
      humidity: 70,
      windSpeed: 12,
      precipitation: 20,
      icon: '☁️'
    },
    {
      day: 'Sunday',
      date: '2024-01-21',
      temperature: { min: 7, max: 22 },
      condition: 'Partly Sunny',
      humidity: 65,
      windSpeed: 9,
      precipitation: 10,
      icon: '⛅'
    }
  ]

  // Get weather data based on selected location (real-time or fallback) - Memoized to prevent infinite re-renders
  const weatherData = useMemo(() => {
    // Use real-time weather data if available
    if (realTimeWeather && !isLoadingWeather && realTimeWeather.current) {
      const current = realTimeWeather.current
      const forecast = realTimeWeather.forecast || []
      
      return [
        {
          day: 'Today',
          date: new Date().toISOString().split('T')[0],
          temperature: { 
            min: Math.max(0, (current.temperature || 25) - 5), 
            max: current.temperature || 25 
          },
          condition: current.condition?.toLowerCase() || 'partly cloudy',
          humidity: current.humidity || 70,
          windSpeed: current.windSpeed || 10,
          precipitation: 0,
          icon: current.icon || '⛅'
        },
        ...forecast.slice(0, 6).map((day: any) => ({
          day: day.day || 'Unknown',
          date: day.date || new Date().toISOString().split('T')[0],
          temperature: { 
            min: day.low || 20, 
            max: day.high || 30 
          },
          condition: day.condition?.toLowerCase() || 'partly cloudy',
          humidity: day.humidity || 70,
          windSpeed: day.windSpeed || 10,
          precipitation: day.precipitation || 0,
          icon: day.icon || '⛅'
        }))
      ]
    }
    
    // Fallback to mock data
    if (selectedLocation && locationWeatherData[selectedLocation]) {
      const locationData = locationWeatherData[selectedLocation]
      if (locationData.current) {
        return [
          {
            day: 'Today',
            date: new Date().toISOString().split('T')[0],
            temperature: { 
              min: Math.max(0, (locationData.current.temperature || 25) - 8), 
              max: locationData.current.temperature || 25 
            },
            condition: locationData.current.condition || 'partly cloudy',
            humidity: locationData.current.humidity || 70,
            windSpeed: locationData.current.windSpeed || 10,
            precipitation: locationData.current.rainfall || 0,
            icon: locationData.current.condition === 'sunny' ? '☀️' : 
                  locationData.current.condition === 'partly-cloudy' ? '⛅' :
                  locationData.current.condition === 'cloudy' ? '☁️' :
                  locationData.current.condition === 'rainy' ? '🌧️' : '⛅'
          },
          ...(locationData.forecast || []).slice(1).map((day, index) => ({
            day: day.date || `Day ${index + 2}`,
            date: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            temperature: { 
              min: day.low || 20, 
              max: day.high || 30 
            },
            condition: day.condition || 'partly cloudy',
            humidity: (locationData.current.humidity || 70) + (Math.random() * 20 - 10),
            windSpeed: (locationData.current.windSpeed || 10) + (Math.random() * 10 - 5),
            precipitation: day.condition === 'rainy' ? 80 : day.condition === 'cloudy' ? 30 : 5,
            icon: day.condition === 'sunny' ? '☀️' : 
                  day.condition === 'partly-cloudy' ? '⛅' :
                  day.condition === 'cloudy' ? '☁️' :
                  day.condition === 'rainy' ? '🌧️' : '⛅'
          }))
        ]
      }
    }
    return defaultWeatherData
  }, [realTimeWeather, isLoadingWeather, selectedLocation])

  // Helper function to get weather data
  const getWeatherData = () => weatherData

  // Get weather alerts based on selected location - Memoized to prevent re-renders
  const weatherAlerts = useMemo(() => {
    if (selectedLocation && locationWeatherData[selectedLocation]) {
      const locationData = locationWeatherData[selectedLocation]
      return locationData.alerts.map((alert, index) => ({
        id: (index + 1).toString(),
        type: 'warning' as const,
        title: alert.title,
        message: alert.description,
        timestamp: alert.endTime
      }))
    }
    return defaultWeatherAlerts
  }, [selectedLocation])

  // Helper function to get weather alerts
  const getWeatherAlerts = () => weatherAlerts



  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
      case 'info': return 'bg-blue-50 border-blue-200 text-blue-800'
      case 'danger': return 'bg-red-50 border-red-200 text-red-800'
      default: return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️'
      case 'info': return 'ℹ️'
      case 'danger': return '🚨'
      default: return '📢'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pt-16 lg:pt-20 relative">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url('/src/assets/images/weather-dashboard-bg.svg')`,
          backgroundSize: '400px 300px',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* Decorative Weather Elements - Hidden on mobile */}
      <div className="hidden lg:block absolute top-20 right-10 opacity-15">
        <div className="text-6xl animate-pulse">☀️</div>
      </div>
      <div className="hidden lg:block absolute top-40 left-10 opacity-10">
        <div className="text-5xl animate-bounce">🌧️</div>
      </div>
      <div className="hidden lg:block absolute bottom-20 right-20 opacity-15">
        <div className="text-4xl">🌾</div>
      </div>
      
      <div className="container-custom py-4 lg:py-8 px-3 lg:px-0 relative z-10">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">
                Weather Forecast
              </h1>
              <p className="text-sm lg:text-lg text-gray-600">
                7-day weather forecast and alerts for {selectedLocation || currentLocation}
              </p>
            </div>
            <div className="text-left lg:text-right">
              <div className="text-xs lg:text-sm text-gray-500">Last updated</div>
              <div className="text-xs lg:text-sm font-medium text-gray-700">2 minutes ago</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 lg:mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full lg:max-w-md">
            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex-1 py-2 px-2 lg:px-4 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                activeTab === 'forecast'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">🌤️ Weather Forecast</span>
              <span className="sm:hidden">🌤️ Forecast</span>
            </button>
            <button
              onClick={() => setActiveTab('odisha')}
              className={`flex-1 py-2 px-2 lg:px-4 rounded-md text-xs lg:text-sm font-medium transition-all duration-200 ${
                activeTab === 'odisha'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="hidden sm:inline">🌱 Odisha Analysis</span>
              <span className="sm:hidden">🌱 Analysis</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'forecast' ? (
          <>
            {/* Location Selector */}
            <div className="mb-8">
              <LocationSelector onLocationSelect={handleLocationSelect} />
            </div>

            {/* Initial State - Show only when no location is selected */}
            {!selectedLocation ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Welcome Message */}
                <div className="card-elegant p-6 lg:p-8 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="text-center">
                    <div className="text-6xl lg:text-8xl mb-4">🌾</div>
                    <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">
                      Welcome to Weather Forecast
                    </h2>
                    <p className="text-gray-600 text-sm lg:text-base mb-4">
                      Select your district from the dropdown above to get detailed weather information for your area.
                    </p>
                    <div className="bg-blue-100 rounded-lg p-4 text-blue-800 text-sm">
                      <strong>💡 Tip:</strong> Get personalized farming recommendations based on your location's weather conditions.
                    </div>
                  </div>
                </div>

                {/* Odisha Weather Alerts */}
                <div className="card-elegant p-4 lg:p-6">
                  <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center">
                    <span className="mr-2">🚨</span>
                    Odisha Weather Alerts
                  </h2>
                  
                  <div className="space-y-3 lg:space-y-4">
                    {defaultWeatherAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 lg:p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
                      >
                        <div className="flex items-start space-x-2 lg:space-x-3">
                          <div className="text-xl lg:text-2xl">{getAlertIcon(alert.type)}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1 text-sm lg:text-base">{alert.title}</h3>
                            <p className="text-xs lg:text-sm mb-2">{alert.message}</p>
                            <div className="text-xs opacity-75">{alert.timestamp}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 lg:mt-6 btn-secondary text-sm">
                    View All State Alerts
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Current Weather Card - Only show when location is selected */}
                <div className="card-elegant p-4 lg:p-8 mb-6 lg:mb-8 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                  <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-4 lg:gap-0">
                    <div className="text-center lg:text-left">
                      <div className="text-4xl lg:text-6xl mb-2">{getWeatherData()[0]?.icon || '⛅'}</div>
                      <div className="text-lg lg:text-2xl font-bold mb-1">{getWeatherData()[0]?.condition || 'Loading...'}</div>
                      <div className="text-blue-100 text-sm lg:text-base">Right now in {selectedLocation || currentLocation}</div>
                    </div>
                    <div className="text-center lg:text-right">
                      <div className="text-3xl lg:text-5xl font-bold mb-2">
                        {getWeatherData()[0]?.temperature?.max || 25}°C
                      </div>
                      <div className="text-blue-100 text-sm lg:text-base">
                        Feels like {(getWeatherData()[0]?.temperature?.max || 25) + 2}°C
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 lg:gap-4 mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-blue-400">
                    <div className="text-center">
                      <div className="text-blue-100 text-xs lg:text-sm">Humidity</div>
                      <div className="text-lg lg:text-xl font-semibold">{getWeatherData()[0].humidity}%</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-100 text-xs lg:text-sm">Wind Speed</div>
                      <div className="text-lg lg:text-xl font-semibold">{getWeatherData()[0].windSpeed} km/h</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-100 text-xs lg:text-sm">Precipitation</div>
                      <div className="text-lg lg:text-xl font-semibold">{getWeatherData()[0].precipitation}%</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
                  {/* 7-Day Forecast */}
                  <div className="lg:col-span-2">
                    <div className="card-elegant p-4 lg:p-6">
                      <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">7-Day Forecast</h2>
                      
                      {/* Day Selection */}
                      <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-4 lg:mb-6">
                        {getWeatherData().map((day, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedDay(index)}
                            className={`p-2 lg:p-3 rounded-lg text-center transition-all duration-200 ${
                              selectedDay === index
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            <div className="text-xs font-medium mb-1">
                              {day.day === 'Today' || day.day === 'Tomorrow' ? day.day.slice(0, 3) : day.day.slice(0, 3)}
                            </div>
                            <div className="text-lg lg:text-2xl mb-1">{day.icon}</div>
                            <div className="text-xs">
                              {day.temperature?.max || 25}°/{day.temperature?.min || 20}°
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Selected Day Details */}
                      <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg lg:text-xl font-bold text-gray-900">
                              {getWeatherData()[selectedDay].day}
                            </h3>
                            <p className="text-sm lg:text-base text-gray-600">{getWeatherData()[selectedDay].date}</p>
                          </div>
                          <div className="text-3xl lg:text-4xl">{getWeatherData()[selectedDay].icon}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                          <div className="text-center p-3 lg:p-4 bg-white rounded-lg">
                            <div className="text-xl lg:text-2xl mb-2">🌡️</div>
                            <div className="text-xs lg:text-sm text-gray-600">Temperature</div>
                            <div className="font-bold text-gray-900 text-xs lg:text-sm">
                              {getWeatherData()[selectedDay]?.temperature?.max || 25}°C / {getWeatherData()[selectedDay]?.temperature?.min || 20}°C
                            </div>
                          </div>
                          <div className="text-center p-3 lg:p-4 bg-white rounded-lg">
                            <div className="text-xl lg:text-2xl mb-2">💧</div>
                            <div className="text-xs lg:text-sm text-gray-600">Humidity</div>
                            <div className="font-bold text-gray-900 text-xs lg:text-sm">{getWeatherData()[selectedDay].humidity}%</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 bg-white rounded-lg">
                            <div className="text-xl lg:text-2xl mb-2">💨</div>
                            <div className="text-xs lg:text-sm text-gray-600">Wind Speed</div>
                            <div className="font-bold text-gray-900 text-xs lg:text-sm">{getWeatherData()[selectedDay].windSpeed} km/h</div>
                          </div>
                          <div className="text-center p-3 lg:p-4 bg-white rounded-lg">
                            <div className="text-xl lg:text-2xl mb-2">🌧️</div>
                            <div className="text-xs lg:text-sm text-gray-600">Rain Chance</div>
                            <div className="font-bold text-gray-900 text-xs lg:text-sm">{getWeatherData()[selectedDay].precipitation}%</div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 lg:p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2 text-sm lg:text-base">Farming Recommendations</h4>
                          <p className="text-blue-800 text-xs lg:text-sm">
                            {getWeatherData()[selectedDay]?.precipitation > 50
                              ? "High chance of rain - avoid outdoor activities and ensure proper drainage."
                              : (getWeatherData()[selectedDay]?.temperature?.max || 25) > 25
                              ? "Hot weather expected - increase irrigation and provide shade for sensitive crops."
                              : "Good weather conditions for most farming activities."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Weather Alerts */}
                  <div className="lg:col-span-1">
                    <div className="card-elegant p-4 lg:p-6">
                      <h2 className="text-lg lg:text-2xl font-bold text-gray-900 mb-4 lg:mb-6">Weather Alerts</h2>
                      
                      <div className="space-y-3 lg:space-y-4">
                        {getWeatherAlerts().map((alert) => (
                          <div
                            key={alert.id}
                            className={`p-3 lg:p-4 rounded-lg border-l-4 ${getAlertColor(alert.type)}`}
                          >
                            <div className="flex items-start space-x-2 lg:space-x-3">
                              <div className="text-xl lg:text-2xl">{getAlertIcon(alert.type)}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold mb-1 text-sm lg:text-base">{alert.title}</h3>
                                <p className="text-xs lg:text-sm mb-2">{alert.message}</p>
                                <div className="text-xs opacity-75">{alert.timestamp}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button className="w-full mt-4 lg:mt-6 btn-secondary text-sm">
                        View All Alerts
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="card-elegant p-4 lg:p-6 mt-4 lg:mt-6">
                      <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">Quick Actions</h3>
                      <div className="space-y-2 lg:space-y-3">
                        <button className="w-full btn-primary text-xs lg:text-sm">
                          📱 Get SMS Alerts
                        </button>
                        <button className="w-full btn-secondary text-xs lg:text-sm">
                          📧 Email Forecast
                        </button>
                        <button className="w-full btn-secondary text-xs lg:text-sm">
                          📍 Change Location
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <OdishaWeatherSoil />
        )}
      </div>
    </div>
  )
}

export default WeatherForecast // Removed unused state