import { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sun, Sprout, Droplets, Bug, TrendingUp, MapPin, Volume2, VolumeX, Pause, Play } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  category?: string
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const quickQuestions = [
    { icon: Sun, text: "What's the best time to plant rice?", category: "crops" },
    { icon: Sprout, text: "How to improve soil fertility naturally?", category: "soil" },
    { icon: Droplets, text: "Benefits of drip irrigation system", category: "irrigation" },
    { icon: Bug, text: "Organic pest control methods", category: "pest" },
    { icon: TrendingUp, text: "Current market prices for vegetables", category: "market" },
    { icon: MapPin, text: "Weather impact on crop growth", category: "weather" }
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateFarmingResponse = (question: string, category: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (category === 'weather') {
      if (lowerQuestion.includes('rain') || lowerQuestion.includes('monsoon')) {
        return "Based on current weather patterns, the monsoon season typically brings 60-80% of annual rainfall. For optimal crop planning, consider planting rice and sugarcane during monsoon months."
      }
      return "Weather plays a crucial role in farming. I can help you with rainfall patterns, temperature effects on crops, and seasonal planning."
    }
    
    if (category === 'crops') {
      if (lowerQuestion.includes('rice')) {
        return "Rice cultivation tips: Plant during monsoon (June-July), maintain 2-5cm water level in fields, use certified seeds (25-30kg/hectare). Expected yield: 4-6 tons/hectare."
      }
      return "I can help with crop selection, planting techniques, growth stages, and harvesting. Which specific crop are you interested in?"
    }
    
    if (category === 'irrigation') {
      return "Drip irrigation benefits: 30-50% water savings, reduced weed growth, better nutrient delivery. Ideal for vegetables, fruits, and cash crops."
    }
    
    if (category === 'pest') {
      return "Organic pest control: Use neem oil spray, companion planting with marigold, beneficial insects like ladybugs. Regular monitoring is key."
    }
    
    if (category === 'soil') {
      return "Soil health tips: Test pH (ideal 6.0-7.5), add organic compost (5-10 tons/hectare), practice crop rotation. Healthy soil equals healthy crops."
    }
    
    if (category === 'market') {
      return "Market intelligence: Check daily mandi prices, plan harvest timing based on trends, consider value addition through processing and packaging."
    }
    
    return "I'm here to help with all your farming needs - crops, irrigation, soil health, pest management, and market information. What would you like to know?"
  }

  // Text-to-Speech functionality
  const speakText = (text: string) => {
    if (!isVoiceEnabled || !('speechSynthesis' in window)) return

    // Stop any current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configure speech settings
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8
    
    // Set voice to a more natural sounding one if available
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice = voices.find(voice => 
      voice.name.includes('Google') || 
      voice.name.includes('Microsoft') ||
      voice.lang.startsWith('en')
    )
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const pauseResumeSpeaking = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    } else {
      window.speechSynthesis.pause()
    }
  }

  const toggleVoiceOutput = () => {
    if (isSpeaking) {
      stopSpeaking()
    }
    setIsVoiceEnabled(!isVoiceEnabled)
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

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      category: getCategoryFromText(messageText)
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const category = getCategoryFromText(messageText)
      const botResponse = generateFarmingResponse(messageText, category)
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        category: category
      }

      setMessages(prev => [...prev, botMessage])
      
      // Speak the bot response if voice is enabled
      if (isVoiceEnabled) {
        setTimeout(() => speakText(botResponse), 500)
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
      
      // Speak error message if voice is enabled
      if (isVoiceEnabled) {
        setTimeout(() => speakText("I'm sorry, I encountered an error. Please try again."), 500)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question)
  }

  const toggleListening = () => {
    setIsListening(!isListening)
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'weather': return 'from-blue-500 to-blue-600'
      case 'crops': return 'from-green-500 to-green-600'
      case 'irrigation': return 'from-cyan-500 to-cyan-600'
      case 'pest': return 'from-red-500 to-red-600'
      case 'market': return 'from-purple-500 to-purple-600'
      case 'soil': return 'from-yellow-500 to-yellow-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">AgriMitra AI</h1>
                  <p className="text-green-100 mt-1">Your Smart Farming Assistant</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium">Welcome to AgriMitra AI!</p>
                  <p className="mt-2">Ask me anything about farming, crops, irrigation, or agriculture.</p>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-green-600 text-white' 
                      : `bg-gradient-to-r ${getCategoryColor(message.category)} text-white`
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 rounded-lg px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t bg-gray-50 p-4">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Questions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {quickQuestions.map((question, index) => {
                    const IconComponent = question.icon
                    return (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question.text)}
                        className="flex items-center space-x-2 p-2 text-xs bg-white border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-green-600" />
                        <span className="truncate">{question.text}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about farming, crops, irrigation..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  onClick={toggleListening}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleVoiceOutput}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isVoiceEnabled 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  title={isVoiceEnabled ? 'Disable voice output' : 'Enable voice output'}
                >
                  {isVoiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
                {isSpeaking && (
                  <button
                    onClick={pauseResumeSpeaking}
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                    title="Pause/Resume speech"
                  >
                    {window.speechSynthesis?.paused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                )}
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    title="Stop speech"
                  >
                    <VolumeX className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-3 flex justify-center items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className={isListening ? 'text-red-600' : 'text-gray-500'}>Voice Input</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isSpeaking ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></div>
                  <span className={isSpeaking ? 'text-blue-600' : 'text-gray-500'}>AI Speaking</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${isVoiceEnabled ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className={isVoiceEnabled ? 'text-green-600' : 'text-gray-500'}>Voice Output</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatBot