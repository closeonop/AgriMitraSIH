import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Geolocation API interface
interface GeolocationData {
  latitude: number;
  longitude: number;
  city?: string;
  district?: string;
  state?: string;
}

// Function to get current location using browser geolocation API
const getCurrentLocation = (): Promise<GeolocationData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding to get location details
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY&language=en&pretty=1`
          );
          
          if (!response.ok) {
            // Fallback to basic coordinates if API fails
            resolve({ latitude, longitude });
            return;
          }
          
          const data = await response.json();
          const result = data.results[0];
          
          if (result) {
            const components = result.components;
            resolve({
              latitude,
              longitude,
              city: components.city || components.town || components.village,
              district: components.state_district || components.county,
              state: components.state
            });
          } else {
            resolve({ latitude, longitude });
          }
        } catch (error) {
          // Fallback to basic coordinates if API fails
          resolve({ latitude, longitude });
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

// Odisha districts with their towns/localities
const odishaDistrictsWithTowns = {
  'Angul': ['Angul', 'Talcher', 'Pallahara', 'Banarpal', 'Kaniha', 'Athamallik'],
  'Balangir': ['Balangir', 'Titilagarh', 'Patnagarh', 'Saintala', 'Loisinga', 'Belpada'],
  'Balasore': ['Balasore', 'Jaleswar', 'Basta', 'Nilagiri', 'Soro', 'Remuna'],
  'Bargarh': ['Bargarh', 'Padampur', 'Bijepur', 'Bhatli', 'Ambabhona', 'Attabira'],
  'Bhadrak': ['Bhadrak', 'Chandbali', 'Tihidi', 'Basudevpur', 'Dhamnagar', 'Bonth'],
  'Boudh': ['Boudh', 'Kantamal', 'Harbhanga', 'Manamunda', 'Purunakatak'],
  'Cuttack': ['Cuttack', 'Choudwar', 'Banki', 'Athagarh', 'Baranga', 'Salepur'],
  'Deogarh': ['Deogarh', 'Reamal', 'Barkote', 'Tileibani'],
  'Dhenkanal': ['Dhenkanal', 'Kamakhyanagar', 'Hindol', 'Parjang', 'Kankadahad', 'Odapada'],
  'Gajapati': ['Paralakhemundi', 'Kashinagar', 'Rayagada', 'Gumma', 'Mohana', 'Nuagada'],
  'Ganjam': ['Berhampur', 'Chhatrapur', 'Gopalpur', 'Aska', 'Khallikote', 'Hinjilicut'],
  'Jagatsinghpur': ['Jagatsinghpur', 'Paradeep', 'Tirtol', 'Balikuda', 'Erasama', 'Kujang'],
  'Jajpur': ['Jajpur', 'Vyasanagar', 'Jajpur Road', 'Korei', 'Sukinda', 'Dharmasala'],
  'Jharsuguda': ['Jharsuguda', 'Brajrajnagar', 'Belpahar', 'Lakhanpur', 'Kolabira'],
  'Kalahandi': ['Bhawanipatna', 'Kesinga', 'Junagarh', 'Dharmagarh', 'Lanjigarh', 'Narla'],
  'Kandhamal': ['Phulbani', 'Baliguda', 'G.Udayagiri', 'Raikia', 'Tikabali', 'Daringbadi'],
  'Kendrapara': ['Kendrapara', 'Pattamundai', 'Aul', 'Rajnagar', 'Garadpur', 'Mahakalapada'],
  'Kendujhar': ['Kendujhar', 'Barbil', 'Joda', 'Champua', 'Anandapur', 'Ghatgaon'],
  'Khordha': ['Bhubaneswar', 'Khordha', 'Jatni', 'Balianta', 'Tangi', 'Bolagarh'],
  'Koraput': ['Koraput', 'Jeypore', 'Sunabeda', 'Kotpad', 'Nandapur', 'Semiliguda'],
  'Malkangiri': ['Malkangiri', 'Motu', 'Chitrakonda', 'Korukonda', 'Kalimela', 'Podia'],
  'Mayurbhanj': ['Baripada', 'Rairangpur', 'Karanjia', 'Udala', 'Bangriposi', 'Bisoi'],
  'Nabarangpur': ['Nabarangpur', 'Umerkote', 'Papadahandi', 'Tentulikhunti', 'Dabugaon', 'Nandahandi'],
  'Nayagarh': ['Nayagarh', 'Nuagaon', 'Sarankul', 'Khandapada', 'Daspalla', 'Ranpur'],
  'Nuapada': ['Nuapada', 'Khariar', 'Sinapali', 'Boden', 'Komna'],
  'Puri': ['Puri', 'Konark', 'Pipili', 'Satyabadi', 'Gop', 'Kakatpur'],
  'Rayagada': ['Rayagada', 'Gunupur', 'Padmapur', 'Gudari', 'Kalyansinghpur', 'Bissamcuttack'],
  'Sambalpur': ['Sambalpur', 'Burla', 'Rengali', 'Kuchinda', 'Jamankira', 'Maneswar'],
  'Subarnapur': ['Subarnapur', 'Dunguripali', 'Ullunda', 'Birmaharajpur', 'Tarabha'],
  'Sundargarh': ['Rourkela', 'Sundargarh', 'Rajgangpur', 'Panposh', 'Biramitrapur', 'Bonai']
};

// Get all districts
const odishaDistricts = Object.keys(odishaDistrictsWithTowns);

// Soil type data for Odisha districts
const soilTypeData: Record<string, string> = {
  'Angul': 'Red and laterite soil with sandy loam to clay loam texture',
  'Balangir': 'Red and yellow soil with loam to clay loam texture',
  'Balasore': 'Alluvial and coastal soil with sandy loam texture',
  'Bargarh': 'Red and yellow soil with clay loam texture',
  'Bhadrak': 'Alluvial and deltaic soil with loam texture',
  'Boudh': 'Red and laterite soil with clay loam texture',
  'Cuttack': 'Alluvial and deltaic soil with clay loam texture',
  'Deogarh': 'Red and laterite soil with sandy clay loam texture',
  'Dhenkanal': 'Red and laterite soil with clay loam texture',
  'Gajapati': 'Red and laterite soil with clay texture',
  'Ganjam': 'Red and laterite soil with sandy clay loam texture',
  'Jagatsinghpur': 'Alluvial and coastal soil with clay loam texture',
  'Jajpur': 'Alluvial and laterite soil with loam texture',
  'Jharsuguda': 'Red and yellow soil with clay loam texture',
  'Kalahandi': 'Red and yellow soil with clay loam texture',
  'Kandhamal': 'Red and laterite soil with clay texture',
  'Kendrapara': 'Alluvial and coastal soil with clay loam texture',
  'Kendujhar': 'Red and laterite soil with sandy clay loam texture',
  'Khordha': 'Red and laterite soil with sandy clay loam texture',
  'Koraput': 'Red and laterite soil with clay texture',
  'Malkangiri': 'Red and laterite soil with clay texture',
  'Mayurbhanj': 'Red and laterite soil with sandy clay loam texture',
  'Nabarangpur': 'Red and laterite soil with clay texture',
  'Nayagarh': 'Red and laterite soil with clay loam texture',
  'Nuapada': 'Red and yellow soil with clay loam texture',
  'Puri': 'Coastal and alluvial soil with sandy loam texture',
  'Rayagada': 'Red and laterite soil with clay texture',
  'Sambalpur': 'Red and yellow soil with clay loam texture',
  'Subarnapur': 'Red and yellow soil with clay loam texture',
  'Sundargarh': 'Red and laterite soil with sandy clay loam texture'
};

interface LocationSelectorProps {
  onLocationSelect: (location: string, soilType: string, town?: string) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({ onLocationSelect }) => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedTown, setSelectedTown] = useState<string>('');
  const [soilType, setSoilType] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isTownOpen, setIsTownOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<GeolocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  // Filter districts based on search term
  const filteredDistricts = odishaDistricts.filter(district =>
    district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get towns for selected district
  const availableTowns = selectedLocation ? (odishaDistrictsWithTowns as Record<string, string[]>)[selectedLocation] || [] : [];

  useEffect(() => {
    if (selectedLocation) {
      const soil = soilTypeData[selectedLocation] || t('location.unknown_soil');
      setSoilType(soil);
      // Pass combined location string if town is selected, otherwise just district
      const locationString = selectedTown ? `${selectedLocation}, ${selectedTown}` : selectedLocation;
      onLocationSelect(locationString, soil, selectedTown);
    }
  }, [selectedLocation, selectedTown, t]); // Removed onLocationSelect from dependencies to prevent infinite re-renders

  const handleLocationSelect = (district: string) => {
    setSelectedLocation(district);
    setSelectedTown(''); // Reset town when district changes
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleTownSelect = (town: string) => {
    setSelectedTown(town);
    setIsTownOpen(false);
  };

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError('');
    
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      
      // If we got district information and it matches an Odisha district, select it
      if (location.district && location.state?.toLowerCase().includes('odisha')) {
        const matchingDistrict = odishaDistricts.find(district => 
          district.toLowerCase().includes(location.district!.toLowerCase()) ||
          location.district!.toLowerCase().includes(district.toLowerCase())
        );
        
        if (matchingDistrict) {
          handleLocationSelect(matchingDistrict);
        }
      }
      
      // If we have city/town info, try to match it with districts
      if (location.city && location.state?.toLowerCase().includes('odisha')) {
        const matchingDistrict = odishaDistricts.find(district => 
          district.toLowerCase().includes(location.city!.toLowerCase()) ||
          location.city!.toLowerCase().includes(district.toLowerCase())
        );
        
        if (matchingDistrict) {
          handleLocationSelect(matchingDistrict);
        }
      }
      
    } catch (error) {
      setLocationError('Unable to get current location. Please select manually.');
      console.error('Geolocation error:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 rounded-xl shadow-lg p-6 mb-8 border border-green-100">
      <div className="flex items-center mb-4">
        <div className="bg-green-100 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-green-800">{t('location.title')}</h2>
      </div>
      
      <div className="relative mb-4">
        <div className="mb-2">
          <input
            type="text"
            placeholder="Search districts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
        </div>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-white border border-green-200 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-green-500 transition-all hover:bg-green-50"
        >
          <span className="font-medium">{selectedLocation || t('location.select_prompt')}</span>
          <svg
            className={`w-5 h-5 text-green-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-green-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <ul className="py-1">
              {filteredDistricts.map((district) => (
                <li
                  key={district}
                  onClick={() => handleLocationSelect(district)}
                  className="px-4 py-2 hover:bg-green-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {district}
                </li>
              ))}
              {filteredDistricts.length === 0 && (
                <li className="px-4 py-2 text-gray-500 text-center">
                  No districts found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Town/Locality Selector */}
      {selectedLocation && (
        <div className="relative mb-4">
          <button
            onClick={() => setIsTownOpen(!isTownOpen)}
            className="w-full flex items-center justify-between bg-white border border-blue-200 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-blue-50"
          >
            <span className="font-medium">
              {selectedTown || `Select town/locality in ${selectedLocation}`}
            </span>
            <svg
              className={`w-5 h-5 text-blue-600 transition-transform ${isTownOpen ? 'transform rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {isTownOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-blue-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
              <ul className="py-1">
                {availableTowns.map((town) => (
                  <li
                    key={town}
                    onClick={() => handleTownSelect(town)}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    {town}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Current Location Button */}
      <div className="mb-4">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoadingLocation}
          className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {isLoadingLocation ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Getting Location...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Use Current Location
            </>
          )}
        </button>
        
        {locationError && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{locationError}</p>
          </div>
        )}
        
        {currentLocation && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              📍 {currentLocation.city && `${currentLocation.city}, `}
              {currentLocation.district && `${currentLocation.district}, `}
              {currentLocation.state || 'Location detected'}
            </p>
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="mt-4 bg-white p-4 rounded-lg border border-green-100">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="font-semibold text-gray-800">Selected Location:</h3>
          </div>
          <div className="pl-7 space-y-1">
            <p className="text-gray-700">
              <span className="font-medium">District:</span> {selectedLocation}
            </p>
            {selectedTown && (
              <p className="text-gray-700">
                <span className="font-medium">Town/Locality:</span> {selectedTown}
              </p>
            )}
            <p className="text-gray-700">
              <span className="font-medium">{t('location.soil_type')}:</span> {soilType}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export { LocationSelector };
export default LocationSelector;