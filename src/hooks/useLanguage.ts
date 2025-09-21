import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const useLanguage = () => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng)
      // Force a re-render of components that depend on language
      document.documentElement.lang = lng
      // Store in localStorage for persistence
      localStorage.setItem('agrimitra-language', lng)
    }

    i18n.on('languageChanged', handleLanguageChange)
    
    // Set initial language from localStorage if available
    const savedLanguage = localStorage.getItem('agrimitra-language')
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const changeLanguage = async (lng: string) => {
    try {
      await i18n.changeLanguage(lng)
      localStorage.setItem('agrimitra-language', lng)
      document.documentElement.lang = lng
      // Force page refresh to ensure all components update
      window.location.reload()
    } catch (error) {
      console.error('Failed to change language:', error)
    }
  }

  const availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' }
  ]

  return {
    currentLanguage,
    changeLanguage,
    availableLanguages,
    isRTL: currentLanguage === 'ar' || currentLanguage === 'ur'
  }
}
