import { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse
} from '@mui/material'
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  TrendingUp as TrendingUpIcon,
  Lightbulb as LightbulbIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Agriculture as AgricultureIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ open = true, onClose }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const location = useLocation()
  const navigate = useNavigate()
  const [cropsOpen, setCropsOpen] = useState(false)

  const menuItems = [
    {
      text: t('navigation.home'),
      icon: <HomeIcon />,
      path: '/',
      exact: true
    },
    {
      text: t('navigation.dashboard'),
      icon: <DashboardIcon />,
      path: '/dashboard'
    },
    {
      text: t('navigation.predictions'),
      icon: <TrendingUpIcon />,
      path: '/predictions'
    },
    {
      text: t('navigation.recommendations'),
      icon: <LightbulbIcon />,
      path: '/recommendations'
    },
    {
      text: t('navigation.chatbot'),
      icon: <ChatIcon />,
      path: '/chatbot'
    }
  ]

  const handleNavigation = (path: string) => {
    navigate(path)
    if (isMobile && onClose) {
      onClose()
    }
  }

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  const drawerContent = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'background.paper' }}>
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🌾 AgriMitra
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-Powered Farming
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ px: 2, py: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 2,
                bgcolor: isActive(item.path, item.exact) ? 'primary.light' : 'transparent',
                color: isActive(item.path, item.exact) ? 'white' : 'text.primary',
                '&:hover': {
                  bgcolor: isActive(item.path, item.exact) ? 'primary.main' : 'action.hover',
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive(item.path, item.exact) ? 'white' : 'text.secondary',
                  minWidth: 40
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.path, item.exact) ? 600 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <List sx={{ px: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setCropsOpen(!cropsOpen)}
            sx={{ borderRadius: 2 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <AgricultureIcon />
            </ListItemIcon>
            <ListItemText primary="My Crops" />
            {cropsOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        
        <Collapse in={cropsOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4, borderRadius: 2 }}>
              <ListItemText primary="Wheat (2.5 ha)" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, borderRadius: 2 }}>
              <ListItemText primary="Rice (1.8 ha)" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, borderRadius: 2 }}>
              <ListItemText primary="Corn (3.2 ha)" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4, borderRadius: 2 }}>
              <ListItemText primary="Cotton (2.1 ha)" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItem disablePadding sx={{ mt: 1 }}>
          <ListItemButton
            onClick={() => handleNavigation('/settings')}
            sx={{
              borderRadius: 2,
              bgcolor: isActive('/settings') ? 'primary.light' : 'transparent',
              color: isActive('/settings') ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isActive('/settings') ? 'primary.main' : 'action.hover',
              }
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive('/settings') ? 'white' : 'text.secondary',
                minWidth: 40
              }}
            >
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('navigation.settings')}
              primaryTypographyProps={{
                fontWeight: isActive('/settings') ? 600 : 400
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default Sidebar
