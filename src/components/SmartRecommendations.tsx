import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationSelector } from './LocationSelector';
import { getLocationBasedRecommendations, getAvailableCategories, getAvailableEcosystems, getDistrictFromLocation, LocationRecommendation } from '../data/locationRecommendations';

// Odisha-specific agricultural recommendations
const recommendationsData = [
  {
    id: '1',
    title: 'Kharif Rice Water Management - Odisha',
    description: 'Optimal water management for rice cultivation during Odisha monsoon season.',
    priority: 'high',
    category: 'water',
    season: 'kharif',
    ecosystem: 'irrigated',
    actionItems: [
      'Maintain 2-5 cm water level during vegetative growth stage',
      'Apply intermittent irrigation during tillering (15-20 days after transplanting)',
      'Ensure continuous flooding during reproductive phase (panicle initiation to grain filling)',
      'Drain fields 10-15 days before harvest for easy harvesting'
    ]
  },
  {
    id: '2',
    title: 'Brown Planthopper Management',
    description: 'Critical pest management for rice crops against brown planthopper in Odisha.',
    priority: 'high',
    category: 'pest',
    season: 'kharif',
    ecosystem: 'all',
    actionItems: [
      'Monitor for brown planthopper nymphs and adults weekly during vegetative stage',
      'Use resistant varieties like Utkal Prabha, Khandagiri, or Pooja',
      'Apply Flonicamide or Pymetrozine when population exceeds economic threshold',
      'Maintain proper plant spacing to reduce humidity and pest buildup',
      'Use light traps for early detection and monitoring'
    ]
  },
  {
    id: '3',
    title: 'Rice Blast Disease Control',
    description: 'Prevent and manage blast disease in Odisha rice fields.',
    priority: 'high',
    category: 'pest',
    season: 'kharif',
    ecosystem: 'upland',
    actionItems: [
      'Use blast-resistant varieties like Improved Lalat, Naveen, or Khandagiri',
      'Apply balanced fertilization - avoid excessive nitrogen',
      'Spray Tricyclazole or Carbendazim at early blast symptoms',
      'Ensure proper field drainage to reduce humidity',
      'Remove infected plant debris after harvest'
    ]
  },
  {
    id: '4',
    title: 'Rice Fallow Pulse Cultivation',
    description: 'Maximize land use efficiency with pulse crops after rice harvest in Odisha.',
    priority: 'medium',
    category: 'crop',
    season: 'rabi',
    ecosystem: 'lowland',
    actionItems: [
      'Sow short-duration pulses like lentil, chickpea, or field pea in December',
      'Use residual moisture from rice fields for germination',
      'Apply phosphorus-rich fertilizers (20-25 kg P2O5/ha)',
      'Practice zero-tillage or minimum tillage to conserve moisture',
      'Harvest by March-April before summer heat'
    ]
  },
  {
    id: '5',
    title: 'Cyclone and Flood Preparedness',
    description: 'Protect crops from cyclones and floods common in coastal Odisha.',
    priority: 'high',
    category: 'weather',
    season: 'kharif',
    ecosystem: 'coastal',
    actionItems: [
      'Choose short-duration rice varieties (90-110 days) to avoid cyclone season',
      'Create drainage channels around fields for quick water removal',
      'Store seeds and fertilizers in elevated, waterproof storage',
      'Harvest mature crops immediately when cyclone warning is issued',
      'Use submergence-tolerant varieties like Swarna-Sub1 in flood-prone areas'
    ]
  },
  {
    id: '6',
    title: 'Soil Acidity Management',
    description: 'Address soil acidity issues common in Odisha lateritic soils.',
    priority: 'medium',
    category: 'soil',
    season: 'all',
    ecosystem: 'upland',
    actionItems: [
      'Apply lime at 1-2 tons per hectare to raise soil pH to 6.0-6.5',
      'Use organic matter like compost or farmyard manure (5-10 tons/ha)',
      'Grow acid-tolerant crops like finger millet or niger in severely acidic soils',
      'Apply phosphorus fertilizers to improve nutrient availability',
      'Test soil pH annually and adjust lime application accordingly'
    ]
  },
  {
    id: '7',
    title: 'Integrated Nutrient Management',
    description: 'Balanced fertilization approach for sustainable rice production in Odisha.',
    priority: 'medium',
    category: 'soil',
    season: 'kharif',
    ecosystem: 'all',
    actionItems: [
      'Apply NPK in ratio 80:40:40 kg/ha for medium-duration rice varieties',
      'Use 25% nitrogen through organic sources (FYM, compost, green manure)',
      'Apply zinc sulfate (25 kg/ha) in zinc-deficient soils',
      'Use neem-coated urea to reduce nitrogen losses',
      'Apply potassium in split doses during tillering and panicle initiation'
    ]
  },
  {
    id: '8',
    title: 'Direct Seeded Rice (DSR) Technology',
    description: 'Water-saving rice cultivation technique suitable for Odisha conditions.',
    priority: 'medium',
    category: 'crop',
    season: 'kharif',
    ecosystem: 'irrigated',
    actionItems: [
      'Use short-duration, lodging-resistant varieties like MTU-1010 or Sahbhagi Dhan',
      'Prepare fine seedbed with proper leveling for uniform germination',
      'Apply pre-emergence herbicide (Pendimethalin) within 3 days of sowing',
      'Maintain alternate wetting and drying for water conservation',
      'Monitor for weeds closely and apply post-emergence herbicides as needed'
    ]
  }
];

export const SmartRecommendations: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [selectedEcosystem, setSelectedEcosystem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get current season based on month
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 6 && month <= 10) return 'kharif'; // June-October
    if (month >= 11 || month <= 3) return 'rabi'; // November-March
    return 'summer'; // April-May
  };

  // Handle location selection from LocationSelector
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    // Extract district from location string using the utility function
    if (location) {
      const district = getDistrictFromLocation(location);
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null);
    }
  };

  // Get location-based recommendations - only show if both district and locality are selected
  const getRecommendations = (): LocationRecommendation[] => {
    // Check if location contains both district and locality (comma-separated)
    if (!selectedDistrict || !selectedLocation || !selectedLocation.includes(',')) {
      return []; // Return empty array if incomplete location selected
    }
    
    const currentSeason = getCurrentSeason();
    const seasonToUse = selectedSeason || currentSeason;
    
    return getLocationBasedRecommendations(selectedDistrict, selectedLocation || '', seasonToUse);
  };

  // Get available filter options based on current location
  const getFilterOptions = () => {
    // Only show filter options if complete location is selected
    if (!selectedDistrict || !selectedLocation || !selectedLocation.includes(',')) {
      return { categories: [], ecosystems: [] };
    }
    
    const currentSeason = getCurrentSeason();
    const seasonToUse = selectedSeason || currentSeason;
    
    return {
      categories: getAvailableCategories(selectedDistrict, seasonToUse),
      ecosystems: getAvailableEcosystems(selectedDistrict, seasonToUse)
    };
  };

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

  const filteredRecommendations = getRecommendations().filter(rec => {
    // Category filter
    if (selectedCategory && rec.category !== selectedCategory) return false;
    
    // Season filter (already handled in getRecommendations, but keeping for additional filtering)
    if (selectedSeason && rec.season !== selectedSeason && rec.season !== 'all') return false;
    
    // Ecosystem filter
    if (selectedEcosystem && rec.ecosystem !== selectedEcosystem && rec.ecosystem !== 'all') return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return rec.title.toLowerCase().includes(query) || 
             rec.description.toLowerCase().includes(query) ||
             rec.actionItems.some(item => item.toLowerCase().includes(query));
    }
    
    return true;
  });

  // Sort recommendations by priority and current season relevance
  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const currentSeason = getCurrentSeason();
    const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
    
    // Prioritize current season recommendations
    const aSeasonMatch = a.season === currentSeason || a.season === 'all';
    const bSeasonMatch = b.season === currentSeason || b.season === 'all';
    
    if (aSeasonMatch && !bSeasonMatch) return -1;
    if (!aSeasonMatch && bSeasonMatch) return 1;
    
    // Then sort by priority
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t('smartRecommendations.title')}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              {t('smartRecommendations.subtitle')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3">
          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.search')}</h2>
            <div className="relative">
              <input
                type="text"
                placeholder={t('smartRecommendations.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          {/* Location Selector */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.selectLocation')}</h2>
            <LocationSelector 
              onLocationSelect={handleLocationSelect} 
            />
          </div>

          {/* Season Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.filterBySeason')}</h2>
            <div className="space-y-2">
              <button 
                className={`w-full p-3 rounded-lg text-left flex items-center ${selectedSeason === null ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setSelectedSeason(null)}
              >
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span>{t('smartRecommendations.allSeasons')} <span className="text-sm text-gray-500">({t(`smartRecommendations.currentSeason.${getCurrentSeason()}`)})</span></span>
              </button>
              
              {['kharif', 'rabi', 'summer'].map(season => (
                <button 
                  key={season}
                  className={`w-full p-3 rounded-lg text-left flex items-center ${selectedSeason === season ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setSelectedSeason(season)}
                >
                  <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{t(`smartRecommendations.seasons.${season}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ecosystem Filter */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.filterByEcosystem')}</h2>
            <div className="space-y-2">
              <button 
                className={`w-full p-3 rounded-lg text-left flex items-center ${selectedEcosystem === null ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setSelectedEcosystem(null)}
              >
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span>{t('smartRecommendations.allEcosystems')}</span>
              </button>
              
              {getFilterOptions().ecosystems.map(ecosystem => (
                <button 
                  key={ecosystem}
                  className={`w-full p-3 rounded-lg text-left flex items-center ${selectedEcosystem === ecosystem ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                  onClick={() => setSelectedEcosystem(ecosystem)}
                >
                  <svg className="w-6 h-6 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>{t(`smartRecommendations.ecosystems.${ecosystem}`)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">{t('smartRecommendations.filterByCategory')}</h2>
            <div className="space-y-2">
              <button 
                className={`w-full p-3 rounded-lg text-left flex items-center ${selectedCategory === null ? 'bg-green-50 border border-green-200' : 'bg-gray-50 hover:bg-gray-100'}`}
                onClick={() => setSelectedCategory(null)}
              >
                <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                </svg>
                <span>{t('smartRecommendations.allCategories')}</span>
              </button>
              
              {getFilterOptions().categories.map(category => (
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-green-700">{t('smartRecommendations.personalizedRecommendations')}</h2>
              <span className="text-sm text-gray-500">
                {sortedRecommendations.length} {t('smartRecommendations.itemsFound')}
              </span>
            </div>
            
            {sortedRecommendations.length === 0 ? (
              <div className="text-center py-12">
                {!selectedDistrict || !selectedLocation || !selectedLocation.includes(',') ? (
                  // Empty state when complete location is not selected
                  <>
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('smartRecommendations.selectLocationFirst')}</h3>
                    <p className="text-gray-500">{t('smartRecommendations.selectLocationDescription')}</p>
                  </>
                ) : (
                  // Empty state when complete location is selected but no recommendations found
                  <>
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.562M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{t('smartRecommendations.noRecommendations')}</h3>
                    <p className="text-gray-500">{t('smartRecommendations.tryDifferentFilters')}</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {sortedRecommendations.map((recommendation, index) => (
                  <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex items-center flex-1">
                        {getCategoryIcon(recommendation.category)}
                        <div className="ml-3 flex-1">
                          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 leading-tight">{recommendation.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <span className="text-xs sm:text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {t(`smartRecommendations.seasons.${recommendation.season}`)}
                            </span>
                            <span className="text-xs sm:text-sm text-teal-600 bg-teal-50 px-2 py-1 rounded">
                              {t(`smartRecommendations.ecosystems.${recommendation.ecosystem}`)}
                            </span>
                            <span className={`text-xs sm:text-sm px-2 py-1 rounded ${
                              recommendation.priority === 'high' ? 'text-red-600 bg-red-50' :
                              recommendation.priority === 'medium' ? 'text-yellow-600 bg-yellow-50' :
                              'text-green-600 bg-green-50'
                            }`}>
                              {t(`smartRecommendations.priority.${recommendation.priority}`)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed">{recommendation.description}</p>
                    
                    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">{t('smartRecommendations.actionItems')}</h4>
                      <ul className="space-y-2">
                        {recommendation.actionItems.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            <span className="text-gray-700 text-sm sm:text-base leading-relaxed">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 sm:p-6 mt-6">
            <div className="flex">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="font-semibold text-blue-800 mb-1 text-sm sm:text-base">{t('smartRecommendations.howItWorks')}</h3>
                <p className="text-xs sm:text-sm text-blue-700">
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