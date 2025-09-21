import React, { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box
} from '@mui/material'
import {
  Language as LanguageIcon,
  Check as CheckIcon
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation()
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageChange = (languageCode: string) => {
    changeLanguage(languageCode)
    handleClose()
  }

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage)

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ color: 'white' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <LanguageIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
            {currentLang?.flag}
          </Typography>
        </Box>
      </IconButton>
      
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {availableLanguages.map((language) => (
          <MenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            selected={language.code === currentLanguage}
            sx={{
              minWidth: 120,
              '&.Mui-selected': {
                bgcolor: 'primary.light',
                '&:hover': {
                  bgcolor: 'primary.main',
                }
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Typography sx={{ fontSize: '1.2rem' }}>
                {language.flag}
              </Typography>
            </ListItemIcon>
            <ListItemText 
              primary={language.name}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: language.code === currentLanguage ? 600 : 400
              }}
            />
            {language.code === currentLanguage && (
              <CheckIcon fontSize="small" color="primary" />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default LanguageSelector
