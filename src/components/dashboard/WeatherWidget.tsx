import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Thermostat as ThermostatIcon,
  WaterDrop as WaterDropIcon,
  Air as AirIcon,
  Cloud as CloudIcon,
  WbSunny as SunIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useWeather } from '../../hooks/useWeather'

const WeatherWidget: React.FC = () => {
  const { t } = useTranslation()
  const { weather, loading, refreshWeather, getWeatherIcon } = useWeather()

  const getWeatherIconComponent = (condition: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'sunny': <SunIcon sx={{ fontSize: 40, color: '#FFA726' }} />,
      'cloudy': <CloudIcon sx={{ fontSize: 40, color: '#90A4AE' }} />,
      'rainy': <WaterDropIcon sx={{ fontSize: 40, color: '#42A5F5' }} />,
      'partly-cloudy': <CloudIcon sx={{ fontSize: 40, color: '#90A4AE' }} />,
      'stormy': <CloudIcon sx={{ fontSize: 40, color: '#424242' }} />,
      'snowy': <CloudIcon sx={{ fontSize: 40, color: '#E3F2FD' }} />,
      'clear': <SunIcon sx={{ fontSize: 40, color: '#FFA726' }} />
    }
    return iconMap[condition] || <CloudIcon sx={{ fontSize: 40, color: '#90A4AE' }} />
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'warning'
      case 'critical': return 'error'
      default: return 'info'
    }
  }

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        backgroundImage: `url('/src/assets/images/weather-dashboard-bg.svg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative z-10">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }} className="group-hover:text-primary-600 transition-colors duration-300">
            {t('dashboard.weatherWidget')}
          </Typography>
          <Tooltip title="Refresh Weather">
            <IconButton 
              onClick={refreshWeather} 
              disabled={loading} 
              size="small"
              className="hover:scale-110 hover:rotate-180 transition-all duration-300 hover:bg-blue-50"
            >
              <RefreshIcon className={loading ? 'animate-spin' : ''} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Current Weather */}
        <Box sx={{ textAlign: 'center', mb: 3 }} className="group-hover:scale-105 transition-transform duration-300">
          <div className="group-hover:animate-bounce">
            {getWeatherIconComponent(weather.current.condition)}
          </div>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700, mt: 1 }} className="group-hover:text-blue-600 transition-colors duration-300">
            {weather.current.temperature}°C
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }} className="group-hover:text-gray-700 transition-colors duration-300">
            {weather.current.condition}
          </Typography>
          <Typography variant="body2" color="text.secondary" className="group-hover:text-gray-600 transition-colors duration-300">
            {new Date(weather.current.timestamp).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Weather Details */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} className="group hover:scale-105 hover:bg-blue-50/50 p-2 rounded-lg transition-all duration-300 cursor-pointer">
              <WaterDropIcon color="info" fontSize="small" className="group-hover:animate-pulse" />
              <Box>
                <Typography variant="body2" color="text.secondary" className="group-hover:text-blue-600 transition-colors duration-300">
                  {t('weather.humidity')}
                </Typography>
                <Typography variant="body1" fontWeight={600} className="group-hover:text-blue-700 transition-colors duration-300">
                  {weather.current.humidity}%
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }} className="group hover:scale-105 hover:bg-green-50/50 p-2 rounded-lg transition-all duration-300 cursor-pointer">
              <WaterDropIcon color="primary" fontSize="small" className="group-hover:animate-pulse" />
              <Box>
                <Typography variant="body2" color="text.secondary" className="group-hover:text-green-600 transition-colors duration-300">
                  {t('weather.rainfall')}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {weather.current.rainfall}mm
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AirIcon color="secondary" fontSize="small" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('weather.windSpeed')}
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {weather.current.windSpeed} km/h
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThermostatIcon color="warning" fontSize="small" />
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pressure
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {weather.current.pressure} hPa
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 7-Day Forecast */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          {t('weather.forecast')}
        </Typography>
        
        <List dense>
          {weather.forecast.slice(0, 5).map((day, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                {getWeatherIconComponent(day.condition)}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {day.low}°
                      </Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {day.high}°
                      </Typography>
                    </Box>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {day.condition}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {day.rainfall}mm
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>

        {/* Weather Alerts */}
        {weather.alerts.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WarningIcon color="warning" />
              Weather Alerts
            </Typography>
            {weather.alerts.map((alert) => (
              <Alert 
                key={alert.id} 
                severity={getAlertColor(alert.type) as any}
                sx={{ mb: 1 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {alert.title}
                </Typography>
                <Typography variant="body2">
                  {alert.description}
                </Typography>
              </Alert>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default WeatherWidget
