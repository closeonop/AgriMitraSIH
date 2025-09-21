import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/moving-border'
import { WobbleCard } from './ui/wobble-card'
import { CardContainer, CardBody, CardItem } from './ui/3d-card'
import { Spotlight } from './ui/spotlight'
import { FloatingDock } from './ui/floating-dock'
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Settings, 
  Headphones,
  Zap,
  Brain,
  Lightbulb,
  Sparkles
} from 'lucide-react'

const VoiceAssistant = () => {
  const { t } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastCommand, setLastCommand] = useState('')
  const [voiceLevel, setVoiceLevel] = useState(0)

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'hi-IN'

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setLastCommand(transcript)
        processVoiceCommand(transcript)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.start()
    } else {
      alert('Speech recognition not supported in this browser')
    }
  }

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('weather') || lowerCommand.includes('मौसम')) {
      speakResponse('आज का मौसम साफ है। तापमान 25 डिग्री सेल्सियस है।')
    } else if (lowerCommand.includes('crop') || lowerCommand.includes('फसल')) {
      speakResponse('आपकी गेहूं की फसल अच्छी स्थिति में है। अगले सप्ताह पानी देने की सलाह है।')
    } else if (lowerCommand.includes('fertilizer') || lowerCommand.includes('खाद')) {
      speakResponse('नाइट्रोजन आधारित खाद का उपयोग करें। प्रति एकड़ 50 किलो की मात्रा में।')
    } else {
      speakResponse('मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया अपना सवाल दोहराएं।')
    }
  }

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'hi-IN'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <section className="section-padding bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <Spotlight className="top-40 left-0 md:left-60 md:-top-20" fill="white" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
      
      <div className="container-custom relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header - Mobile Optimized */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/20 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{t('voice.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent px-4">
              {t('voice.title')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
              {t('voice.description')}
            </p>
          </div>

          {/* Premium Voice Assistant Interface - Mobile Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
            {/* Main Voice Control Card */}
            <div className="lg:col-span-2 order-1">
              <WobbleCard containerClassName="max-w-none bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm border border-purple-500/20">
                <CardContainer className="inter-var">
                  <CardBody className="bg-transparent relative group/card w-full h-auto rounded-xl p-4 sm:p-6 lg:p-8">
                    {/* AI Avatar with 3D Effect - Mobile Optimized */}
                    <CardItem
                      translateZ="100"
                      className="w-full flex justify-center mb-4 sm:mb-6 lg:mb-8"
                    >
                      <div className="relative">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-4xl sm:text-5xl lg:text-7xl shadow-2xl">
                          🤖
                        </div>
                        {(isListening || isSpeaking) && (
                          <>
                            <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-purple-400 animate-ping opacity-75" />
                            <div className="absolute inset-0 rounded-full border border-blue-400 sm:border-2 animate-pulse" />
                          </>
                        )}
                        {/* Voice Level Indicator - Mobile Optimized */}
                        {isListening && (
                          <div className="absolute -bottom-2 sm:-bottom-4 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-1 sm:w-2 h-4 sm:h-6 lg:h-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse`}
                                  style={{
                                    animationDelay: `${i * 0.1}s`,
                                    height: `${Math.random() * 16 + 8}px`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardItem>

                    {/* Voice Control Button - Mobile Optimized */}
                    <CardItem
                      translateZ="60"
                      className="w-full flex justify-center mb-4 sm:mb-6 lg:mb-8"
                    >
                      <Button
                        onClick={startListening}
                        disabled={isListening || isSpeaking}
                        borderRadius="50%"
                        className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full transition-all duration-300 transform ${
                          isListening 
                            ? 'bg-red-500/80 scale-110 animate-pulse shadow-2xl shadow-red-500/50' 
                            : isSpeaking
                            ? 'bg-blue-500/80 scale-105 shadow-2xl shadow-blue-500/50'
                            : 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 hover:scale-105 shadow-2xl shadow-purple-500/30'
                        } ${isListening || isSpeaking ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        containerClassName="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28"
                        borderClassName="bg-[radial-gradient(var(--purple-500)_40%,transparent_60%)]"
                        duration={2000}
                      >
                        <div className="flex items-center justify-center">
                          {isListening ? (
                            <Mic className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                          ) : isSpeaking ? (
                            <Volume2 className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white animate-pulse" />
                          ) : (
                            <Mic className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white" />
                          )}
                        </div>
                      </Button>
                    </CardItem>

                    {/* Status Display - Mobile Optimized */}
                    <CardItem
                      translateZ="40"
                      className="w-full text-center mb-4 sm:mb-6"
                    >
                      {isListening ? (
                        <div className="space-y-2">
                          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-400 animate-pulse">
                            {t('voice.listening')}
                          </p>
                          <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      ) : isSpeaking ? (
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-400 animate-pulse">
                          {t('voice.speaking')}
                        </p>
                      ) : (
                        <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                          {t('voice.clickToSpeak')}
                        </p>
                      )}
                    </CardItem>

                    {/* Last Command Display - Mobile Optimized */}
                    {lastCommand && (
                      <CardItem
                        translateZ="20"
                        className="w-full"
                      >
                        <div className="p-3 sm:p-4 lg:p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30">
                          <div className="flex items-center space-x-2 text-purple-300 mb-2">
                            <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                            <p className="text-xs sm:text-sm font-medium">{t('voice.lastCommand')}</p>
                          </div>
                          <p className="text-white font-medium text-sm sm:text-base lg:text-lg break-words">"{lastCommand}"</p>
                        </div>
                      </CardItem>
                    )}
                  </CardBody>
                </CardContainer>
              </WobbleCard>
            </div>

            {/* Side Panel with Controls - Mobile Optimized */}
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-3">
              {/* Quick Actions */}
              <WobbleCard containerClassName="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 backdrop-blur-sm border border-indigo-500/20">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <button className="w-full p-2 sm:p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 rounded-lg border border-purple-500/30 text-white text-left transition-all duration-200 hover:scale-105 active:scale-95">
                      <div className="flex items-center">
                        <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        <span className="text-sm sm:text-base">Voice Settings</span>
                      </div>
                    </button>
                    <button className="w-full p-2 sm:p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-lg border border-blue-500/30 text-white text-left transition-all duration-200 hover:scale-105 active:scale-95">
                      <div className="flex items-center">
                        <Headphones className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        <span className="text-sm sm:text-base">Audio Test</span>
                      </div>
                    </button>
                  </div>
                </div>
              </WobbleCard>

              {/* Language Support */}
              <WobbleCard containerClassName="bg-gradient-to-br from-green-800/50 to-teal-800/50 backdrop-blur-sm border border-green-500/20">
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                    <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                    Languages
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <span className="text-lg sm:text-2xl">🇺🇸</span>
                      <span className="text-white text-sm sm:text-base">English</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <span className="text-lg sm:text-2xl">🇮🇳</span>
                      <span className="text-white text-sm sm:text-base">हिन्दी</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <span className="text-lg sm:text-2xl">🇮🇳</span>
                      <span className="text-white text-sm sm:text-base">ਪੰਜਾਬੀ</span>
                    </div>
                  </div>
                </div>
              </WobbleCard>
            </div>
          </div>

          {/* Sample Commands Section - Mobile Optimized */}
          <WobbleCard containerClassName="bg-gradient-to-r from-orange-800/30 to-red-800/30 backdrop-blur-sm border border-orange-500/20">
            <div className="p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center flex items-center justify-center">
                <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-orange-400" />
                {t('voice.sampleCommands')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                    <span className="text-xl sm:text-2xl">🌾</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Crop Yield</p>
                      <p className="text-xs sm:text-sm text-gray-300 truncate">"{t('voice.commands.yield')}"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                    <span className="text-xl sm:text-2xl">🌤️</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Weather</p>
                      <p className="text-xs sm:text-sm text-gray-300 truncate">"{t('voice.commands.weather')}"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                    <span className="text-xl sm:text-2xl">💧</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Irrigation</p>
                      <p className="text-xs sm:text-sm text-gray-300 truncate">"{t('voice.commands.irrigation')}"</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 hover:scale-105 transition-all duration-200 cursor-pointer active:scale-95">
                  <div className="flex items-center space-x-2 sm:space-x-3 text-white">
                    <span className="text-xl sm:text-2xl">🌱</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm sm:text-base">Fertilizer</p>
                      <p className="text-xs sm:text-sm text-gray-300 truncate">"{t('voice.commands.fertilizer')}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WobbleCard>

          {/* Floating Dock for Quick Access - Hidden on Mobile */}
          <div className="hidden lg:block fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <FloatingDock
              items={[
                {
                  title: "Voice Assistant",
                  icon: <Mic className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
                  href: "#voice"
                },
                {
                  title: "Settings",
                  icon: <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
                  href: "#settings"
                },
                {
                  title: "Help",
                  icon: <Lightbulb className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
                  href: "#help"
                }
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default VoiceAssistant
