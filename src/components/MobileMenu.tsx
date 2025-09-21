import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { X, Globe, ChevronDown, Check, Sparkles } from 'lucide-react'

const MobileMenu = ({ isOpen, onClose, onNavigate, currentPage }: { 
  isOpen: boolean; 
  onClose: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}) => {
  const { t, i18n } = useTranslation()
  const { availableLanguages } = useLanguage()
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)

  const currentLang = availableLanguages.find(lang => lang.code === i18n.language)

  const changeLanguage = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode)
      localStorage.setItem('agrimitra-language', langCode)
      setLanguageMenuOpen(false)
      // Force page refresh to ensure all components update properly
      window.location.reload()
    } catch (error) {
      console.error('Failed to change language:', error)
      setLanguageMenuOpen(false)
    }
  }

  const navItems = [
    { label: t('nav.home'), path: 'home', icon: '🏠', color: 'from-green-500 via-emerald-500 to-teal-500' },
    { label: t('nav.dashboard'), path: 'dashboard', icon: '📊', color: 'from-blue-500 to-cyan-500' },
    { label: 'Weather Forecast', path: 'weather-forecast', icon: '🌤️', color: 'from-yellow-500 to-orange-500' },
    { label: 'Soil Analysis', path: 'soil-health-analysis', icon: '🌱', color: 'from-green-600 to-lime-500' },
    { label: 'Crop Monitor', path: 'crop-monitoring', icon: '🌾', color: 'from-amber-500 to-yellow-500' },
    { label: 'Market Intel', path: 'market-intelligence', icon: '📈', color: 'from-purple-500 to-pink-500' },
    { label: t('nav.predictions'), path: 'predictions', icon: '🔮', color: 'from-indigo-500 to-purple-500' },
    { label: t('nav.recommendations'), path: 'recommendations', icon: '💡', color: 'from-orange-500 to-red-500' },
    { label: t('nav.chatbot'), path: 'chatbot', icon: '🤖', color: 'from-teal-500 to-cyan-500' },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] lg:hidden">
      {/* Enhanced Backdrop with Animation */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-md transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Enhanced Menu Panel with Slide Animation */}
      <div className={`absolute top-0 right-0 w-80 max-w-[90vw] h-full bg-gradient-to-br from-white via-gray-50 to-white shadow-2xl transform transition-all duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
          <div className="absolute bottom-20 left-0 w-24 h-24 bg-gradient-to-br from-accent-100 to-primary-100 rounded-full -translate-x-12 opacity-30" />
          
          {/* Enhanced Header */}
          <div className="relative flex items-center justify-between p-6 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer rounded-xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  AgriMitra
                </h2>
                <p className="text-xs text-gray-500 font-medium">Smart Farming Assistant</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="group p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Enhanced Language Selector */}
          <div className="relative p-4 border-b border-gray-200/50 bg-white/60 backdrop-blur-sm">
            <button
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              className="group w-full flex items-center justify-between p-4 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-xl transition-all duration-300 border border-gray-200/50 hover:border-primary-200 hover:shadow-md active:scale-98"
            >
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-primary-500 group-hover:animate-pulse" />
                <span className="text-lg">{currentLang?.flag}</span>
                <span className="font-semibold">{currentLang?.name}</span>
              </div>
              <ChevronDown className={`w-5 h-5 transition-all duration-300 text-gray-400 group-hover:text-primary-500 ${
                languageMenuOpen ? 'rotate-180 text-primary-500' : ''
              }`} />
            </button>

            {languageMenuOpen && (
              <div className="mt-3 space-y-2 animate-slide-down">
                {availableLanguages.map((lang, index) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`group w-full flex items-center space-x-4 px-4 py-3.5 text-sm transition-all duration-300 rounded-xl hover:scale-[1.02] active:scale-98 ${
                      i18n.language === lang.code
                        ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 border border-primary-200 shadow-sm'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-primary-50 hover:text-primary-600 border border-transparent hover:border-primary-100'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                      {lang.code === 'en' && '🇺🇸'}
                      {lang.code === 'hi' && '🇮🇳'}
                      {lang.code === 'pa' && '🇮🇳'}
                      {lang.code === 'or' && '🇮🇳'}
                      {lang.code === 'bn' && '🇧🇩'}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold">{lang.name}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {lang.nativeName}
                      </div>
                    </div>
                    {i18n.language === lang.code && (
                      <Check className="w-5 h-5 text-primary-600 animate-scale-in" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4 bg-white/40 backdrop-blur-sm">
            <nav className="space-y-3">
              {navItems.map((item, index) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path)
                    onClose()
                  }}
                  className={`group w-full flex items-center space-x-4 px-5 py-4 text-sm font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-98 ${
                    currentPage === item.path
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg border-l-4 border-white/30`
                      : 'text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-gray-600 hover:to-gray-700 hover:shadow-md border border-transparent hover:border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
                    currentPage === item.path
                      ? 'bg-white/20 backdrop-blur-sm scale-110'
                      : 'bg-gray-100 group-hover:bg-white/20 group-hover:scale-110'
                  }`}>
                    <span className="text-xl group-hover:animate-bounce">{item.icon}</span>
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block font-semibold">{item.label}</span>
                    <span className={`text-xs mt-0.5 block ${
                      currentPage === item.path ? 'text-white/80' : 'text-gray-500 group-hover:text-white/80'
                    }`}>
                      {item.path === 'home' && 'Dashboard overview'}
                      {item.path === 'dashboard' && 'Farm analytics'}
                      {item.path === 'weather-forecast' && 'Weather insights'}
                      {item.path === 'soil-health-analysis' && 'Soil monitoring'}
                      {item.path === 'crop-monitoring' && 'Crop health'}
                      {item.path === 'market-intelligence' && 'Market data'}
                      {item.path === 'predictions' && 'AI predictions'}
                      {item.path === 'recommendations' && 'Smart advice'}
                      {item.path === 'chatbot' && 'AI assistant'}
                    </span>
                  </div>
                  {currentPage === item.path && (
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  )}
                </button>
              ))}
            </nav>
            
            {/* Footer Section */}
            <div className="mt-8 pt-6 border-t border-gray-200/50">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium">
                  AgriMitra v2.0
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Smart Farming Solutions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
