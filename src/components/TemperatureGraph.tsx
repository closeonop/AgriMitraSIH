import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const TemperatureGraph = () => {
  const { t } = useTranslation()
  const [currentTemp, setCurrentTemp] = useState(28)
  const [isAnimating, setIsAnimating] = useState(false)

  // Mock temperature data for the last 7 days
  const temperatureData = [
    { day: 'Mon', temp: 26, humidity: 65 },
    { day: 'Tue', temp: 28, humidity: 70 },
    { day: 'Wed', temp: 30, humidity: 60 },
    { day: 'Thu', temp: 32, humidity: 55 },
    { day: 'Fri', temp: 29, humidity: 68 },
    { day: 'Sat', temp: 27, humidity: 72 },
    { day: 'Sun', temp: 28, humidity: 65 }
  ]

  const maxTemp = Math.max(...temperatureData.map(d => d.temp))
  const minTemp = Math.min(...temperatureData.map(d => d.temp))

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="section-padding bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>📊</span>
              <span>{t('temperature.badge')}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('temperature.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('temperature.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Temperature Graph */}
            <div className="lg:col-span-2">
              <div className="card-elegant p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                    <span>🌡️</span>
                    <span>{t('temperature.currentTemp')}</span>
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>{t('temperature.live')}</span>
                  </div>
                </div>

                {/* Current Temperature Display */}
                <div className="text-center mb-8">
                  <div className={`text-6xl md:text-8xl font-bold text-primary-600 mb-2 transition-all duration-1000 ${
                    isAnimating ? 'scale-110' : 'scale-100'
                  }`}>
                    {currentTemp}°C
                  </div>
                  <p className="text-lg text-gray-600">{t('temperature.today')}</p>
                </div>

                {/* Temperature Chart */}
                <div className="relative h-64 bg-gradient-to-t from-primary-50 to-transparent rounded-xl p-6">
                  <div className="flex items-end justify-between h-full space-x-2">
                    {temperatureData.map((data, index) => {
                      const height = ((data.temp - minTemp) / (maxTemp - minTemp)) * 100
                      return (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div className="relative">
                            <div 
                              className={`w-full bg-gradient-to-t from-primary-500 to-accent-500 rounded-t-lg transition-all duration-1000 ${
                                isAnimating ? 'animate-pulse' : ''
                              }`}
                              style={{ height: `${height}%` }}
                            />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700">
                              {data.temp}°
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-gray-600 font-medium">
                            {data.day}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Temperature Range */}
                <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full" />
                    <span>{t('temperature.min')}: {minTemp}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <span>{t('temperature.max')}: {maxTemp}°C</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Weather Cards */}
            <div className="space-y-6">
              {/* Current Weather */}
              <div className="card-elegant p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>🌤️</span>
                  <span>{t('weather.current')}</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('weather.humidity')}</span>
                    <span className="font-semibold text-primary-600">65%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('weather.wind')}</span>
                    <span className="font-semibold text-primary-600">8 km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('weather.pressure')}</span>
                    <span className="font-semibold text-primary-600">1013 hPa</span>
                  </div>
                </div>
              </div>

              {/* Forecast */}
              <div className="card-elegant p-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>📅</span>
                  <span>{t('weather.forecast')}</span>
                </h4>
                <div className="space-y-3">
                  {temperatureData.slice(0, 3).map((data, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">{data.day}</span>
                        <span className="text-lg">🌤️</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{data.temp}°C</div>
                        <div className="text-xs text-gray-500">{data.humidity}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="card-elegant p-6 bg-gradient-to-br from-green-50 to-accent-50">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>💡</span>
                  <span>{t('weather.recommendations')}</span>
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{t('weather.rec1')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{t('weather.rec2')}</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span>{t('weather.rec3')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TemperatureGraph
