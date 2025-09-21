import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationSelector } from './LocationSelector';

// Punjab-specific agricultural recommendations
const recommendationsData = [
  {
    id: '1',
    title: 'Winter Wheat Irrigation - Punjab',
    description: 'Optimal irrigation schedule for wheat crops during Punjab winter season.',
    priority: 'high',
    category: 'water',
    actionItems: [
      'Apply irrigation at crown root initiation stage (20-25 days after sowing)',
      'Second irrigation at tillering stage (40-45 days after sowing)',
      'Third irrigation at jointing stage (60-65 days after sowing)'
    ]
  },
  {
    id: '2',
    title: 'Pink Bollworm Management in Cotton',
    description: 'Critical pest management for cotton crops in Punjab region.',
    priority: 'high',
    category: 'pest',
    actionItems: [
      'Monitor for pink bollworm larvae in cotton bolls',
      'Use pheromone traps for early detection',
      'Apply Bt cotton varieties for natural resistance'
    ]
  },
  {
    id: '3',
    title: 'Soil Salinity Management',
    description: 'Address soil salinity issues common in Punjab agricultural areas.',
    priority: 'medium',
    category: 'soil',
    actionItems: [
      'Apply gypsum at 2.5 tons per hectare for saline soils',
      'Use salt-tolerant crop varieties like barley or mustard',
      'Improve drainage to prevent waterlogging'
    ]
  },
  {
    id: '4',
    title: 'Rice-Wheat Crop Rotation',
    description: 'Sustainable crop rotation system for Punjab farmers.',
    priority: 'medium',
    category: 'crop',
    actionItems: [
      'Follow rice (Kharif) with wheat (Rabi) rotation',
      'Include green manure crops like dhaincha between seasons',
      'Consider maize-wheat rotation to break pest cycles'
    ]
  },
  {
    id: '5',
    title: 'Fog and Cold Wave Protection',
    description: 'Protect crops from Punjab winter weather conditions.',
    priority: 'high',
    category: 'weather',
    actionItems: [
      'Cover sensitive crops during cold wave periods',
      'Avoid irrigation during foggy conditions',
      'Use anti-transpirants to reduce moisture loss'
    ]
  },
  {
    id: '6',
    title: 'Basmati Rice Quality Enhancement',
    description: 'Improve quality and yield of Basmati rice in Punjab.',
    priority: 'medium',
    category: 'crop',
    actionItems: [
      'Maintain proper plant spacing (20x15 cm) for Basmati',
      'Apply balanced NPK fertilizer (120:60:40 kg/ha)',
      'Harvest at 80-85% grain maturity for best quality'
    ]
  }
];

export const SmartRecommendations: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'water':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
          </svg>
        );
      case 'pest':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        );
      case 'soil':
        return (
          <svg className="w-6 h-6 text-brown-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        );
      case 'crop':
        return (
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 'weather':
        return (
          <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
    }
  };

  const filteredRecommendations = selectedCategory 
    ? recommendationsData.filter(rec => rec.category === selectedCategory)
    : recommendationsData;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{t('smartRecommendations.title')}</h1>
        <p className="text-gray-600">{t('smartRecommendations.subtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.selectLocation')}</h2>
            <LocationSelector 
              onLocationSelect={setSelectedLocation} 
              selectedLocation={selectedLocation} 
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.filterByCategory')}</h2>
            <div className="space-y-2">
              <button 
                className={`w-full p-3 rounded-lg text-left flex items-center ${selectedCategory === null ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span>{t('smartRecommendations.allCategories')}</span>
              </button>
              
              {['water', 'pest', 'soil', 'crop'].map(category => (
                <button 
                  key={category}
                  className={`w-full p-3 rounded-lg text-left flex items-center ${selectedCategory === category ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryIcon(category)}
                  <span className="ml-2">{t(`smartRecommendations.categories.${category}`)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-700">{t('smartRecommendations.personalizedRecommendations')}</h2>
              <span className="text-sm text-gray-500">{filteredRecommendations.length} {t('smartRecommendations.itemsFound')}</span>
            </div>

            {filteredRecommendations.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="text-lg font-medium text-gray-700 mb-1">{t('smartRecommendations.noRecommendations')}</h3>
                <p className="text-gray-500">{t('smartRecommendations.tryDifferentFilters')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecommendations.map(recommendation => (
                  <div key={recommendation.id} className="border rounded-lg overflow-hidden">
                    <div className="flex items-center p-4 border-b">
                      {getCategoryIcon(recommendation.category)}
                      <div className="ml-3 flex-1">
                        <h3 className="font-semibold">{recommendation.title}</h3>
                        <p className="text-sm text-gray-600">{recommendation.description}</p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ml-2 ${getPriorityColor(recommendation.priority)}`}>
                        {t(`smartRecommendations.priority.${recommendation.priority}`)}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium text-sm text-gray-700 mb-2">{t('smartRecommendations.actionItems')}</h4>
                      <ul className="space-y-2">
                        {recommendation.actionItems.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <div className="flex">
              <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1">{t('smartRecommendations.howItWorks')}</h3>
                <p className="text-sm text-blue-700">
                  {t('smartRecommendations.aiExplanation')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};