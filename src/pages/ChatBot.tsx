import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Sparkles, MessageCircle, Leaf, Cloud, TrendingUp, HelpCircle, Lightbulb, Settings, Sun, Sprout, Droplets, Bug, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdvancedAIResponseEngine } from '../utils/aiResponseEngine'
import { useVoiceChat } from '../hooks/useVoiceChat'
import VoiceVisualizer from '../components/VoiceVisualizer'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  category?: string
}

const ChatBot: React.FC = () => {
  const { t } = useTranslation()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const aiEngine = useRef(new AdvancedAIResponseEngine())
  
  // Voice chat integration
  const voiceChat = useVoiceChat((transcript) => {
    setInput(transcript)
    handleSendMessage(transcript)
  })

  const {
    voiceState: { isListening, isSpeaking, voiceLevel },
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = voiceChat

  // Check if voice features are supported
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window

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
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      category: getCategoryFromText(textToSend)
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsProcessing(true)

    try {
      // Generate AI response using the enhanced engine
      const aiResponse = await aiEngine.current.generateAdvancedResponse(textToSend)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        category: aiResponse.category
      }

      setMessages(prev => [...prev, botMessage])
      
      // Speak the AI response if voice is enabled
      if (isSupported && !isSpeaking) {
        speak(aiResponse.text)
      }
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        category: 'general'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsProcessing(false)
    }
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
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleSpeaking = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'weather': return 'from-blue-500 to-blue-600'
      case 'crops': return 'from-blue-400 to-blue-500'
      case 'irrigation': return 'from-blue-600 to-blue-700'
      case 'pest': return 'from-blue-500 to-indigo-500'
      case 'market': return 'from-indigo-500 to-blue-600'
      case 'soil': return 'from-blue-400 to-indigo-400'
      default: return 'from-blue-500 to-blue-600'
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
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white ml-4' 
                        : `bg-gradient-to-r ${getCategoryColor(message.category)} text-white mr-4`
                    }`}>
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      {message.category && message.sender === 'bot' && (
                        <div className="mt-2 flex items-center space-x-2">
                          <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            {message.category.charAt(0).toUpperCase() + message.category.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Loading indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs">
                    <div className="flex items-center space-x-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 text-green-500" />
                      </motion.div>
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
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
                    placeholder={isListening ? "Listening..." : "Ask me about farming, weather, crops, or anything agricultural..."}
                    className="w-full px-4 py-3 rounded-xl border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    disabled={isLoading || isListening}
                  />
                  {/* Voice level indicator */}
                  {isListening && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <VoiceVisualizer 
                        isListening={isListening}
                        isSpeaking={false}
                        voiceLevel={voiceLevel}
                        className="w-16 h-6"
                      />
                    </div>
                  )}
                </div>
                
                {/* Voice Controls */}
                <div className="flex items-center space-x-3">
                  {/* Enhanced Voice Visualizer */}
                  <AnimatePresence>
                    {(isListening || isSpeaking) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200 rounded-full shadow-lg backdrop-blur-sm"
                      >
                        {/* Animated Voice Waves */}
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`w-1.5 rounded-full ${
                                isListening 
                                  ? 'bg-gradient-to-t from-red-500 to-pink-500' 
                                  : 'bg-gradient-to-t from-purple-500 to-blue-500'
                              }`}
                              animate={{
                                height: [6, 18, 10, 24, 8, 16],
                                opacity: [0.3, 1, 0.5, 1, 0.4, 0.8]
                              }}
                              transition={{
                                duration: 1.8,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                        
                        {/* Status Text with Icon */}
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{ rotate: isListening ? [0, 10, -10, 0] : 0 }}
                            transition={{ duration: 0.5, repeat: isListening ? Infinity : 0 }}
                          >
                            {isListening ? (
                              <Mic className="w-4 h-4 text-red-500" />
                            ) : (
                              <Volume2 className="w-4 h-4 text-purple-500" />
                            )}
                          </motion.div>
                          <span className={`text-sm font-semibold ${
                            isListening ? 'text-red-600' : 'text-purple-600'
                          }`}>
                            {isListening ? 'Listening...' : 'Speaking...'}
                          </span>
                        </div>
                        
                        {/* Pulse Ring */}
                        <motion.div
                          className={`absolute inset-0 rounded-full border-2 ${
                            isListening ? 'border-red-300' : 'border-purple-300'
                          }`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Enhanced Speaking Control */}
                  {isSpeaking && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleSpeaking}
                      className="relative p-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg transition-all duration-300"
                      title="Stop speaking"
                    >
                      <VolumeX className="w-5 h-5" />
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-orange-300"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    </motion.button>
                  )}
                  
                  {/* Enhanced Voice Input Toggle */}
                  {isSupported && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleListening}
                      className={`relative p-4 rounded-full transition-all duration-300 shadow-lg ${
                        isListening 
                          ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                      title={isListening ? "Stop listening" : "Start voice input"}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="w-6 h-6" />
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-red-300"
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full bg-red-400 opacity-20"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                          />
                        </>
                      ) : (
                        <>
                          <Mic className="w-6 h-6" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20" />
                        </>
                      )}
                    </motion.button>
                  )}
                  
                  {/* Enhanced Send Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSendMessage()}
                    disabled={!input.trim() || isLoading}
                    className="relative p-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white shadow-lg transition-all duration-300"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                    {!input.trim() && !isLoading && (
                      <div className="absolute inset-0 rounded-full bg-gray-400/50" />
                    )}
                  </motion.button>
                </div>
              </div>
              
              {/* Voice status indicator */}
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center justify-center space-x-3 text-sm text-green-600"
                >
                  <VoiceVisualizer 
                    isListening={isListening}
                    isSpeaking={false}
                    voiceLevel={voiceLevel}
                    className="w-20 h-8"
                  />
                  <span className="font-medium">Listening... Speak now</span>
                </motion.div>
              )}
              
              {isSpeaking && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 flex items-center justify-center space-x-3 text-sm text-blue-600"
                >
                  <VoiceVisualizer 
                    isListening={false}
                    isSpeaking={isSpeaking}
                    voiceLevel={0.7}
                    className="w-20 h-8"
                  />
                  <span className="font-medium">Speaking...</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBot