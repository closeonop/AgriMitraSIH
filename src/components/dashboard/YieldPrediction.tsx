import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { useTranslation } from 'react-i18next'
import { useCropData } from '../../hooks/useCropData'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Helper functions
const getConfidenceColor = (confidence: number): 'success' | 'warning' | 'error' => {
  if (confidence >= 80) return 'success'
  if (confidence >= 60) return 'warning'
  return 'error'
}

const getFactorColor = (value: number): 'success' | 'warning' | 'error' => {
  if (value >= 80) return 'success'
  if (value >= 60) return 'warning'
  return 'error'
}

const YieldPrediction: React.FC = () => {
  const { t } = useTranslation()
  const { crops, getPredictionByCropId } = useCropData()
  const [selectedCrop, setSelectedCrop] = useState<number>(crops.length > 0 ? crops[0].id : 1)

  const prediction = getPredictionByCropId(selectedCrop)
  const selectedCropData = crops.find(crop => crop.id === selectedCrop)

  // Return early if no crops or prediction data
  if (!crops.length || !prediction || !selectedCropData) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" component="h2">
            {t('dashboard.yieldPrediction')}
          </Typography>
          <Alert severity="info">
            No crop data available for yield prediction.
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const historicalData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Historical Yield (tons/ha)',
        data: [38, 42, 40, 45, 43, 47],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Predicted Yield (tons/ha)',
        data: [38, 42, 40, 45, 43, prediction?.predictedYield || 45],
        borderColor: 'rgb(46, 125, 50)',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        tension: 0.4,
        borderDash: [5, 5],
        fill: false
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Yield (tons/ha)'
        }
      }
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUpIcon color="primary" />
            {t('dashboard.yieldPrediction')}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>{t('predictions.selectCrop')}</InputLabel>
            <Select
              value={selectedCrop}
              label={t('predictions.selectCrop')}
              onChange={(e) => setSelectedCrop(Number(e.target.value))}
            >
              {crops.map((crop) => (
                <MenuItem key={crop.id} value={crop.id}>
                  {crop.name} - {crop.variety || 'Unknown variety'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {prediction && selectedCropData && (
          <>
            {/* Prediction Summary */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {prediction.predictedYield} tons/ha
                </Typography>
                <Chip
                  label={`${prediction.confidence}% ${t('predictions.confidence')}`}
                  color={getConfidenceColor(prediction.confidence) as any}
                  icon={<InfoIcon />}
                />
              </Box>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Expected yield for {selectedCropData.name} ({selectedCropData.variety || 'Unknown variety'}) in {selectedCropData.area || 0} hectares
              </Typography>

              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  This prediction is based on current weather conditions, soil health, and historical data.
                </Typography>
              </Alert>
            </Box>

            {/* Chart */}
            <Box sx={{ height: 300, mb: 3 }}>
              <Line data={historicalData} options={chartOptions} />
            </Box>

            {/* Factors Analysis */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                {t('predictions.factors')}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Weather</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {prediction.factors?.weather || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={prediction.factors?.weather || 0} 
                    color={getFactorColor(prediction.factors?.weather || 0) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Soil Health</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {prediction.factors?.soil || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={prediction.factors?.soil || 0} 
                    color={getFactorColor(prediction.factors?.soil || 0) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Irrigation</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {prediction.factors?.irrigation || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={prediction.factors?.irrigation || 0} 
                    color={getFactorColor(prediction.factors?.irrigation || 0) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Pest Control</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {prediction.factors?.pestControl || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={prediction.factors?.pestControl || 0} 
                    color={getFactorColor(prediction.factors?.pestControl || 0) as any}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Risks and Recommendations */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <WarningIcon color="warning" />
                  {t('predictions.risks')}
                </Typography>
                <List dense>
                  {(prediction.risks || []).map((risk: string, index: number) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <WarningIcon color="warning" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={risk}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  Recommendations
                </Typography>
                <List dense>
                  {(prediction.recommendations || []).map((recommendation: string, index: number) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={recommendation}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default YieldPrediction // Removed unused state