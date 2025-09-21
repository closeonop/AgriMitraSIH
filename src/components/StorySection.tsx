import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Wheat, Bot, Rocket, Lightbulb, Phone } from 'lucide-react'

const StorySection = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const storySections = [
    {
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: t('story.section1.title'),
      description: t('story.section1.description'),
      stats: [
        { label: t('story.stats.farmers'), value: '10,000+' },
        { label: t('story.stats.crops'), value: '50+' },
        { label: t('story.stats.acres'), value: '1M+' }
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      title: t('story.section2.title'),
      description: t('story.section2.description'),
      stats: [
        { label: t('story.stats.accuracy'), value: '95%' },
        { label: t('story.stats.yield'), value: '+15%' },
        { label: t('story.stats.cost'), value: '-20%' }
      ]
    }
  ]

  return (
    <div>
      {storySections.map((section, index) => (
        <section key={index} className="relative min-h-screen flex items-center py-16 md:py-0">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${section.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
          </div>

          {/* Content */}
          <div className="relative z-10 container-custom px-4 md:px-6">
            <div className={`max-w-4xl mx-auto md:mx-0 ${index % 2 === 0 ? 'md:ml-0' : 'md:ml-auto'}`}>
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-2xl">
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-sm font-medium mb-4 md:mb-6 hover:bg-primary-200 transition-all duration-300 group">
                  {index === 0 ? (
                    <Wheat className="w-4 h-4 group-hover:animate-pulse" />
                  ) : (
                    <Bot className="w-4 h-4 group-hover:animate-pulse" />
                  )}
                  <span>{t('story.badge')}</span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight">
                  {section.title}
                </h2>

                {/* Description */}
                <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 leading-relaxed">
                  {section.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-8">
                  {section.stats.map((stat, statIndex) => (
                    <div key={statIndex} className="text-center">
                      <div className="text-xl sm:text-2xl md:text-4xl font-bold text-primary-600 mb-1 md:mb-2">
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm md:text-base text-gray-600 font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="btn-primary flex items-center space-x-2 text-sm md:text-base group">
                  {index === 0 ? (
                    <Rocket className="w-4 h-4 group-hover:animate-bounce" />
                  ) : (
                    <Lightbulb className="w-4 h-4 group-hover:animate-pulse" />
                  )}
                  <span>{t('story.learnMore')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 z-5 pointer-events-none">
            <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full animate-float" />
            <div className="absolute top-40 right-20 w-12 h-12 bg-primary-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-40 left-20 w-20 h-20 bg-accent-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-20 right-10 w-14 h-14 bg-white/5 rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
          </div>
        </section>
      ))}

      {/* Call to Action Section */}
      <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-600">
        <div className="container-custom text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t('story.cta.title')}
            </h2>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              {t('story.cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                onClick={() => navigate('/dashboard')}
                className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2 group"
              >
                <Rocket className="w-5 h-5 group-hover:animate-bounce" />
                <span>{t('story.cta.getStarted')}</span>
              </button>
              <button 
                onClick={() => navigate('/chatbot')}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 group"
              >
                <Phone className="w-5 h-5 group-hover:animate-pulse" />
                <span>{t('story.cta.contact')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StorySection
