import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Leaf, 
  Zap, 
  Loader2,
  Settings,
  Sun,
  Droplets,
  Sprout,
  Bug,
  TrendingUp,
  MapPin
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  isLoading?: boolean
  category?: string
}

const ChatBot: React.FC = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    { icon: Sun, text: "What's the weather forecast for my crops?", category: "weather" },
    { icon: Sprout, text: "Best crops to plant this season?", category: "crops" },
    { icon: Droplets, text: "How much water do my plants need?", category: "irrigation" },
    { icon: Bug, text: "How to identify and treat plant diseases?", category: "pest" },
    { icon: TrendingUp, text: "Market prices for my crops", category: "market" },
    { icon: MapPin, text: "Soil health in my area", category: "soil" }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    // Add loading message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isLoading: true
    }
    setMessages(prev => [...prev, loadingMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 2).toString(),
        text: generateAIResponse(text),
        isUser: false,
        timestamp: new Date(),
        category: getCategoryFromText(text)
      }

      setMessages(prev => prev.filter(m => !m.isLoading).concat([aiResponse]))
      setIsProcessing(false)
    }, 2000)
  }

  const generateAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('weather')) {
      return "Based on current weather data, expect sunny conditions with temperatures around 28°C. Perfect for most crops! Consider light irrigation in the evening."
    } else if (lowerInput.includes('crop') || lowerInput.includes('plant')) {
      return "For this season, I recommend planting tomatoes, peppers, and leafy greens. These crops thrive in current conditions and have good market demand."
    } else if (lowerInput.includes('water') || lowerInput.includes('irrigation')) {
      return "Your crops need approximately 2-3 inches of water per week. Check soil moisture 2 inches deep - if dry, it's time to water!"
    } else if (lowerInput.includes('pest') || lowerInput.includes('disease')) {
      return "Common signs include yellowing leaves, spots, or wilting. Use organic neem oil spray and ensure proper spacing for air circulation."
    } else if (lowerInput.includes('market') || lowerInput.includes('price')) {
      return "Current market prices show tomatoes at ₹25/kg, peppers at ₹40/kg. Organic produce commands 20-30% premium prices."
    } else if (lowerInput.includes('soil')) {
      return "Your soil appears to have good organic content. Consider adding compost and testing pH levels. Ideal range is 6.0-7.0 for most crops."
    }
    
    return "I'm here to help with all your farming questions! Ask me about weather, crops, irrigation, pest control, market prices, or soil health."
  }

  const getCategoryFromText = (text: string): string => {
    const lowerText = text.toLowerCase()
    if (lowerText.includes('weather')) return 'weather'
    if (lowerText.includes('crop') || lowerText.includes('plant')) return 'crops'
    if (lowerText.includes('water') || lowerText.includes('irrigation')) return 'irrigation'
    if (lowerText.includes('pest') || lowerText.includes('disease')) return 'pest'
    if (lowerText.includes('market') || lowerText.includes('price')) return 'market'
    if (lowerText.includes('soil')) return 'soil'
    return 'general'
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
    // Voice recognition logic would go here
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'weather': return 'from-blue-500 to-sky-500'
      case 'crops': return 'from-green-500 to-emerald-500'
      case 'irrigation': return 'from-cyan-500 to-blue-500'
      case 'pest': return 'from-orange-500 to-red-500'
      case 'market': return 'from-purple-500 to-pink-500'
      case 'soil': return 'from-amber-500 to-orange-500'
      default: return 'from-green-500 to-emerald-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AgriMitra AI Assistant</h1>
                <p className="text-green-600 text-sm">Your Smart Farming Companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 text-green-500 mr-2" />
              Quick Questions
            </h3>
            <div className="space-y-3">
              {quickQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuickQuestion(question.text)}
                  className="w-full text-left p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border border-green-200 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <question.icon className="w-5 h-5 text-green-600 group-hover:text-green-700" />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{question.text}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Insights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Temperature</span>
                <span className="text-sm font-medium text-green-600">28°C</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Humidity</span>
                <span className="text-sm font-medium text-blue-600">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Soil Moisture</span>
                <span className="text-sm font-medium text-emerald-600">Good</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-green-200 shadow-lg h-[600px] flex flex-col">
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              <AnimatePresence mode="popLayout">
                {messages.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to AgriMitra AI!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      I'm here to help you with farming advice, weather updates, crop recommendations, and more. 
                      Ask me anything or use the quick questions on the left!
                    </p>
                  </motion.div>
                )}

                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.isLoading ? (
                      <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Loader2 className="w-4 h-4 text-green-500" />
                          </motion.div>
                          <span className="text-sm text-gray-600">AI is thinking...</span>
                        </div>
                      </div>
                    ) : (
                      <div className={`max-w-md px-4 py-3 rounded-2xl ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-4' 
                          : `bg-gradient-to-r ${getCategoryColor(message.category)} text-white mr-4`
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.category && !message.isUser && (
                          <div className="mt-2 flex items-center space-x-2">
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                              {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-green-200 bg-green-50/50">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me about farming, weather, crops, or anything agricultural..."
                    className="w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    disabled={isProcessing}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition-all duration-200 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isProcessing}
                  className="p-3 rounded-xl bg-green-500 hover:bg-green-600 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBot