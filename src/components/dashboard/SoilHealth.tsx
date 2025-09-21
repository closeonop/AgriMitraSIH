
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid
} from '@mui/material'
import {
  EmojiNature as EcoIcon,
  WaterDrop as WaterDropIcon,
  Science as ScienceIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { generalSoilHealthData } from '../../utils/mockData'

const SoilHealth: React.FC = () => {
  const { t } = useTranslation()

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'success'
    if (score >= 60) return 'warning'
    return 'error'
  }

  const getHealthText = (score: number) => {
    if (score >= 80) return t('soil.excellent')
    if (score >= 60) return t('soil.good')
    if (score >= 40) return t('soil.fair')
    return t('soil.poor')
  }

  const getNutrientColor = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return 'success'
    if (value < min * 0.8 || value > max * 1.2) return 'error'
    return 'warning'
  }

  const getNutrientStatus = (value: number, min: number, max: number) => {
    if (value >= min && value <= max) return 'Optimal'
    if (value < min) return 'Low'
    return 'High'
  }

  const nutrients = [
    {
      name: t('soil.nitrogen'),
      value: generalSoilHealthData.nitrogen,
      min: 40,
      max: 60,
      unit: 'ppm',
      icon: <ScienceIcon />
    },
    {
      name: t('soil.phosphorus'),
      value: generalSoilHealthData.phosphorus,
      min: 25,
      max: 40,
      unit: 'ppm',
      icon: <ScienceIcon />
    },
    {
      name: t('soil.potassium'),
      value: generalSoilHealthData.potassium,
      min: 50,
      max: 80,
      unit: 'ppm',
      icon: <ScienceIcon />
    },
    {
      name: t('soil.moisture'),
      value: generalSoilHealthData.moisture,
      min: 60,
      max: 80,
      unit: '%',
      icon: <WaterDropIcon />
    }
  ]

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
            <EcoIcon color="primary" />
            {t('dashboard.soilHealth')}
          </Typography>
          <Chip
            label={getHealthText(generalSoilHealthData.healthScore)}
            color={getHealthColor(generalSoilHealthData.healthScore) as any}
            icon={<CheckCircleIcon />}
          />
        </Box>

        {/* Overall Health Score */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              Overall Health Score
            </Typography>
            <Typography variant="h5" fontWeight={700} color={`${getHealthColor(generalSoilHealthData.healthScore)}.main`}>
              {generalSoilHealthData.healthScore}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={generalSoilHealthData.healthScore}
            color={getHealthColor(generalSoilHealthData.healthScore) as any}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        {/* pH Level */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body1" fontWeight={600}>
              {t('soil.ph')}
            </Typography>
            <Typography variant="h6" fontWeight={700}>
              {generalSoilHealthData.ph}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={(generalSoilHealthData.ph / 14) * 100}
            color={generalSoilHealthData.ph >= 6 && generalSoilHealthData.ph <= 7.5 ? 'success' : 'warning'}
            sx={{ height: 8, borderRadius: 4 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
            Optimal range: 6.0 - 7.5
          </Typography>
        </Box>

        {/* Nutrients */}
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Nutrient Levels
        </Typography>
        
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {nutrients.map((nutrient, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {nutrient.icon}
                  <Typography variant="body2" fontWeight={600}>
                    {nutrient.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" fontWeight={700}>
                    {nutrient.value} {nutrient.unit}
                  </Typography>
                  <Chip
                    label={getNutrientStatus(nutrient.value, nutrient.min, nutrient.max)}
                    color={getNutrientColor(nutrient.value, nutrient.min, nutrient.max) as any}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.min((nutrient.value / nutrient.max) * 100, 100)}
                  color={getNutrientColor(nutrient.value, nutrient.min, nutrient.max) as any}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Range: {nutrient.min} - {nutrient.max} {nutrient.unit}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Organic Matter */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
            {t('soil.organicMatter')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6" fontWeight={700}>
              {generalSoilHealthData.organicMatter}%
            </Typography>
            <Chip
              label={generalSoilHealthData.organicMatter >= 3 ? 'Good' : 'Needs Improvement'}
              color={generalSoilHealthData.organicMatter >= 3 ? 'success' : 'warning'}
              size="small"
            />
          </Box>
          <LinearProgress
            variant="determinate"
            value={(generalSoilHealthData.organicMatter / 5) * 100}
            color={generalSoilHealthData.organicMatter >= 3 ? 'success' : 'warning'}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>

        {/* Recommendations */}
        {generalSoilHealthData.recommendations.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <InfoIcon color="info" />
              Recommendations
            </Typography>
            <List dense>
              {generalSoilHealthData.recommendations.map((recommendation, index) => (
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
        )}
      </CardContent>
    </Card>
  )
}

export default SoilHealth
