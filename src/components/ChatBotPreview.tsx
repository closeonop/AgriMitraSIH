import { useTranslation } from 'react-i18next'
import { Bot, MessageSquare, Sparkles, ArrowRight, Zap, Star, Brain, Mic, Send, Users, Clock, TrendingUp, Leaf, Sun, Droplets } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChatBotPreviewProps {
  onNavigate?: (page: string) => void
}

const ChatBotPreview = ({ onNavigate }: ChatBotPreviewProps) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  const features = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Smart AI Responses",
      description: "Get intelligent answers to your farming questions instantly",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice Commands", 
      description: "Speak naturally in your preferred language",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Analysis",
      description: "Instant crop health and weather insights",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Leaf className="w-5 h-5" />,
      title: "Crop Guidance",
      description: "Personalized recommendations for your crops",
      color: "from-green-600 to-lime-500"
    }
  ]

  const sampleMessages = [
    { type: 'user', text: 'What\'s the best time to plant rice?', icon: <Users className="w-3 h-3" /> },
    { type: 'ai', text: 'Based on your location, the optimal planting time for rice is during monsoon season, typically June-July. 🌾', icon: <Bot className="w-3 h-3" /> },
    { type: 'user', text: 'How can I improve soil health?', icon: <Users className="w-3 h-3" /> },
    { type: 'ai', text: 'I recommend organic composting and crop rotation. Would you like specific tips for your soil type? 🌱', icon: <Bot className="w-3 h-3" /> },
    { type: 'user', text: 'Check weather for tomorrow', icon: <Users className="w-3 h-3" /> },
    { type: 'ai', text: 'Tomorrow: Partly cloudy, 28°C, 70% humidity. Perfect for field work! ☀️', icon: <Bot className="w-3 h-3" /> }
  ]

  const quickActions = [
    { icon: <Sun className="w-4 h-4" />, text: t('chatbotPreview.quickActions.weatherUpdate'), color: "bg-yellow-100 text-yellow-700" },
    { icon: <Leaf className="w-4 h-4" />, text: t('chatbotPreview.quickActions.cropAdvice'), color: "bg-green-100 text-green-700" },
    { icon: <Droplets className="w-4 h-4" />, text: t('chatbotPreview.quickActions.soilAnalysis'), color: "bg-blue-100 text-blue-700" }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % Math.min(sampleMessages.length, 4))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleNavigateToChat = () => {
    console.log('Navigating to chatbot...')
    if (onNavigate) {
      onNavigate('chatbot')
    }
  }

  const visibleMessages = sampleMessages.slice(0, currentMessageIndex + 2)

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-slate-50 via-white to-green-50 overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 right-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Icons */}
        <div className="absolute top-20 left-20 opacity-10 animate-float">
          <Leaf className="w-8 h-8 text-green-500" />
        </div>
        <div className="absolute bottom-32 right-32 opacity-10 animate-float" style={{ animationDelay: '1s' }}>
          <Bot className="w-6 h-6 text-blue-500" />
        </div>
        <div className="absolute top-40 right-20 opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <Sparkles className="w-5 h-5 text-purple-500" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium mb-6 hover:bg-gradient-to-r hover:from-green-200 hover:to-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer">
            <Sparkles className="w-4 h-4 group-hover:animate-spin group-hover:text-green-600" />
            <span className="group-hover:font-semibold transition-all duration-300">{t('chatbotPreview.badge')}</span>
            <Star className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 animate-slide-up">
            {t('chatbotPreview.title.meetYour')} <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{t('chatbotPreview.title.smartFarming')}</span> {t('chatbotPreview.title.assistant')}
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('chatbotPreview.description')}
          </p>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {quickActions.map((action, index) => (
              <div key={index} className={`inline-flex items-center space-x-2 ${action.color} px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-200 cursor-pointer`}>
                {action.icon}
                <span>{action.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Side - Enhanced Features */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group relative p-6 rounded-2xl bg-white/70 backdrop-blur-sm border border-gray-200/50 hover:bg-white/90 hover:border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                  
                  <div className="relative flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced CTA Button */}
            <div className="pt-6">
              <button
                onClick={handleNavigateToChat}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Bot className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`} />
                <span className="relative z-10 text-lg">Try AI Assistant Now</span>
                <ArrowRight className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
                
                {/* Ripple Effect */}
                <div className="absolute inset-0 rounded-2xl bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-500 opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>

          {/* Right Side - Enhanced Chat Preview */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              {/* Chat Container */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-500">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-700/20 to-blue-700/20" />
                  <div className="relative flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">AgriMitra AI</h3>
                      <p className="text-white/80 text-sm">Your Smart Farming Assistant</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-white/80">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 max-h-80 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white">
                  {visibleMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                    >
                      <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl relative group ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' 
                          : 'bg-white text-gray-800 border border-gray-200 shadow-md'
                      } hover:scale-105 transition-all duration-200`}>
                        <div className="flex items-start space-x-2">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                            message.type === 'user' ? 'bg-white/20' : 'bg-gray-100'
                          }`}>
                            {message.icon}
                          </div>
                          <p className="text-sm leading-relaxed flex-1">{message.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing Indicator */}
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-gray-500" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Chat Input */}
                <div className="p-6 border-t border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50">
                  <div className="flex items-center space-x-3 bg-white rounded-2xl p-4 border border-gray-200 hover:border-green-300 transition-colors duration-300 shadow-sm">
                    <input 
                      type="text" 
                      placeholder="Ask me anything about farming..."
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      disabled
                    />
                    <div className="flex items-center space-x-2">
                      <button className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors duration-200">
                        <Mic className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 shadow-lg">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400/30 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute top-1/2 -right-2 w-4 h-4 bg-purple-400/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>

        {/* Enhanced Bottom Stats */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.7s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2 group-hover:text-green-700 flex items-center justify-center">
                <Clock className="w-6 h-6 mr-2" />
                24/7
              </div>
              <div className="text-sm text-gray-600 group-hover:text-gray-700">{t('chatbotPreview.stats.support')}</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-2 group-hover:text-blue-700 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 mr-2" />
                95%
              </div>
              <div className="text-sm text-gray-600 group-hover:text-gray-700">{t('chatbotPreview.stats.accuracy')}</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-green-600 mb-2 group-hover:text-green-700 flex items-center justify-center">
                <Users className="w-6 h-6 mr-2" />
                1000+
              </div>
              <div className="text-sm text-gray-600 group-hover:text-gray-700">{t('chatbotPreview.stats.farmers')}</div>
            </div>
            <div className="text-center group hover:scale-105 transition-transform duration-300 p-4 rounded-xl bg-white/50 backdrop-blur-sm">
              <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-2 group-hover:text-purple-700 flex items-center justify-center">
                <MessageSquare className="w-6 h-6 mr-2" />
                {t('chatbotPreview.stats.languages')}
              </div>
              <div className="text-sm text-gray-600 group-hover:text-gray-700">Multi-Language Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatBotPreview