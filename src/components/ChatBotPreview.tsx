import { useTranslation } from 'react-i18next'
import { Bot, MessageSquare, Sparkles, ArrowRight, Zap, Star, Brain, Mic, Send } from 'lucide-react'
import { useState } from 'react'

interface ChatBotPreviewProps {
  onNavigate?: (page: string) => void
}

const ChatBotPreview = ({ onNavigate }: ChatBotPreviewProps) => {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Smart AI Responses",
      description: "Get intelligent answers to your farming questions"
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: "Voice Commands",
      description: "Speak naturally and get instant responses"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Analysis",
      description: "Instant crop and weather insights"
    }
  ]

  const sampleMessages = [
    { type: 'user', text: 'What\'s the best time to plant rice?' },
    { type: 'ai', text: 'Based on your location and current weather patterns, the optimal planting time for rice is during the monsoon season, typically June-July. The soil moisture and temperature conditions are ideal during this period.' },
    { type: 'user', text: 'How can I improve soil health?' },
    { type: 'ai', text: 'I recommend organic composting, crop rotation, and regular soil testing. Would you like specific recommendations based on your soil type?' }
  ]

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-slate-50 via-white to-green-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-green-100/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-green-50/20 to-blue-50/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 px-6 py-3 rounded-full text-sm font-medium mb-6 hover:bg-gradient-to-r hover:from-green-200 hover:to-blue-200 hover:shadow-lg hover:scale-105 transition-all duration-300 group cursor-pointer">
            <Sparkles className="w-4 h-4 group-hover:animate-spin group-hover:text-green-600" />
            <span className="group-hover:font-semibold transition-all duration-300">AI-Powered Assistant</span>
            <Star className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-300" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 animate-slide-up">
            Meet Your <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Smart Farming</span> Assistant
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Get instant answers, personalized recommendations, and expert guidance for all your agricultural needs with our advanced AI chatbot.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group flex items-start space-x-4 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 hover:border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => onNavigate?.('chatbot')}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Bot className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isHovered ? 'animate-bounce' : ''}`} />
                <span className="relative z-10">Try AI Assistant Now</span>
                <ArrowRight className={`w-4 h-4 relative z-10 transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right Side - Chat Preview */}
          <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="relative">
              {/* Chat Container */}
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden hover:shadow-3xl transition-all duration-500">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">AgriMitra AI</h3>
                      <p className="text-white/80 text-sm">Your Smart Farming Assistant</p>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-sm text-white/80">Online</span>
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                  {sampleMessages.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                      style={{ animationDelay: `${0.5 + index * 0.2}s` }}
                    >
                      <div className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white' 
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      } hover:scale-105 transition-transform duration-200`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="p-6 border-t border-gray-200/50 bg-gray-50/50">
                  <div className="flex items-center space-x-3 bg-white rounded-2xl p-3 border border-gray-200 hover:border-green-300 transition-colors duration-300">
                    <input 
                      type="text" 
                      placeholder="Ask me anything about farming..."
                      className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                      disabled
                    />
                    <button className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white hover:scale-110 transition-transform duration-200">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-400/20 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700">24/7</div>
            <div className="text-gray-600 group-hover:text-gray-700">Available Support</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 group-hover:text-blue-700">95%</div>
            <div className="text-gray-600 group-hover:text-gray-700">Accuracy Rate</div>
          </div>
          <div className="text-center group hover:scale-105 transition-transform duration-300">
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2 group-hover:text-green-700">1000+</div>
            <div className="text-gray-600 group-hover:text-gray-700">Questions Answered Daily</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ChatBotPreview