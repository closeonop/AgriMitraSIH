import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Mic, 
  MicOff, 
  VolumeX, 
  Settings, 
  Headphones,
  Zap,
  Brain,
  Lightbulb
} from 'lucide-react';
import VoiceVisualizer from './VoiceVisualizer';

interface VoiceControlsProps {
  isListening: boolean;
  isSpeaking: boolean;
  voiceSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onStopSpeaking: () => void;
  onVoiceCommand?: (command: string) => void;
  className?: string;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  isSpeaking,
  voiceSupported,
  onStartListening,
  onStopListening,
  onStopSpeaking,
  className = ''
}) => {
  const { t, i18n } = useTranslation();
  const [showSettings, setShowSettings] = useState(false);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const [lastCommand] = useState('');
  const [commandHistory] = useState<string[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Voice level monitoring
  useEffect(() => {
    if (isListening && voiceSupported) {
      startVoiceLevelMonitoring();
    } else {
      stopVoiceLevelMonitoring();
    }

    return () => stopVoiceLevelMonitoring();
  }, [isListening, voiceSupported]);

  const startVoiceLevelMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream);
      
      microphoneRef.current.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVoiceLevel = () => {
        if (analyserRef.current && isListening) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setVoiceLevel(average / 255);
          requestAnimationFrame(updateVoiceLevel);
        }
      };
      
      updateVoiceLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopVoiceLevelMonitoring = () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (analyserRef.current) {
      analyserRef.current = null;
    }
    if (microphoneRef.current) {
      microphoneRef.current = null;
    }
    setVoiceLevel(0);
  };

  const getVoiceCommands = () => {
    return [
      { command: t('chatbot.voiceCommands.weather'), example: "What's the weather like?" },
      { command: t('chatbot.voiceCommands.crops'), example: "Tell me about wheat farming" },
      { command: t('chatbot.voiceCommands.irrigation'), example: "How should I water my crops?" },
      { command: t('chatbot.voiceCommands.fertilizer'), example: "What fertilizer should I use?" },
      { command: t('chatbot.voiceCommands.pests'), example: "How to control pests?" }
    ];
  };

  if (!voiceSupported) {
    return (
      <div className={`p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <div className="flex items-center gap-2 text-yellow-700">
          <MicOff className="w-5 h-5" />
          <span className="text-sm font-medium">Voice features not supported</span>
        </div>
        <p className="text-xs text-yellow-600 mt-1">
          Please use Chrome, Edge, or Safari for voice functionality
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 sm:space-y-4 ${className}`}>
      {/* Main Voice Controls */}
      <div className="flex items-center justify-between p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <VoiceVisualizer
          isListening={isListening}
          isSpeaking={isSpeaking}
          voiceLevel={voiceLevel}
          className="flex-1"
        />
        
        <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-4">
          {/* Voice Input Button */}
          <button
            onClick={isListening ? onStopListening : onStartListening}
            disabled={isSpeaking}
            className={`p-2 sm:p-3 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-500 text-white shadow-lg scale-110'
                : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md hover:shadow-lg'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Mic className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          {/* Stop Speaking Button */}
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="p-2 sm:p-3 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-md"
              title="Stop speaking"
            >
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            title="Voice settings"
          >
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Last Command Display */}
      {lastCommand && (
        <div className="p-2 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-1 sm:gap-2 text-blue-700">
            <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">Last voice command:</span>
          </div>
          <p className="text-xs sm:text-sm text-blue-600 mt-1">"{lastCommand}"</p>
        </div>
      )}

      {/* Voice Settings Panel */}
      {showSettings && (
        <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 sm:space-y-4">
          <div className="flex items-center gap-1 sm:gap-2 text-gray-700">
            <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base font-medium">Voice Settings</span>
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Voice Language
            </label>
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>

          {/* Voice Commands Help */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Sample Voice Commands
            </label>
            <div className="space-y-1 sm:space-y-2">
              {getVoiceCommands().slice(0, 3).map((cmd, index) => (
                <div key={index} className="flex items-center gap-1 sm:gap-2 p-2 bg-white rounded border">
                  <Zap className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">"{cmd.example}"</span>
                </div>
              ))}
            </div>
          </div>

          {/* Command History */}
          {commandHistory.length > 0 && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Recent Commands
              </label>
              <div className="space-y-1">
                {commandHistory.slice(0, 3).map((cmd, index) => (
                  <div key={index} className="text-xs text-gray-500 p-2 bg-white rounded border">
                    "{cmd}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voice Tips */}
      <div className="p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-1 sm:gap-2 text-green-700 mb-1 sm:mb-2">
          <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-medium">Voice Tips</span>
        </div>
        <ul className="text-xs text-green-600 space-y-0.5 sm:space-y-1">
          <li>• Speak clearly and at normal pace</li>
          <li>• Use specific farming terms for better results</li>
          <li>• Wait for the beep before speaking</li>
          <li>• Ask follow-up questions for detailed help</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceControls;