import { useTranslation } from 'react-i18next'
import { Rocket, Bot, Users, Target, ArrowDown, Sparkles } from 'lucide-react'
import { BackgroundBeams } from './ui/background-beams'
import { TextGenerateEffect } from './ui/text-generate-effect'
import { Button as MovingBorderButton } from './ui/moving-border'

const Hero = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-8 sm:py-12 md:py-16 lg:py-20">
      {/* Simplified Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/src/assets/images/agricultural-hero.svg')`
          }}
        />
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-primary-800/70 to-accent-800/80" />
        {/* Enhanced Aceternity UI Background Beams */}
        <BackgroundBeams className="opacity-30" />
      </div>

      {/* Enhanced Decorative Elements with More Visual Effects */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 right-20 w-12 h-12 bg-white/10 rounded-full animate-float backdrop-blur-sm" />
        <div className="absolute bottom-32 left-20 w-10 h-10 bg-accent-400/20 rounded-full animate-float backdrop-blur-sm" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-primary-400/15 rounded-full animate-float backdrop-blur-sm" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-green-400/20 rounded-full animate-float backdrop-blur-sm" style={{ animationDelay: '0.5s' }} />
        
        {/* Additional Sparkle Effects */}
        <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-3 h-3 bg-accent-300/30 rounded-full animate-pulse" style={{ animationDelay: '2.5s' }} />
      </div>

      {/* Enhanced Content with Mobile Optimization */}
      <div className="relative z-20 container-custom text-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Badge with Sparkles */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in group hover:bg-white/15 transition-all duration-300">
            <Sparkles className="w-4 h-4 text-green-400 animate-pulse" />
            <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors duration-300">
              {t('hero.badge')}
            </span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Enhanced Main Headline with Better Mobile Typography */}
          <TextGenerateEffect 
            words={`${t('hero.title.line1')} ${t('hero.title.line2')}`}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight"
          />

          {/* Enhanced Subtitle with Mobile Optimization */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up px-2" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>

          {/* Reduced Description */}
          <p className="text-base sm:text-lg text-white/80 mb-8 sm:mb-12 max-w-xl mx-auto animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
            Smart farming solutions powered by AI
          </p>

          {/* Enhanced CTA Buttons with MovingBorder */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12 sm:mb-16 animate-slide-up px-4" style={{ animationDelay: '0.4s' }}>
            <MovingBorderButton
              onClick={() => onNavigate('dashboard')}
              borderRadius="1.5rem"
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white border-none w-full sm:w-auto min-h-[56px] px-8"
              containerClassName="w-full sm:w-auto"
              borderClassName="bg-[radial-gradient(var(--primary-500)_40%,transparent_60%)]"
              duration={3000}
            >
              <div className="flex items-center justify-center space-x-3">
                <Rocket className="w-5 h-5" />
                <span className="text-base sm:text-lg font-semibold">{t('hero.cta.primary')}</span>
              </div>
            </MovingBorderButton>
            
            <button
              onClick={() => onNavigate('chatbot')}
              className="group w-full sm:w-auto bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 hover:border-white/40 flex items-center justify-center space-x-3 min-h-[56px] active:scale-95"
            >
              <Bot className="w-5 h-5 group-hover:animate-pulse" />
              <span className="text-base sm:text-lg">{t('hero.cta.secondary')}</span>
            </button>
          </div>

          {/* Simplified Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 max-w-2xl mx-auto animate-fade-in px-4" style={{ animationDelay: '0.6s' }}>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-accent-300 mr-2 group-hover:animate-pulse" />
                <div className="text-3xl md:text-4xl font-bold text-white">10K+</div>
              </div>
              <div className="text-white/70 text-sm">{t('hero.stats.farmers')}</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-accent-300 mr-2 group-hover:animate-pulse" />
                <div className="text-3xl md:text-4xl font-bold text-white">95%</div>
              </div>
              <div className="text-white/70 text-sm">{t('hero.stats.accuracy')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll Indicator with Mobile Optimization */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-white/50 rounded-full flex justify-center hover:border-white/80 transition-colors duration-300 cursor-pointer group">
          <ArrowDown className="w-2 sm:w-3 h-2 sm:h-3 text-white/70 mt-1 sm:mt-2 animate-pulse group-hover:text-white/90" />
        </div>
      </div>
    </section>
  )
}

export default Hero
