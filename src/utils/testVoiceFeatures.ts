export interface VoiceTestResult {
  feature: string;
  supported: boolean;
  error?: string;
  performance?: number;
  browserInfo: string;
}

export class VoiceFeatureTester {
  private results: VoiceTestResult[] = [];

  constructor() {
    this.results = [];
  }

  public async runAllTests(): Promise<VoiceTestResult[]> {
    this.results = [];
    
    // Test browser compatibility
    await this.testBrowserCompatibility();
    
    // Test speech recognition
    await this.testSpeechRecognition();
    
    // Test speech synthesis
    await this.testSpeechSynthesis();
    
    // Test microphone access
    await this.testMicrophoneAccess();
    
    // Test language support
    await this.testLanguageSupport();
    
    // Test performance
    await this.testPerformance();
    
    return this.results;
  }

  private getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    return `${browser} (${navigator.platform})`;
  }

  private async testBrowserCompatibility(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    
    // Test Web Speech API support
    const speechRecognitionSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    const speechSynthesisSupported = 'speechSynthesis' in window;
    const mediaDevicesSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    
    this.results.push({
      feature: 'Speech Recognition API',
      supported: speechRecognitionSupported,
      browserInfo,
      error: speechRecognitionSupported ? undefined : 'Web Speech API not supported in this browser'
    });

    this.results.push({
      feature: 'Speech Synthesis API',
      supported: speechSynthesisSupported,
      browserInfo,
      error: speechSynthesisSupported ? undefined : 'Speech Synthesis API not supported'
    });

    this.results.push({
      feature: 'Media Devices API',
      supported: mediaDevicesSupported,
      browserInfo,
      error: mediaDevicesSupported ? undefined : 'Media Devices API not supported'
    });
  }

  private async testSpeechRecognition(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (!SpeechRecognition) {
        this.results.push({
          feature: 'Speech Recognition Initialization',
          supported: false,
          browserInfo,
          error: 'SpeechRecognition constructor not available'
        });
        return;
      }

      const recognition = new SpeechRecognition();
      
      // Test basic configuration
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      this.results.push({
        feature: 'Speech Recognition Initialization',
        supported: true,
        browserInfo
      });

      // Test language support
      const languages = ['en-US', 'hi-IN', 'pa-IN'];
      for (const lang of languages) {
        try {
          recognition.lang = lang;
          this.results.push({
            feature: `Speech Recognition Language: ${lang}`,
            supported: true,
            browserInfo
          });
        } catch (error) {
          this.results.push({
            feature: `Speech Recognition Language: ${lang}`,
            supported: false,
            browserInfo,
            error: `Language ${lang} not supported`
          });
        }
      }

    } catch (error) {
      this.results.push({
        feature: 'Speech Recognition Initialization',
        supported: false,
        browserInfo,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async testSpeechSynthesis(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    
    try {
      if (!('speechSynthesis' in window)) {
        this.results.push({
          feature: 'Speech Synthesis',
          supported: false,
          browserInfo,
          error: 'speechSynthesis not available'
        });
        return;
      }

      // Test basic synthesis
      const utterance = new SpeechSynthesisUtterance('Test');
      
      this.results.push({
        feature: 'Speech Synthesis Initialization',
        supported: true,
        browserInfo
      });

      // Test voice availability
      const voices = speechSynthesis.getVoices();
      this.results.push({
        feature: 'Speech Synthesis Voices',
        supported: voices.length > 0,
        browserInfo,
        error: voices.length === 0 ? 'No voices available' : undefined
      });

      // Test language support
      const languages = ['en-US', 'hi-IN', 'pa-IN'];
      for (const lang of languages) {
        const langVoices = voices.filter(voice => voice.lang.startsWith(lang.split('-')[0]));
        this.results.push({
          feature: `Speech Synthesis Language: ${lang}`,
          supported: langVoices.length > 0,
          browserInfo,
          error: langVoices.length === 0 ? `No voices for ${lang}` : undefined
        });
      }

    } catch (error) {
      this.results.push({
        feature: 'Speech Synthesis',
        supported: false,
        browserInfo,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private async testMicrophoneAccess(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.results.push({
          feature: 'Microphone Access',
          supported: false,
          browserInfo,
          error: 'getUserMedia not supported'
        });
        return;
      }

      const startTime = performance.now();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const endTime = performance.now();
      
      // Stop the stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      this.results.push({
        feature: 'Microphone Access',
        supported: true,
        browserInfo,
        performance: endTime - startTime
      });

    } catch (error) {
      this.results.push({
        feature: 'Microphone Access',
        supported: false,
        browserInfo,
        error: error instanceof Error ? error.message : 'Microphone access denied'
      });
    }
  }

  private async testLanguageSupport(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    
    // Test if browser supports different language codes
    const languages = [
      { code: 'en-US', name: 'English (US)' },
      { code: 'en-GB', name: 'English (UK)' },
      { code: 'hi-IN', name: 'Hindi (India)' },
      { code: 'pa-IN', name: 'Punjabi (India)' }
    ];

    for (const lang of languages) {
      try {
        // Test with speech synthesis
        const utterance = new SpeechSynthesisUtterance('Test');
        utterance.lang = lang.code;
        
        this.results.push({
          feature: `Language Support: ${lang.name}`,
          supported: true,
          browserInfo
        });
      } catch (error) {
        this.results.push({
          feature: `Language Support: ${lang.name}`,
          supported: false,
          browserInfo,
          error: `Language ${lang.code} not supported`
        });
      }
    }
  }

  private async testPerformance(): Promise<void> {
    const browserInfo = this.getBrowserInfo();
    
    try {
      // Test speech synthesis performance
      const startTime = performance.now();
      const utterance = new SpeechSynthesisUtterance('Performance test');
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 0; // Silent for testing
      
      speechSynthesis.speak(utterance);
      
      const endTime = performance.now();
      
      this.results.push({
        feature: 'Speech Synthesis Performance',
        supported: true,
        browserInfo,
        performance: endTime - startTime
      });

      // Cancel the utterance
      speechSynthesis.cancel();

    } catch (error) {
      this.results.push({
        feature: 'Speech Synthesis Performance',
        supported: false,
        browserInfo,
        error: error instanceof Error ? error.message : 'Performance test failed'
      });
    }
  }

  public generateReport(): string {
    let report = `Voice Features Test Report\n`;
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Browser: ${this.getBrowserInfo()}\n\n`;

    const supported = this.results.filter(r => r.supported).length;
    const total = this.results.length;
    
    report += `Overall Compatibility: ${supported}/${total} features supported (${Math.round((supported/total) * 100)}%)\n\n`;

    report += `Detailed Results:\n`;
    report += `================\n`;

    for (const result of this.results) {
      report += `\n${result.feature}:\n`;
      report += `  Status: ${result.supported ? '✅ Supported' : '❌ Not Supported'}\n`;
      if (result.error) {
        report += `  Error: ${result.error}\n`;
      }
      if (result.performance) {
        report += `  Performance: ${result.performance.toFixed(2)}ms\n`;
      }
    }

    report += `\nRecommendations:\n`;
    report += `===============\n`;

    const unsupported = this.results.filter(r => !r.supported);
    if (unsupported.length === 0) {
      report += `✅ All voice features are supported! Your browser is fully compatible.\n`;
    } else {
      report += `⚠️  Some features are not supported:\n`;
      for (const result of unsupported) {
        report += `  - ${result.feature}: ${result.error}\n`;
      }
      
      if (unsupported.some(r => r.feature.includes('Speech Recognition'))) {
        report += `\n💡 For speech recognition, try using Chrome, Edge, or Safari.\n`;
      }
      
      if (unsupported.some(r => r.feature.includes('Microphone'))) {
        report += `\n💡 Microphone access may be blocked. Check browser permissions.\n`;
      }
    }

    return report;
  }

  public getResults(): VoiceTestResult[] {
    return this.results;
  }
}

// Export a singleton instance for easy use
export const voiceFeatureTester = new VoiceFeatureTester();