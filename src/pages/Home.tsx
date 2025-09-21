
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  TrendingUp as TrendingUpIcon,
  WaterDrop as WaterDropIcon,
  Park as EcoIcon,
  SmartToy as BotIcon,
  Agriculture as AgricultureIcon,
  Lightbulb as LightbulbIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const features = [
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'AI Yield Prediction',
      description: 'Get accurate crop yield predictions using advanced AI algorithms and historical data.',
      color: 'primary.light'
    },
    {
      icon: <WaterDropIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Smart Irrigation',
      description: 'Optimize water usage with intelligent irrigation recommendations based on weather and soil conditions.',
      color: 'info.light'
    },
    {
      icon: <EcoIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Soil Health Analysis',
      description: 'Monitor and improve soil health with comprehensive analysis and personalized recommendations.',
      color: 'success.light'
    },
    {
      icon: <BotIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'AI Assistant',
      description: 'Get instant answers to your farming questions with our intelligent chatbot.',
      color: 'secondary.light'
    },
    {
      icon: <AgricultureIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Crop Management',
      description: 'Track and manage multiple crops with detailed monitoring and growth stage analysis.',
      color: 'warning.light'
    },
    {
      icon: <LightbulbIcon sx={{ fontSize: 40, color: 'error.main' }} />,
      title: 'Smart Recommendations',
      description: 'Receive personalized recommendations for fertilization, pest control, and harvesting.',
      color: 'error.light'
    }
  ]

  const stats = [
    { number: '10%', label: 'Average Yield Increase' },
    { number: '50+', label: 'Supported Crops' },
    { number: '1000+', label: 'Happy Farmers' },
    { number: '24/7', label: 'AI Support' }
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          textAlign: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            component="h1"
            sx={{
              fontWeight: 700,
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            🌾 {t('common.welcome')}
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{
              mb: 4,
              opacity: 0.9,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            AI-Powered Crop Yield Prediction and Optimization Platform
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 6,
              opacity: 0.8,
              maxWidth: '500px',
              mx: 'auto'
            }}
          >
            Increase your crop productivity by at least 10% through data-driven insights, 
            weather patterns, and soil health analysis.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                '&:hover': {
                  bgcolor: 'grey.100'
                }
              }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/chatbot')}
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Try AI Assistant
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h3"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: 'primary.main',
                      mb: 1
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default', display: { xs: 'none', md: 'block' } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontWeight: 700,
                color: 'primary.main',
                mb: 2
              }}
            >
              Powerful Features
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: '600px', mx: 'auto' }}
            >
              Everything you need to optimize your farming operations and increase productivity
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Card
                  className="card-hover"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        bgcolor: feature.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        mb: 2,
                        color: 'text.primary'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976D2 0%, #42A5F5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              fontWeight: 700,
              mb: 3
            }}
          >
            Ready to Transform Your Farming?
          </Typography>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              opacity: 0.9
            }}
          >
            Join thousands of farmers who have already increased their productivity with AgriMitra
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'grey.100'
              }
            }}
          >
            Start Your Journey Today
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
