import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LocationSelector } from './LocationSelector';
import { getSoilDataByDistrict, getSoilDataByCoordinates, SoilData } from '../services/soilService';

export const SoilHealth: React.FC = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [soilData, setSoilData] = useState<SoilData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);
  const [locationInputMode, setLocationInputMode] = useState<'dropdown' | 'coordinates' | 'current'>('dropdown');
  const [manualLat, setManualLat] = useState<string>('');
  const [manualLon, setManualLon] = useState<string>('');

  const handleLocationSelect = async (location: string | null) => {
    setSelectedLocation(location);
    if (location) {
      setLoading(true);
      setError('');
      try {
        const data = await getSoilDataByDistrict(location);
        setSoilData(data);
      } catch (err) {
        setError('Failed to fetch soil data. Please try again.');
        setSoilData(null);
      } finally {
        setLoading(false);
      }
    } else {
      setSoilData(null);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    setError('');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        
        try {
          const data = await getSoilDataByCoordinates(latitude, longitude);
          setSoilData(data);
          setSelectedLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        } catch (err) {
          setError('Failed to fetch soil data for your location.');
          setSoilData(null);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location permissions.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const handleManualCoordinates = async () => {
    const lat = parseFloat(manualLat);
    const lon = parseFloat(manualLon);
    
    if (isNaN(lat) || isNaN(lon)) {
      setError('Please enter valid latitude and longitude values.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90 degrees.');
      return;
    }

    if (lon < -180 || lon > 180) {
      setError('Longitude must be between -180 and 180 degrees.');
      return;
    }

    setLoading(true);
    setError('');
    setCoordinates({ lat, lon });
    
    try {
      const data = await getSoilDataByCoordinates(lat, lon);
      setSoilData(data);
      setSelectedLocation(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    } catch (err) {
      setError('Failed to fetch soil data for the specified coordinates.');
      setSoilData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('soilHealth.title', 'Soil Health Analysis')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('soilHealth.subtitle', 'Get detailed soil analysis for your location')}
        </p>
      </div>

      {/* Location Input Mode Selector */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Choose Location Method</h2>
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setLocationInputMode('dropdown')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              locationInputMode === 'dropdown'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Select District
          </button>
          <button
            onClick={() => setLocationInputMode('current')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              locationInputMode === 'current'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Use Current Location
          </button>
          <button
            onClick={() => setLocationInputMode('coordinates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              locationInputMode === 'coordinates'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Enter Coordinates
          </button>
        </div>

        {/* District Dropdown */}
        {locationInputMode === 'dropdown' && (
          <div>
            <LocationSelector onLocationSelect={handleLocationSelect} />
          </div>
        )}

        {/* Current Location */}
        {locationInputMode === 'current' && (
          <div className="text-center">
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {loading ? 'Getting Location...' : 'Get My Location'}
            </button>
            {coordinates && (
              <p className="mt-2 text-sm text-gray-600">
                Current coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lon.toFixed(4)}
              </p>
            )}
          </div>
        )}

        {/* Manual Coordinates */}
        {locationInputMode === 'coordinates' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude (-90 to 90)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLat}
                  onChange={(e) => setManualLat(e.target.value)}
                  placeholder="e.g., 20.2961"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude (-180 to 180)
                </label>
                <input
                  type="number"
                  step="any"
                  value={manualLon}
                  onChange={(e) => setManualLon(e.target.value)}
                  placeholder="e.g., 85.8245"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleManualCoordinates}
              disabled={loading || !manualLat || !manualLon}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching Data...' : 'Get Soil Data'}
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2 text-gray-600">Loading soil data...</p>
        </div>
      )}

      {!selectedLocation && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            {t('soilHealth.selectLocation', 'Select a location to view soil analysis')}
          </h3>
          <p className="text-gray-600">
            Choose from district dropdown, use your current location, or enter specific coordinates
          </p>
        </div>
      )}

      {soilData && selectedLocation && !loading && (
        <SoilHealthDetails data={soilData} location={selectedLocation} />
      )}
    </div>
  );
};

export default SoilHealth;

interface SoilHealthDetailsProps {
  data: SoilData;
  location: string;
}

const SoilHealthDetails: React.FC<SoilHealthDetailsProps> = ({ data, location }) => {
  const { t } = useTranslation();
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showTestModal, setShowTestModal] = useState<boolean>(false);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // Calculate overall health score based on soil parameters
  const calculateHealthScore = (soilData: SoilData): number => {
    let score = 0;
    let factors = 0;

    // pH score (optimal range: 6.0-7.5)
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      score += 25;
    } else if (soilData.ph >= 5.5 && soilData.ph < 6.0 || soilData.ph > 7.5 && soilData.ph <= 8.0) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    // Nitrogen score (optimal: 40-60 kg/ha)
    const nitrogen = parseFloat(data.nitrogen?.toString() || '0');
    if (nitrogen >= 40 && nitrogen <= 60) {
      score += 25;
    } else if (nitrogen >= 30 && nitrogen < 40 || nitrogen > 60 && nitrogen <= 80) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    // Phosphorus score (optimal: 20-40 kg/ha)
    const phosphorus = parseFloat(data.phosphorus?.toString() || '0');
    if (phosphorus >= 20 && phosphorus <= 40) {
      score += 25;
    } else if (phosphorus >= 15 && phosphorus < 20 || phosphorus > 40 && phosphorus <= 50) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    // Organic matter score (optimal: 2.5-4.0%)
    const organicMatter = parseFloat(data.organicMatter?.toString() || '0');
    if (organicMatter >= 2.5 && organicMatter <= 4.0) {
      score += 25;
    } else if (organicMatter >= 2.0 && organicMatter < 2.5 || organicMatter > 4.0 && organicMatter <= 5.0) {
      score += 15;
    } else {
      score += 5;
    }
    factors++;

    return Math.round(score / factors);
  };

  const healthScore = calculateHealthScore(data);

  // Button handlers
  const generateReport = () => {
    const reportContent = `
SOIL HEALTH ANALYSIS REPORT
===========================

Location: ${location}
Analysis Date: ${new Date().toLocaleDateString()}
Overall Health Score: ${healthScore}/100

SOIL PROPERTIES:
- pH Level: ${data.ph}
- Nitrogen: ${data.nitrogen} kg/ha
- Phosphorus: ${data.phosphorus} kg/ha
- Potassium: ${data.potassium} kg/ha
- Organic Matter: ${data.organicMatter}%
- Moisture: ${data.moisture}%
- Temperature: ${data.temperature}°C

RECOMMENDATIONS:
${data.recommendations?.map(rec => `- ${rec}`).join('\n') || 'No specific recommendations available.'}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soil-health-report-${location.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const scheduleTest = () => {
    alert(`Test scheduling for ${location} - Feature coming soon! You will be able to schedule soil tests with local agricultural labs.`);
  };

  const setReminders = () => {
    alert(`Reminder system for ${location} - Feature coming soon! You will be able to set reminders for fertilizer application, soil testing, and seasonal treatments.`);
  };

  const compareFields = () => {
    alert(`Field comparison for ${location} - Feature coming soon! You will be able to compare soil data across different locations and time periods.`);
  };

  const getNutrientColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'High': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getHealthScoreColor = (value: number, minOptimal: number = 6.0, maxOptimal: number = 7.5) => {
    if (value >= minOptimal && value <= maxOptimal) {
      return 'bg-green-100 text-green-800';
    } else if ((value >= minOptimal - 0.5 && value < minOptimal) || (value > maxOptimal && value <= maxOptimal + 0.5)) {
      return 'bg-yellow-100 text-yellow-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t('soilHealth.analysisResults', 'Soil Analysis Results')}
        </h2>
        <p className="text-gray-600">Location: {location}</p>
        <p className="text-sm text-gray-500">Analysis Date: {new Date().toLocaleDateString()}</p>
      </div>

      {/* Overall Health Score */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Overall Soil Health Score</h3>
            <p className="text-green-100">Based on comprehensive analysis</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{healthScore}</div>
            <div className="text-green-100">out of 100</div>
          </div>
        </div>
        <div className="mt-4 bg-green-400 rounded-full h-3">
          <div 
            className="bg-white rounded-full h-3 transition-all duration-500"
            style={{ width: `${healthScore}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button 
            onClick={generateReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            📋 Report
          </button>
          <button 
            onClick={scheduleTest}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            🧪 Test
          </button>
          <button 
            onClick={setReminders}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
          >
            📱 Remind
          </button>
          <button 
            onClick={compareFields}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            📊 Compare
          </button>
          <button
            onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            🔬 {showAdvancedAnalysis ? 'Hide' : 'Show'} Advanced
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Advanced Analysis Section */}
        {showAdvancedAnalysis && soilData?.advancedAnalysis && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🔬 Advanced Soil Analysis
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Fertility Index */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-gray-700 mb-2">Fertility Index</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${soilData.advancedAnalysis.fertilityIndex}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {soilData.advancedAnalysis.fertilityIndex.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Crop Yield Potential */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-gray-700 mb-2">Crop Yield Potential</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${soilData.advancedAnalysis.cropYieldPotential}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {soilData.advancedAnalysis.cropYieldPotential.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Water Retention Capacity */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-gray-700 mb-2">Water Retention</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${soilData.advancedAnalysis.waterRetentionCapacity}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {soilData.advancedAnalysis.waterRetentionCapacity.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Nutrient Availability Index */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-gray-700 mb-2">Nutrient Availability</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${soilData.advancedAnalysis.nutrientAvailabilityIndex}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {soilData.advancedAnalysis.nutrientAvailabilityIndex.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Soil Quality Grade */}
              <div className="bg-white p-4 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-gray-700 mb-2">Quality Grade</h4>
                <div className="text-center">
                  <span className={`text-2xl font-bold px-3 py-1 rounded-full ${
                    soilData.advancedAnalysis.soilQualityGrade === 'Excellent' ? 'bg-green-100 text-green-800' :
                    soilData.advancedAnalysis.soilQualityGrade === 'Good' ? 'bg-blue-100 text-blue-800' :
                    soilData.advancedAnalysis.soilQualityGrade === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {soilData.advancedAnalysis.soilQualityGrade}
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            {soilData.advancedAnalysis.riskAssessment && soilData.advancedAnalysis.riskAssessment.length > 0 && (
              <div className="bg-white p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                  ⚠️ Risk Assessment
                </h4>
                <ul className="space-y-2">
                  {soilData.advancedAnalysis.riskAssessment.map((risk: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-red-600">
                      <span className="text-red-500 mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Soil Properties */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('soilHealth.soilProperties', 'Soil Properties')}
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
               <span className="font-medium">pH Level</span>
               <span className={`px-2 py-1 rounded text-sm ${getHealthScoreColor(data.ph, 6.0, 7.5)}`}>
                 {data.ph}
               </span>
             </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Temperature</span>
              <span className="text-gray-700">{data.temperature}°C</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Moisture</span>
              <span className="text-gray-700">{data.moisture}%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
               <span className="font-medium">Organic Matter</span>
               <span className={`px-2 py-1 rounded text-sm ${getHealthScoreColor(parseFloat(data.organicMatter?.toString() || '0'), 2.5, 4.0)}`}>
                 {data.organicMatter}%
               </span>
             </div>
          </div>
        </div>

        {/* Nutrient Levels */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('soilHealth.nutrientLevels', 'Nutrient Levels')}
          </h3>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Nitrogen (N)</span>
                <span className={`px-2 py-1 rounded text-sm ${getNutrientColor(data.nitrogen?.toString() || '0')}`}>
                  {data.nitrogen} kg/ha
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((parseFloat(data.nitrogen?.toString() || '0') / 80) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Phosphorus (P)</span>
                <span className={`px-2 py-1 rounded text-sm ${getNutrientColor(data.phosphorus?.toString() || '0')}`}>
                  {data.phosphorus} kg/ha
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((parseFloat(data.phosphorus?.toString() || '0') / 50) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Potassium (K)</span>
                <span className={`px-2 py-1 rounded text-sm ${getNutrientColor(data.potassium?.toString() || '0')}`}>
                  {data.potassium} kg/ha
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((parseFloat(data.potassium?.toString() || '0') / 400) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations && data.recommendations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('soilHealth.recommendations', 'Recommendations')}
          </h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <ul className="space-y-2">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="text-blue-800">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};