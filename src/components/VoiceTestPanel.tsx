import { useState } from 'react';
import { Play, CheckCircle, XCircle, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { VoiceFeatureTester, VoiceTestResult } from '../utils/testVoiceFeatures';

interface VoiceTestPanelProps {
  onClose?: () => void;
}

const VoiceTestPanel: React.FC<VoiceTestPanelProps> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<VoiceTestResult[]>([]);
  const [report, setReport] = useState<string>('');
  const [tester] = useState(() => new VoiceFeatureTester());

  const runTests = async () => {
    setIsRunning(true);
    setResults([]);
    setReport('');

    try {
      const testResults = await tester.runAllTests();
      setResults(testResults);
      setReport(tester.generateReport());
    } catch (error) {
      console.error('Error running voice tests:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `voice-features-test-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (supported: boolean, error?: string) => {
    if (supported) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    } else if (error) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (supported: boolean) => {
    return supported ? 'text-green-600' : 'text-red-600';
  };

  const supportedCount = results.filter(r => r.supported).length;
  const totalCount = results.length;
  const compatibilityPercentage = totalCount > 0 ? Math.round((supportedCount / totalCount) * 100) : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Voice Features Compatibility Test</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Test Controls */}
          <div className="mb-6">
            <div className="flex gap-4 items-center mb-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Voice Tests
                  </>
                )}
              </button>

              {results.length > 0 && (
                <button
                  onClick={downloadReport}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              )}
            </div>

            {/* Overall Status */}
            {results.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Overall Compatibility</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        compatibilityPercentage >= 80 ? 'bg-green-500' :
                        compatibilityPercentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${compatibilityPercentage}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold">
                    {supportedCount}/{totalCount} ({compatibilityPercentage}%)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
              
              <div className="grid gap-3">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusIcon(result.supported, result.error)}
                          <h4 className="font-medium">{result.feature}</h4>
                          <span className={`text-sm font-semibold ${getStatusColor(result.supported)}`}>
                            {result.supported ? 'Supported' : 'Not Supported'}
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Browser:</strong> {result.browserInfo}</p>
                          
                          {result.error && (
                            <p className="text-red-600">
                              <strong>Error:</strong> {result.error}
                            </p>
                          )}
                          
                          {result.performance && (
                            <p className="text-blue-600">
                              <strong>Performance:</strong> {result.performance.toFixed(2)}ms
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {results.length === 0 && !isRunning && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Test Voice Features Compatibility
              </h3>
              <p className="text-gray-500 mb-4 max-w-md mx-auto">
                Run comprehensive tests to check if your browser and device support all voice features including speech recognition, synthesis, and microphone access.
              </p>
              <div className="text-sm text-gray-400 space-y-1">
                <p>• Tests speech recognition API support</p>
                <p>• Checks speech synthesis capabilities</p>
                <p>• Verifies microphone access permissions</p>
                <p>• Tests multiple language support</p>
                <p>• Measures performance metrics</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isRunning && (
            <div className="text-center py-8">
              <RefreshCw className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Running Voice Tests...
              </h3>
              <p className="text-gray-500">
                Testing browser compatibility and voice features. This may take a few moments.
              </p>
            </div>
          )}

          {/* Recommendations */}
          {results.length > 0 && (
            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
              <div className="text-sm text-blue-700 space-y-1">
                {compatibilityPercentage >= 90 && (
                  <p>✅ Excellent! Your browser supports all voice features.</p>
                )}
                {compatibilityPercentage >= 70 && compatibilityPercentage < 90 && (
                  <p>✅ Good compatibility. Most voice features are supported.</p>
                )}
                {compatibilityPercentage < 70 && (
                  <>
                    <p>⚠️ Limited compatibility. Consider using Chrome, Edge, or Safari for better voice support.</p>
                    {results.some(r => !r.supported && r.feature.includes('Microphone')) && (
                      <p>🎤 Microphone access may be blocked. Check browser permissions.</p>
                    )}
                  </>
                )}
                <p>💡 For best results, use HTTPS and ensure microphone permissions are granted.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceTestPanel;