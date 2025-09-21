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
    
    let response = ''
    if (lowerCommand.includes('yield') || lowerCommand.includes('production') || lowerCommand.includes('उत्पादन')) {
      response = 'Your crop yield is expected to be 45.2 tons per hectare.'
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('mausam') || lowerCommand.includes('मौसम')) {
      response = 'Today\'s temperature is 28 degrees Celsius and humidity is 65%.'
    } else if (lowerCommand.includes('irrigation') || lowerCommand.includes('pani') || lowerCommand.includes('सिंचाई')) {
      response = 'Water your crops every 3-4 days.'
    } else if (lowerCommand.includes('fertilizer') || lowerCommand.includes('khad') || lowerCommand.includes('खाद')) {
      response = 'Apply NPK fertilizer 20-20-20 at 2kg per acre.'
    } else {
      response = 'I can help you with your farming needs. Please repeat your question.'
    }
    
    speakResponse(response)
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
      
      <div className="container-custom relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/20 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{t('voice.badge')}</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              {t('voice.title')}
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('voice.description')}
            </p>
          </div>

          {/* Premium Voice Assistant Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Voice Control Card */}
            <div className="lg:col-span-2">
              <WobbleCard containerClassName="max-w-none bg-gradient-to-br from-purple-800/50 to-blue-800/50 backdrop-blur-sm border border-purple-500/20">
                <CardContainer className="inter-var">
                  <CardBody className="bg-transparent relative group/card w-full h-auto rounded-xl p-8">
                    {/* AI Avatar with 3D Effect */}
                    <CardItem
                      translateZ="100"
                      className="w-full flex justify-center mb-8"
                    >
                      <div className="relative">
                        <div className="w-40 h-40 bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-7xl shadow-2xl">
                          🤖
                        </div>
                        {(isListening || isSpeaking) && (
                          <>
                            <div className="absolute inset-0 rounded-full border-4 border-purple-400 animate-ping opacity-75" />
                            <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse" />
                          </>
                        )}
                        {/* Voice Level Indicator */}
                        {isListening && (
                          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                            <div className="flex space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-8 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full animate-pulse`}
                                  style={{
                                    animationDelay: `${i * 0.1}s`,
                                    height: `${Math.random() * 32 + 16}px`
                                  }}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardItem>

                    {/* Voice Control Button */}
                    <CardItem
                      translateZ="60"
                      className="w-full flex justify-center mb-8"
                    >
                      <Button
                        onClick={startListening}
                        disabled={isListening || isSpeaking}
                        borderRadius="50%"
                        className={`w-28 h-28 rounded-full transition-all duration-300 transform ${
                          isListening 
                            ? 'bg-red-500/80 scale-110 animate-pulse shadow-2xl shadow-red-500/50' 
                            : isSpeaking
                            ? 'bg-blue-500/80 scale-105 shadow-2xl shadow-blue-500/50'
                            : 'bg-gradient-to-br from-purple-500/80 to-blue-500/80 hover:scale-105 shadow-2xl shadow-purple-500/30'
                        } ${isListening || isSpeaking ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                        containerClassName="w-28 h-28"
                        borderClassName="bg-[radial-gradient(var(--purple-500)_40%,transparent_60%)]"
                        duration={2000}
                      >
                        <div className="flex items-center justify-center">
                          {isListening ? (
                            <Mic className="w-10 h-10 text-white" />
                          ) : isSpeaking ? (
                            <Volume2 className="w-10 h-10 text-white animate-pulse" />
                          ) : (
                            <Mic className="w-10 h-10 text-white" />
                          )}
                        </div>
                      </Button>
                    </CardItem>

                    {/* Status Display */}
                    <CardItem
                      translateZ="40"
                      className="w-full text-center mb-6"
                    >
                      {isListening ? (
                        <div className="space-y-2">
                          <p className="text-2xl font-bold text-red-400 animate-pulse">
                            {t('voice.listening')}
                          </p>
                          <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      ) : isSpeaking ? (
                        <p className="text-2xl font-bold text-blue-400 animate-pulse">
                          {t('voice.speaking')}
                        </p>
                      ) : (
                        <p className="text-2xl font-bold text-white">
                          {t('voice.clickToSpeak')}
                        </p>
                      )}
                    </CardItem>

                    {/* Last Command Display */}
                    {lastCommand && (
                      <CardItem
                        translateZ="20"
                        className="w-full"
                      >
                        <div className="p-6 bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl border border-purple-500/30">
                          <div className="flex items-center space-x-2 text-purple-300 mb-2">
                            <Brain className="w-5 h-5" />
                            <p className="text-sm font-medium">{t('voice.lastCommand')}</p>
                          </div>
                          <p className="text-white font-medium text-lg">"{lastCommand}"</p>
                        </div>
                      </CardItem>
                    )}
                  </CardBody>
                </CardContainer>
              </WobbleCard>
            </div>

            {/* Side Panel with Controls */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <WobbleCard containerClassName="bg-gradient-to-br from-indigo-800/50 to-purple-800/50 backdrop-blur-sm border border-indigo-500/20">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 rounded-lg border border-purple-500/30 text-white text-left transition-all duration-200 hover:scale-105">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Voice Settings
                      </div>
                    </button>
                    <button className="w-full p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 rounded-lg border border-blue-500/30 text-white text-left transition-all duration-200 hover:scale-105">
                      <div className="flex items-center">
                        <Headphones className="w-4 h-4 mr-2" />
                        Audio Test
                      </div>
                    </button>
                  </div>
                </div>
              </WobbleCard>

              {/* Language Support */}
              <WobbleCard containerClassName="bg-gradient-to-br from-green-800/50 to-teal-800/50 backdrop-blur-sm border border-green-500/20">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-green-400" />
                    Languages
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <span className="text-2xl">🇺🇸</span>
                      <span className="text-white">English</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <span className="text-2xl">🇮🇳</span>
                      <span className="text-white">हिन्दी</span>
                    </div>
                    <div className="flex items-center space-x-3 p-2 rounded-lg bg-white/5">
                      <span className="text-2xl">🇮🇳</span>
                      <span className="text-white">ਪੰਜਾਬੀ</span>
                    </div>
                  </div>
                </div>
              </WobbleCard>
            </div>
          </div>

          {/* Sample Commands Section */}
          <WobbleCard containerClassName="bg-gradient-to-r from-orange-800/30 to-red-800/30 backdrop-blur-sm border border-orange-500/20">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
                <Brain className="w-6 h-6 mr-2 text-orange-400" />
                {t('voice.sampleCommands')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl border border-orange-500/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-3 text-white">
                    <span className="text-2xl">🌾</span>
                    <div>
                      <p className="font-medium">Crop Yield</p>
                      <p className="text-sm text-gray-300">"{t('voice.commands.yield')}"</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-xl border border-blue-500/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-3 text-white">
                    <span className="text-2xl">🌤️</span>
                    <div>
                      <p className="font-medium">Weather</p>
                      <p className="text-sm text-gray-300">"{t('voice.commands.weather')}"</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-3 text-white">
                    <span className="text-2xl">💧</span>
                    <div>
                      <p className="font-medium">Irrigation</p>
                      <p className="text-sm text-gray-300">"{t('voice.commands.irrigation')}"</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30 hover:scale-105 transition-all duration-200 cursor-pointer">
                  <div className="flex items-center space-x-3 text-white">
                    <span className="text-2xl">🌱</span>
                    <div>
                      <p className="font-medium">Fertilizer</p>
                      <p className="text-sm text-gray-300">"{t('voice.commands.fertilizer')}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </WobbleCard>

          {/* Floating Dock for Quick Access */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
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
