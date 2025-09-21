import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationSelector } from './LocationSelector';

const predictions = [
  { 
    id: 1, 
    crop: 'Wheat', 
    prediction: '45 quintals/hectare', 
    status: 'excellent',
    confidence: 92,
    factors: ['Optimal soil moisture', 'Favorable temperature', 'Good seed quality']
  },
  { 
    id: 2, 
    crop: 'Rice', 
    prediction: '50 quintals/hectare', 
    status: 'good',
    confidence: 85,
    factors: ['Adequate rainfall', 'Proper irrigation', 'Effective pest control']
  },
  { 
    id: 3, 
    crop: 'Cotton', 
    prediction: '25 quintals/hectare', 
    status: 'average',
    confidence: 70,
    factors: ['Moderate pest pressure', 'Variable rainfall', 'Average soil fertility']
  },
  { 
    id: 4, 
    crop: 'Maize', 
    prediction: '30 quintals/hectare', 
    status: 'poor',
    confidence: 60,
    factors: ['Drought conditions', 'Nutrient deficiency', 'Pest infestation']
  },
];

export const Predictions: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<number>(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500';
    if (confidence >= 70) return 'bg-blue-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const selectedPrediction = predictions.find(p => p.id === selectedCrop) || predictions[0];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{t('predictions.title')}</h1>
        <p className="text-gray-600">{t('predictions.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('predictions.selectLocation')}</h2>
            <LocationSelector 
              onLocationSelect={setSelectedLocation} 
              selectedLocation={selectedLocation} 
            />
            
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">{t('predictions.selectCrop')}</h3>
              <div className="space-y-2">
                {predictions.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedCrop === item.id 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => setSelectedCrop(item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{item.crop}</span>
                      <span className={`text-sm ${getStatusColor(item.status)}`}>
                        {t(`predictions.status.${item.status}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">{t('predictions.aiPrediction')}</h2>
              <div className="flex items-center">
                <div className="bg-white bg-opacity-20 p-3 rounded-full mr-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-80">{selectedPrediction.crop} - {selectedLocation || t('predictions.anyLocation')}</p>
                  <p className="text-3xl font-bold">{selectedPrediction.prediction}</p>
                  <p className="text-sm">{t('predictions.predictedYield')}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('predictions.aiConfidence')}</span>
                  <span className="text-sm font-medium">{selectedPrediction.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${getConfidenceColor(selectedPrediction.confidence)}`} 
                    style={{ width: `${selectedPrediction.confidence}%` }}
                  ></div>
                </div>
              </div>

              <h3 className="font-semibold text-gray-700 mb-3">{t('predictions.keyFactors')}</h3>
              <ul className="space-y-2 mb-6">
                {selectedPrediction.factors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="font-medium text-blue-700">{t('predictions.aiInsight')}</p>
                    <p className="text-sm text-blue-600 mt-1">
                      {selectedPrediction.status === 'excellent' || selectedPrediction.status === 'good' 
                        ? t('predictions.positiveInsight') 
                        : t('predictions.improvementInsight')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">{t('predictions.historicalData')}</h2>
            <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
              <p className="text-gray-500">{t('predictions.chartPlaceholder')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};