
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  WaterDrop as WaterDropIcon,
  PestControl as PestControlIcon,
  Agriculture as AgricultureIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useCropData } from '../../hooks/useCropData'
import YieldPrediction from './YieldPrediction'
import SoilHealth from './SoilHealth'

const Dashboard: React.FC = () => {
  const { t } = useTranslation()
  const { crops, getCropStats, refreshData, loading } = useCropData()
  const stats = getCropStats()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'success'
      case 'warning': return 'warning'
      case 'critical': return 'error'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return t('soil.excellent')
      case 'warning': return t('soil.good')
      case 'critical': return t('soil.poor')
      default: return status
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          {t('dashboard.title')}
        </Typography>
        <Tooltip title="Refresh Data">
          <IconButton onClick={refreshData} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Crops
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.totalCrops}
                  </Typography>
                </Box>
                <AgricultureIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Healthy Crops
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {stats.healthyCrops}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Average Health
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.averageHealth}%
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.averageHealth} 
                    sx={{ mt: 1, height: 6, borderRadius: 3 }}
                  />
                </Box>
                <WaterDropIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className="card-hover">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Total Area
                  </Typography>
                  <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
                    {stats.totalArea} ha
                  </Typography>
                </Box>
                <PestControlIcon sx={{ fontSize: 40, color: 'secondary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Yield Prediction */}
        <Grid item xs={12} lg={8}>
          <YieldPrediction />
        </Grid>

        {/* Soil Health */}
        <Grid item xs={12} lg={6}>
          <SoilHealth />
        </Grid>

        {/* Crop Status */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                  {t('dashboard.cropStatus')}
                </Typography>
                <Tooltip title="Crop health information">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {crops.map((crop) => (
                  <Box key={crop.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {crop.name} - {crop.variety}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {crop.currentStage} • {crop.area} ha
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          Health: {crop.healthScore}%
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={crop.healthScore} 
                          sx={{ width: 60, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    </Box>
                    <Chip 
                      label={getStatusText(crop.status)}
                      color={getStatusColor(crop.status) as any}
                      size="small"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
