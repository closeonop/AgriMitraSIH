import { useState, useEffect, useRef, useCallback } from 'react'

export interface VoiceSettings {
  language: string
  speechRate: number
  speechPitch: number
  speechVolume: number
  voiceIndex: number
  autoSpeak: boolean
  continuousListening: boolean
}

export interface VoiceState {
  isListening: boolean
  isSpeaking: boolean
  isProcessing: boolean
  transcript: string
  confidence: number
  error: string | null
  voiceLevel: number
}

export const useVoiceChat = (onTranscript?: (text: string) => void) => {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isListening: false,
    isSpeaking: false,
    isProcessing: false,
    transcript: '',
    confidence: 0,
    error: null,
    voiceLevel: 0
  })

  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    language: 'en-US',
    speechRate: 1.0,
    speechPitch: 1.0,
    speechVolume: 1.0,
    voiceIndex: 0,
    autoSpeak: true,
    continuousListening: false
  })

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      
      const recognition = recognitionRef.current
      recognition.continuous = voiceSettings.continuousListening
      recognition.interimResults = true
      recognition.lang = voiceSettings.language
      recognition.maxAlternatives = 3

      recognition.onstart = () => {
        setVoiceState(prev => ({ ...prev, isListening: true, error: null }))
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          const confidence = event.results[i][0].confidence

          if (event.results[i].isFinal) {
            finalTranscript += transcript
            setVoiceState(prev => ({ 
              ...prev, 
              transcript: finalTranscript,
              confidence: confidence || 0
            }))
            
            if (onTranscript && finalTranscript.trim()) {
              onTranscript(finalTranscript.trim())
            }
          } else {
            interimTranscript += transcript
            setVoiceState(prev => ({ 
              ...prev, 
              transcript: interimTranscript,
              confidence: confidence || 0
            }))
          }
        }
      }

      recognition.onend = () => {
        setVoiceState(prev => ({ ...prev, isListening: false }))
        if (voiceSettings.continuousListening && !voiceState.error) {
          setTimeout(() => startListening(), 1000)
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setVoiceState(prev => ({ 
          ...prev, 
          isListening: false, 
          error: `Speech recognition error: ${event.error}` 
        }))
      }
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (synthRef.current) {
        synthRef.current.cancel()
      }
      stopVoiceLevelMonitoring()
    }
  }, [voiceSettings.language, voiceSettings.continuousListening])

  // Voice level monitoring
  const startVoiceLevelMonitoring = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)
      
      microphoneRef.current.connect(analyserRef.current)
      analyserRef.current.fftSize = 256
      
      const bufferLength = analyserRef.current.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      
      const updateVoiceLevel = () => {
        if (analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / bufferLength
          setVoiceState(prev => ({ ...prev, voiceLevel: average / 255 }))
          animationFrameRef.current = requestAnimationFrame(updateVoiceLevel)
        }
      }
      
      updateVoiceLevel()
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setVoiceState(prev => ({ ...prev, error: 'Microphone access denied' }))
    }
  }, [])

  const stopVoiceLevelMonitoring = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setVoiceState(prev => ({ ...prev, voiceLevel: 0 }))
  }, [])

  const startListening = useCallback(() => {
    if (recognitionRef.current && !voiceState.isListening) {
      try {
        recognitionRef.current.start()
        startVoiceLevelMonitoring()
      } catch (error) {
        setVoiceState(prev => ({ 
          ...prev, 
          error: 'Failed to start speech recognition' 
        }))
      }
    }
  }, [voiceState.isListening, startVoiceLevelMonitoring])

  const stopListening = useCallback(() => {
    if (recognitionRef.current && voiceState.isListening) {
      recognitionRef.current.stop()
      stopVoiceLevelMonitoring()
    }
  }, [voiceState.isListening, stopVoiceLevelMonitoring])

  const toggleListening = useCallback(() => {
    if (voiceState.isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [voiceState.isListening, startListening, stopListening])

  const speak = useCallback((text: string, options?: Partial<VoiceSettings>) => {
    if (synthRef.current && text.trim()) {
      // Cancel any ongoing speech
      synthRef.current.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = synthRef.current.getVoices()
      
      // Apply settings
      const settings = { ...voiceSettings, ...options }
      utterance.rate = settings.speechRate
      utterance.pitch = settings.speechPitch
      utterance.volume = settings.speechVolume
      utterance.lang = settings.language
      
      if (voices[settings.voiceIndex]) {
        utterance.voice = voices[settings.voiceIndex]
      }

      utterance.onstart = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: true }))
      }

      utterance.onend = () => {
        setVoiceState(prev => ({ ...prev, isSpeaking: false }))
      }

      utterance.onerror = (event) => {
        setVoiceState(prev => ({ 
          ...prev, 
          isSpeaking: false, 
          error: `Speech synthesis error: ${event.error}` 
        }))
      }

      synthRef.current.speak(utterance)
    }
  }, [voiceSettings])

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel()
      setVoiceState(prev => ({ ...prev, isSpeaking: false }))
    }
  }, [])

  const getAvailableVoices = useCallback(() => {
    if (synthRef.current) {
      return synthRef.current.getVoices()
    }
    return []
  }, [])

  const updateSettings = useCallback((newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const clearError = useCallback(() => {
    setVoiceState(prev => ({ ...prev, error: null }))
  }, [])

  const resetTranscript = useCallback(() => {
    setVoiceState(prev => ({ ...prev, transcript: '', confidence: 0 }))
  }, [])

  return {
    voiceState,
    voiceSettings,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
    getAvailableVoices,
    updateSettings,
    clearError,
    resetTranscript
  }
}