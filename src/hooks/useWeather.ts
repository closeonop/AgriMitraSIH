import { useState, useEffect } from 'react'
import { weatherData, locationWeatherData } from '../utils/mockData'

export const useWeather = (location?: string) => {
  const [weather, setWeather] = useState(weatherData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshWeather = async (selectedLocation?: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (selectedLocation && locationWeatherData[selectedLocation]) {
        setWeather(locationWeatherData[selectedLocation])
      } else {
        setWeather(weatherData)
      }
    } catch (err) {
      setError('Failed to fetch weather data')
    } finally {
      setLoading(false)
    }
  }

  const getWeatherIcon = (condition: string) => {
    const iconMap: Record<string, string> = {
      'sunny': '☀️',
      'cloudy': '☁️',
      'rainy': '🌧️',
      'partly-cloudy': '⛅',
      'stormy': '⛈️',
      'snowy': '❄️',
      'clear': '☀️'
    }
    return iconMap[condition] || '🌤️'
  }

  const getWeatherImpact = (cropId: number) => {
    // Simulate weather impact analysis
    const impacts = {
      1: { impact: 'positive' as const, description: 'Optimal conditions for wheat growth' },
      2: { impact: 'neutral' as const, description: 'Normal conditions for rice' },
      3: { impact: 'negative' as const, description: 'High temperature stress on corn' },
      4: { impact: 'positive' as const, description: 'Good conditions for cotton germination' }
    }
    return impacts[cropId as keyof typeof impacts] || { impact: 'neutral' as const, description: 'Normal conditions' }
  }

  useEffect(() => {
    refreshWeather(location)
  }, [location])

  return {
    weather,
    loading,
    error,
    refreshWeather,
    getWeatherIcon,
    getWeatherImpact
  }
}
