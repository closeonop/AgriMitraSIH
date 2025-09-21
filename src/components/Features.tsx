import { useTranslation } from 'react-i18next'
import { CloudSun, BarChart3, Sprout, Lightbulb, Sparkles, Rocket, MessageSquare, Zap, Star } from 'lucide-react'
import { HoverEffect } from './ui/card-hover-effect'

interface FeaturesProps {
  onNavigate?: (page: string) => void
}

const Features = ({ onNavigate }: FeaturesProps) => {
  const { t } = useTranslation()

  const features = [
    {
      icon: <CloudSun className="w-6 h-6 text-white" />,
      title: t('features.weather.title'),
      description: t('features.weather.description'),
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      action: () => onNavigate?.('weather-forecast')
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-white" />,
      title: t('features.yield.title'),
      description: t('features.yield.description'),
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      action: () => onNavigate?.('predictions')
    },
    {
      icon: <Sprout className="w-6 h-6 text-white" />,
      title: t('features.soil.title'),
      description: t('features.soil.description'),
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      action: () => onNavigate?.('soil-health-analysis')
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-white" />,
      title: t('features.smart.title'),
      description: t('features.smart.description'),
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      action: () => onNavigate?.('recommendations')
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 px-6 py-3 rounded-full text-sm font-medium mb-6 hover:bg-gradient-to-r hover:from-primary-200 hover:to-accent-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer">
            <Sparkles className="w-4 h-4 group-hover:animate-spin group-hover:text-primary-600" />
            <span className="group-hover:font-semibold transition-all duration-300">{t('features.badge')}</span>
            <Star className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up hover:text-primary-600 transition-colors duration-300">
            {t('features.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto animate-slide-up hover:text-gray-700 transition-colors duration-300" style={{ animationDelay: '0.2s' }}>
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <HoverEffect items={features} className="max-w-7xl mx-auto" />

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="btn-primary flex items-center space-x-2 group relative overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Rocket className="w-4 h-4 group-hover:animate-bounce relative z-10" />
              <span className="relative z-10 group-hover:font-semibold transition-all duration-300">{t('features.exploreAll')}</span>
              <Sparkles className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-pulse relative z-10 transition-all duration-300" />
            </button>
            <button
              onClick={() => onNavigate?.('chatbot')}
              className="btn-secondary flex items-center space-x-2 group relative overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100"
            >
              <MessageSquare className="w-4 h-4 group-hover:animate-pulse group-hover:scale-110 transition-all duration-300" />
              <span className="group-hover:font-semibold transition-all duration-300">{t('features.getHelp')}</span>
              <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-all duration-300" />
            </button>
          </div>
          
          {/* Additional Interactive Elements */}
          <div className="mt-8 flex justify-center space-x-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-600 transition-colors duration-300 cursor-pointer group">
              <Star className="w-4 h-4 group-hover:animate-spin" />
              <span>Trusted by 10,000+ farmers</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 hover:text-accent-600 transition-colors duration-300 cursor-pointer group">
              <Zap className="w-4 h-4 group-hover:animate-bounce" />
              <span>99.9% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Features
