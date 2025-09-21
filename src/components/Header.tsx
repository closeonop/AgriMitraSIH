import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../hooks/useLanguage'
import { 
  Home, 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Bot, 
  ChevronDown, 
  Globe, 
  Menu, 
  Check,
  CloudSun,
  Sprout,
  Eye,
  TrendingDown,
  Sparkles,
  X,
  MessageCircle
} from 'lucide-react'

const Header = ({ isScrolled, onMobileMenuToggle, onNavigate, currentPage }: { 
  isScrolled: boolean; 
  onMobileMenuToggle: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}) => {
  const { t, i18n } = useTranslation()
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [featuresMenuOpen, setFeaturesMenuOpen] = useState(false)

  // Close other dropdown when one opens
  const handleFeaturesMenuToggle = () => {
    setFeaturesMenuOpen(!featuresMenuOpen)
    if (languageMenuOpen) setLanguageMenuOpen(false)
  }

  const handleLanguageMenuToggle = () => {
    setLanguageMenuOpen(!languageMenuOpen)
    if (featuresMenuOpen) setFeaturesMenuOpen(false)
  }

  const { currentLanguage, changeLanguage: changeLanguageHook, availableLanguages } = useLanguage()

  const currentLang = availableLanguages.find(lang => lang.code === i18n.language)

  const navItems = [
    { label: t('nav.dashboard'), path: 'dashboard', icon: BarChart3 },
    { label: t('nav.predictions'), path: 'predictions', icon: TrendingUp },
    { label: t('nav.recommendations'), path: 'recommendations', icon: MessageSquare },
    { label: t('nav.chatbot'), path: 'chatbot', icon: Bot },
  ]

  const featureItems = [
    { label: 'Weather Forecast', path: 'weather-forecast', icon: CloudSun },
    { label: 'Soil Analysis', path: 'soil-health-analysis', icon: Sprout },
    { label: 'Crop Monitor', path: 'crop-monitoring', icon: Eye },
    { label: 'Market Intel', path: 'market-intelligence', icon: TrendingDown },
  ]

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

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
        : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Now functions as Home button */}
          <div 
            className={`flex items-center space-x-2 cursor-pointer group animate-fade-in transition-all duration-300 ${
              currentPage === 'home' 
                ? 'scale-105' 
                : 'hover:scale-105'
            }`}
            onClick={() => onNavigate('home')}
          >
            <div className={`relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br transition-all duration-300 rounded-xl flex items-center justify-center shadow-md overflow-hidden ${
              currentPage === 'home'
                ? 'from-green-500 via-emerald-500 to-teal-500 shadow-lg shadow-green-500/25 scale-110'
                : 'from-primary-500 via-accent-500 to-primary-600 group-hover:scale-110 group-hover:shadow-lg'
            }`}>
              <Sparkles className={`w-5 h-5 md:w-6 md:h-6 text-white transition-all duration-300 ${
                currentPage === 'home' 
                  ? 'animate-pulse drop-shadow-sm' 
                  : 'group-hover:animate-pulse'
              }`} />
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              {/* Active indicator for home */}
              {currentPage === 'home' && (
                <div className="absolute -inset-1 bg-green-400/20 rounded-xl animate-ping" />
              )}
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-lg md:text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent transition-all duration-300 ${
                currentPage === 'home'
                  ? 'from-green-600 to-emerald-600 animate-pulse font-extrabold tracking-wide'
                  : 'from-primary-600 to-accent-600 group-hover:animate-pulse'
              }`}>
                AgriMitra
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 animate-slide-down" style={{ animationDelay: '0.2s' }}>
            {navItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`group relative flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl hover:scale-105 ${
                    currentPage === item.path
                      ? 'text-white bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:shadow-md'
                  }`}
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <IconComponent className={`w-4 h-4 transition-all duration-300 ${
                    currentPage === item.path 
                      ? 'scale-110 animate-pulse'
                      : 'group-hover:scale-110 group-hover:animate-pulse'
                  }`} />
                  <span>{item.label}</span>
                  {currentPage === item.path && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl opacity-20 animate-pulse" />
                  )}
                </button>
              )
            })}
            
            {/* Features Dropdown */}
            <div className="relative animate-slide-down" style={{ animationDelay: '0.5s' }}>
              <button
                onClick={handleFeaturesMenuToggle}
                className={`group flex items-center space-x-2 px-4 py-2.5 text-sm font-medium transition-all duration-300 rounded-xl hover:scale-105 ${
                  featureItems.some(item => currentPage === item.path)
                    ? 'text-white bg-gradient-to-r from-primary-500 to-accent-500 shadow-lg'
                    : 'text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:shadow-md'
                }`}
              >
                <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-all duration-300 ${
                  featuresMenuOpen ? 'rotate-180 animate-pulse' : 'group-hover:scale-110'
                }`} />
              </button>

              {featuresMenuOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50 animate-scale-in overflow-hidden">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100/50 mb-2">
                    Smart Features
                  </div>
                  {featureItems.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          onNavigate(item.path)
                          setFeaturesMenuOpen(false)
                        }}
                        className={`group w-full flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 hover:shadow-sm mx-2 rounded-xl ${
                          currentPage === item.path
                            ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-md'
                            : 'text-gray-700'
                        }`}
                        style={{ animationDelay: `${0.1 * index}s` }}
                      >
                        <div className={`p-2 rounded-lg transition-all duration-200 ${
                          currentPage === item.path 
                            ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white' 
                            : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-primary-500 group-hover:to-accent-500 group-hover:text-white'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <div className="font-medium truncate">{item.label}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {item.path === 'weather-forecast' && 'Real-time weather data'}
                            {item.path === 'soil-health-analysis' && 'AI-powered soil insights'}
                            {item.path === 'crop-monitoring' && 'Monitor crop health'}
                            {item.path === 'market-intelligence' && 'Market trends & prices'}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Side Actions - Compact */}
          <div className="flex items-center space-x-2 animate-slide-down" style={{ animationDelay: '0.3s' }}>
            {/* Language Selector - Compact */}
            <div className="relative">
              <button
                onClick={handleLanguageMenuToggle}
                className="group flex items-center space-x-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-lg transition-all duration-300 border border-gray-200 hover:border-primary-300 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md hover:scale-105"
                title="Change Language"
              >
                <Globe className="w-4 h-4 group-hover:scale-110 transition-all duration-300" />
                <span className="text-base group-hover:animate-bounce">
                  {currentLang?.code === 'en' && '🇺🇸'}
                  {currentLang?.code === 'hi' && '🇮🇳'}
                  {currentLang?.code === 'pa' && '🇮🇳'}
                  {currentLang?.code === 'or' && '🇮🇳'}
                  {currentLang?.code === 'bn' && '🇧🇩'}
                </span>
                <span className="hidden md:block font-medium text-xs">{currentLang?.name}</span>
                <ChevronDown className={`w-3 h-3 transition-all duration-200 ${
                  languageMenuOpen ? 'rotate-180' : 'group-hover:scale-110'
                }`} />
              </button>

              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-3 z-50 animate-scale-in overflow-hidden">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100/50 mb-2 flex items-center space-x-2">
                    <Globe className="w-3 h-3" />
                    <span>Select Language</span>
                  </div>
                  {availableLanguages.map((lang, index) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code)
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 hover:text-primary-600 hover:shadow-sm mx-2 rounded-xl group ${
                        i18n.language === lang.code
                          ? 'bg-gradient-to-r from-primary-50 to-accent-50 text-primary-700 shadow-md border-r-2 border-primary-500'
                          : 'text-gray-700'
                      }`}
                      style={{ animationDelay: `${0.1 * index}s` }}
                    >
                      <span className="text-xl group-hover:animate-bounce flex-shrink-0">
                        {lang.code === 'en' && '🇺🇸'}
                        {lang.code === 'hi' && '🇮🇳'}
                        {lang.code === 'pa' && '🇮🇳'}
                        {lang.code === 'or' && '🇮🇳'}
                        {lang.code === 'bn' && '🇧🇩'}
                      </span>
                      <div className="flex-1 text-left min-w-0">
                        <div className="font-medium truncate">{lang.name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {lang.nativeName}
                        </div>
                      </div>
                      {i18n.language === lang.code && (
                        <Check className="w-4 h-4 text-primary-600 animate-pulse flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Button - Compact */}
            <button
              onClick={() => onNavigate('chatbot')}
              className="group relative overflow-hidden bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm"
            >
              <span className="relative z-10 flex items-center space-x-1.5">
                <MessageCircle className="w-4 h-4 group-hover:animate-pulse" />
                <span className="hidden sm:block">AI Chat</span>
              </span>
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={onMobileMenuToggle}
              className="lg:hidden group relative p-3 text-gray-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-md"
            >
              <Menu className="w-6 h-6 group-hover:scale-110 group-hover:animate-pulse transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
