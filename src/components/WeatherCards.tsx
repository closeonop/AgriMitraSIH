import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWeather } from '../hooks/useWeather'
import LocationSelector from './LocationSelector'

const WeatherCards = () => {
  const { t } = useTranslation()
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [soilType, setSoilType] = useState<string>('')
  const { weather, loading } = useWeather(selectedLocation)

  const handleLocationSelect = (location: string, soil: string) => {
    setSelectedLocation(location)
    setSoilType(soil)
  }

  const weatherCards = [
    {
      icon: '🌡️',
      title: t('weatherCards.temperature.title'),
      value: '28°C',
      status: 'normal',
      description: t('weatherCards.temperature.description'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      icon: '💧',
      title: t('weatherCards.humidity.title'),
      value: '65%',
      status: 'good',
      description: t('weatherCards.humidity.description'),
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50'
    },
    {
      icon: '🌬️',
      title: t('weatherCards.wind.title'),
      value: '8 km/h',
      status: 'normal',
      description: t('weatherCards.wind.description'),
      color: 'from-gray-500 to-gray-600',
      bgColor: 'from-gray-50 to-gray-100'
    },
    {
      icon: '☀️',
      title: t('weatherCards.sunlight.title'),
      value: '12h',
      status: 'excellent',
      description: t('weatherCards.sunlight.description'),
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'normal': return 'text-gray-600 bg-gray-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'danger': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    return t(`weatherCards.status.${status}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{t('weatherCards.title')}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">{t('weatherCards.description')}</p>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        <div className="w-full lg:w-1/3">
          <LocationSelector onLocationSelect={handleLocationSelect} />
        </div>
        
        <div className="w-full lg:w-2/3">
          {selectedLocation && soilType ? (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-6 h-full border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-800">{t('weatherCards.current')} - {selectedLocation}</h3>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-4 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-800">{weather.current.temperature}°C</p>
                      <p className="text-gray-600 capitalize mt-1">{weather.current.condition}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span className="text-sm text-gray-600">Humidity: {weather.current.humidity}%</span>
                        </div>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                          </svg>
                          <span className="text-sm text-gray-600">Wind: {weather.current.windSpeed} km/h</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-6xl">
                      {weather.current.condition === 'sunny' ? '☀️' : 
                       weather.current.condition === 'cloudy' ? '☁️' : 
                       weather.current.condition === 'rainy' ? '🌧️' : 
                       weather.current.condition === 'partly-cloudy' ? '⛅' : '🌤️'}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="font-medium text-gray-700 mb-2">Soil Information:</h4>
                    <div className="flex items-center bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p className="text-sm text-gray-700">{soilType}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* 7-Day Forecast */}
              {!loading && weather.forecast && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    7-Day Forecast
                  </h4>
                  <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-x-auto">
                    <div className="flex min-w-max">
                      {weather.forecast.map((day: any, index: number) => (
                        <div key={index} className={`p-3 text-center ${index !== weather.forecast.length - 1 ? 'border-r border-gray-100' : ''}`} style={{minWidth: '100px'}}>
                          <p className="text-sm font-medium text-gray-700">{day.day}</p>
                          <div className="text-2xl my-2">
                            {day.condition === 'sunny' ? '☀️' : 
                             day.condition === 'cloudy' ? '☁️' : 
                             day.condition === 'rainy' ? '🌧️' : 
                             day.condition === 'partly-cloudy' ? '⛅' : '🌤️'}
                          </div>
                          <p className="text-sm font-bold text-gray-800">{day.high}°</p>
                          <p className="text-xs text-gray-500">{day.low}°</p>
                          <div className="mt-2 text-xs text-gray-600 capitalize">{day.condition}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 h-full border border-gray-100 flex items-center justify-center">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-lg text-gray-600">Please select a location to view weather and soil data</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6">Weather Indicators</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {weatherCards.map((card: any, index: number) => (
          <div 
            key={index}
            className={`relative overflow-hidden rounded-xl p-6 shadow-lg bg-gradient-to-br ${card.bgColor} border border-white/20 transition-transform hover:-translate-y-1 hover:shadow-xl`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-4xl">{card.icon}</span>
                <h3 className="mt-4 text-xl font-medium text-gray-800">{card.title}</h3>
                <div className="mt-1 flex items-baseline gap-1">
                  <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(card.status)}`}>
                    {getStatusText(card.status)}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Weather Alerts */}
      {selectedLocation && !loading && weather.alerts && weather.alerts.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Weather Alerts
          </h3>
          <div className="space-y-4">
            {weather.alerts.map((alert: any, index: number) => (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start">
                  <div className="bg-red-100 p-2 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-red-800 mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-700">{alert.description}</p>
                    <div className="mt-2 text-xs text-gray-500">Valid until: {alert.validUntil}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WeatherCards