import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationSelector } from './LocationSelector';

const predictions = [
  { 
    id: 1, 
    crop: 'Rice (Paddy)', 
    prediction: '55 quintals/hectare', 
    status: 'excellent',
    confidence: 94,
    factors: ['Optimal monsoon rainfall', 'Rich alluvial soil', 'Traditional Kharif cultivation', 'Effective water management']
  },
  { 
    id: 2, 
    crop: 'Sugarcane', 
    prediction: '650 quintals/hectare', 
    status: 'good',
    confidence: 88,
    factors: ['Adequate irrigation from Mahanadi', 'Fertile deltaic soil', 'Favorable coastal climate', 'Good variety selection']
  },
  { 
    id: 3, 
    crop: 'Turmeric', 
    prediction: '28 quintals/hectare', 
    status: 'excellent',
    confidence: 91,
    factors: ['Ideal red laterite soil', 'Optimal rainfall pattern', 'Traditional cultivation expertise', 'Organic farming practices']
  },
  { 
    id: 4, 
    crop: 'Groundnut', 
    prediction: '22 quintals/hectare', 
    status: 'good',
    confidence: 82,
    factors: ['Well-drained sandy loam soil', 'Suitable Rabi season conditions', 'Improved seed varieties', 'Integrated pest management']
  },
  { 
    id: 5, 
    crop: 'Coconut', 
    prediction: '12000 nuts/hectare', 
    status: 'excellent',
    confidence: 89,
    factors: ['Coastal saline-resistant varieties', 'High humidity levels', 'Adequate rainfall', 'Traditional coastal cultivation']
  },
  { 
    id: 6, 
    crop: 'Jute', 
    prediction: '25 quintals/hectare', 
    status: 'average',
    confidence: 75,
    factors: ['Moderate rainfall this season', 'Suitable alluvial soil', 'Traditional fiber crop expertise', 'Market demand stability']
  },
];

export const Predictions: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<number>(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-600';
      case 'good': return 'text-blue-600';
      case 'average': return 'text-amber-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-emerald-50 border-emerald-200';
      case 'good': return 'bg-blue-50 border-blue-200';
      case 'average': return 'bg-amber-50 border-amber-200';
      case 'poor': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-emerald-500';
    if (confidence >= 80) return 'bg-blue-500';
    if (confidence >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const selectedPrediction = predictions.find(p => p.id === selectedCrop) || predictions[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
            {t('predictions.title')}
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('predictions.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Location Selector Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{t('predictions.selectLocation')}</h2>
              </div>
              <LocationSelector 
                onLocationSelect={setSelectedLocation} 
                selectedLocation={selectedLocation} 
              />
            </div>
            
            {/* Crop Selection Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{t('predictions.selectCrop')}</h3>
              </div>
              <div className="space-y-3">
                {predictions.map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                      selectedCrop === item.id 
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md transform scale-[1.02]' 
                        : 'bg-gray-50/50 hover:bg-gray-100/70 border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCrop(item.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{item.crop}</span>
                      <span className={`text-sm px-2 py-1 rounded-full border ${getStatusBgColor(item.status)} ${getStatusColor(item.status)}`}>
                        {t(`predictions.status.${item.status}`)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            {/* AI Prediction Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 p-6 sm:p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-0">{t('predictions.aiPrediction')}</h2>
                    <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                      <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium">Live AI Analysis</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl mr-0 sm:mr-6 mb-4 sm:mb-0">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm opacity-90 mb-1">{selectedPrediction.crop} - {selectedLocation || t('predictions.anyLocation')}</p>
                      <p className="text-3xl sm:text-4xl font-bold mb-1">{selectedPrediction.prediction}</p>
                      <p className="text-sm opacity-90">{t('predictions.predictedYield')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                {/* Confidence Meter */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-gray-700 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                      {t('predictions.aiConfidence')}
                    </span>
                    <span className="text-lg font-bold text-gray-800">{selectedPrediction.confidence}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ease-out ${getConfidenceColor(selectedPrediction.confidence)}`} 
                      style={{ width: `${selectedPrediction.confidence}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key Factors */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {t('predictions.keyFactors')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPrediction.factors.map((factor, index) => (
                      <div key={index} className="flex items-start p-3 bg-green-50 rounded-lg border border-green-100">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        <span className="text-sm text-gray-700 leading-relaxed">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-blue-800 mb-2">{t('predictions.aiInsight')}</p>
                      <p className="text-sm text-blue-700 leading-relaxed">
                        {selectedPrediction.status === 'excellent' || selectedPrediction.status === 'good' 
                          ? t('predictions.positiveInsight') 
                          : t('predictions.improvementInsight')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Data Chart */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  {t('predictions.historicalData')}
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">1Y</button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">3Y</button>
                  <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">5Y</button>
                </div>
              </div>
              <div className="h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                <div className="text-center">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  <p className="text-gray-500 font-medium">{t('predictions.chartPlaceholder')}</p>
                  <p className="text-gray-400 text-sm mt-1">Interactive chart coming soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};