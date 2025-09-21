import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sparkles, Mail, Heart, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const footerLinks = {
    product: [
      { label: t('footer.links.dashboard'), path: '/dashboard' },
      { label: t('footer.links.predictions'), path: '/predictions' },
      { label: t('footer.links.recommendations'), path: '/recommendations' },
      { label: t('footer.links.chatbot'), path: '/chatbot' }
    ],
    company: [
      { label: t('footer.links.about'), path: '/about' },
      { label: t('footer.links.contact'), path: '/contact' },
      { label: t('footer.links.careers'), path: '/careers' },
      { label: t('footer.links.blog'), path: '/blog' }
    ],
    support: [
      { label: t('footer.links.help'), path: '/help' },
      { label: t('footer.links.documentation'), path: '/docs' },
      { label: t('footer.links.api'), path: '/api' },
      { label: t('footer.links.status'), path: '/status' }
    ],
    legal: [
      { label: t('footer.links.privacy'), path: '/privacy' },
      { label: t('footer.links.terms'), path: '/terms' },
      { label: t('footer.links.cookies'), path: '/cookies' },
      { label: t('footer.links.gdpr'), path: '/gdpr' }
    ]
  }

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: '#', color: 'hover:text-blue-400' },
    { name: 'Twitter', icon: Twitter, url: '#', color: 'hover:text-sky-400' },
    { name: 'LinkedIn', icon: Linkedin, url: '#', color: 'hover:text-blue-600' },
    { name: 'Instagram', icon: Instagram, url: '#', color: 'hover:text-pink-400' },
    { name: 'YouTube', icon: Youtube, url: '#', color: 'hover:text-red-500' }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-500 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-accent-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main Footer */}
      <div className="relative container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-2 animate-fade-in">
            <div className="flex items-center space-x-4 mb-6 group">
              <div className="relative w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="w-7 h-7 text-white animate-pulse" />
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer rounded-xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AgriMitra
                </h3>
                <p className="text-gray-400 text-sm font-medium">AI Farming Assistant</p>
              </div>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed text-sm lg:text-base">
              {t('footer.description')}
            </p>
            
            {/* Enhanced Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.url}
                    className={`group w-12 h-12 bg-gray-800/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-primary-500 hover:to-accent-500 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:shadow-lg border border-gray-700/50 hover:border-transparent ${social.color}`}
                    aria-label={social.name}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <IconComponent className="w-5 h-5 group-hover:text-white transition-colors duration-300" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Enhanced Links Sections */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-lg font-bold mb-6 text-white">{t('footer.sections.product')}</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group text-gray-400 hover:text-white transition-all duration-300 text-left text-sm hover:translate-x-1 flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h4 className="text-lg font-bold mb-6 text-white">{t('footer.sections.company')}</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group text-gray-400 hover:text-white transition-all duration-300 text-left text-sm hover:translate-x-1 flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-accent-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <h4 className="text-lg font-bold mb-6 text-white">{t('footer.sections.support')}</h4>
            <ul className="space-y-4">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group text-gray-400 hover:text-white transition-all duration-300 text-left text-sm hover:translate-x-1 flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-green-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <h4 className="text-lg font-bold mb-6 text-white">{t('footer.sections.legal')}</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="group text-gray-400 hover:text-white transition-all duration-300 text-left text-sm hover:translate-x-1 flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Enhanced Newsletter Section */}
      <div className="relative border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-sm">
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="w-6 h-6 text-primary-400" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {t('footer.newsletter.title')}
              </h3>
            </div>
            <p className="text-gray-400 mb-8 text-sm lg:text-base max-w-2xl mx-auto">
              {t('footer.newsletter.description')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 max-w-md mx-auto">
              <div className="relative flex-1 w-full sm:w-auto">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="w-full px-5 py-4 bg-gray-800/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 hover:border-gray-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
              <button className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95 whitespace-nowrap">
                <span className="relative z-10">{t('footer.newsletter.subscribe')}</span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer rounded-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Bar */}
      <div className="relative border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-sm">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2024 AgriMitra. {t('footer.copyright')}
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2 group">
                <span>{t('footer.madeWith')}</span>
                <Heart className="w-4 h-4 text-red-500 group-hover:animate-pulse" />
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>{t('footer.inIndia')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
