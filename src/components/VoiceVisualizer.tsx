import { useEffect, useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  voiceLevel?: number;
  className?: string;
}

export const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isListening,
  isSpeaking,
  voiceLevel = 0,
  className = ''
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isListening || isSpeaking) {
      interval = setInterval(() => {
        setAnimationPhase(prev => (prev + 1) % 4);
      }, 200);
    } else {
      setAnimationPhase(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening, isSpeaking]);

  const getWaveHeight = (index: number): number => {
    if (!isListening && !isSpeaking) return 4;
    
    const baseHeight = 4;
    const maxHeight = 20;
    const phase = (animationPhase + index) % 4;
    
    // Create wave effect
    const waveMultiplier = Math.sin((phase * Math.PI) / 2) * 0.8 + 0.2;
    const voiceLevelMultiplier = Math.max(0.3, voiceLevel);
    
    return baseHeight + (maxHeight - baseHeight) * waveMultiplier * voiceLevelMultiplier;
  };

  const getIconColor = (): string => {
    if (isListening) return 'text-blue-500';
    if (isSpeaking) return 'text-green-500';
    return 'text-gray-400';
  };

  const getBackgroundColor = (): string => {
    if (isListening) return 'bg-blue-50 border-blue-200';
    if (isSpeaking) return 'bg-green-50 border-green-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Voice Activity Indicator */}
      <div className={`relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${getBackgroundColor()}`}>
        {/* Animated Waves */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-end space-x-1">
            {[0, 1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isListening ? 'bg-blue-400' : isSpeaking ? 'bg-green-400' : 'bg-gray-300'
                }`}
                style={{
                  height: `${getWaveHeight(index)}px`,
                  opacity: isListening || isSpeaking ? 1 : 0.5
                }}
              />
            ))}
          </div>
        </div>

        {/* Central Icon */}
        <div className={`relative z-10 ${getIconColor()} transition-colors duration-300`}>
          {isListening ? (
            <Mic className="w-6 h-6" />
          ) : isSpeaking ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </div>

        {/* Pulse Effect */}
        {(isListening || isSpeaking) && (
          <div className={`absolute inset-0 rounded-full animate-ping ${
            isListening ? 'bg-blue-400' : 'bg-green-400'
          } opacity-20`} />
        )}
      </div>

      {/* Status Text */}
      <div className="ml-3 text-sm">
        <div className={`font-medium ${getIconColor()}`}>
          {isListening ? 'Listening...' : isSpeaking ? 'Speaking...' : 'Voice Ready'}
        </div>
        {(isListening || isSpeaking) && (
          <div className="text-xs text-gray-500 mt-1">
            {isListening ? 'Speak now' : 'Playing response'}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceVisualizer;