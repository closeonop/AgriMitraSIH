// Location-based agricultural recommendations for Odisha districts and towns
export interface LocationRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'crop' | 'weather' | 'pest' | 'soil' | 'water';
  season: 'kharif' | 'rabi' | 'summer' | 'all';
  ecosystem: 'irrigated' | 'upland' | 'lowland' | 'coastal' | 'all';
  actionItems: string[];
  applicableDistricts: string[];
  applicableTowns?: string[];
}

// Comprehensive district and town mapping for Odisha
export const odishaDistricts = {
  // Coastal Districts
  'Balasore': ['Balasore', 'Basta', 'Jaleswar', 'Nilagiri', 'Remuna', 'Soro'],
  'Bhadrak': ['Bhadrak', 'Chandbali', 'Dhamnagar', 'Tihidi', 'Basudevpur'],
  'Kendrapara': ['Kendrapara', 'Aul', 'Derabish', 'Garadpur', 'Mahakalapada', 'Marsaghai', 'Pattamundai', 'Rajkanika'],
  'Jagatsinghpur': ['Jagatsinghpur', 'Balikuda', 'Erasama', 'Kujang', 'Naugaon', 'Raghunathpur', 'Tirtol'],
  'Puri': ['Puri', 'Brahmagiri', 'Delang', 'Gop', 'Kakatpur', 'Konark', 'Krushnaprasad', 'Nimapara', 'Pipili', 'Satyabadi'],
  'Ganjam': ['Berhampur', 'Aska', 'Bellaguntha', 'Bhanjanagar', 'Buguda', 'Chhatrapur', 'Chikiti', 'Digapahandi', 'Gopalpur', 'Hinjilicut', 'Kabisuryanagar', 'Khallikote', 'Patrapur', 'Polasara', 'Purusottampur', 'Rangeilunda', 'Sanakhemundi', 'Sheragada', 'Surada'],
  
  // Central Districts
  'Cuttack': ['Cuttack', 'Athagarh', 'Badamba', 'Banki', 'Baranga', 'Dampara', 'Kantapada', 'Kisannagar', 'Mahanga', 'Narasinghpur', 'Niali', 'Salepur', 'Tangi-Choudwar', 'Tigiria'],
  'Khordha': ['Bhubaneswar', 'Khordha', 'Balianta', 'Balipatna', 'Begunia', 'Bolagarh', 'Chilika', 'Jatni', 'Tankapani-Road'],
  'Nayagarh': ['Nayagarh', 'Bhapur', 'Daspalla', 'Gania', 'Itamati', 'Khandapada', 'Nuagaon', 'Odagaon', 'Ranpur'],
  
  // Western Plateau Districts
  'Sundargarh': ['Rourkela', 'Sundargarh', 'Balisankara', 'Bargaon', 'Bisra', 'Bonai', 'Brahmani Tarang', 'Gurundia', 'Hemgir', 'Koida', 'Kuanrmunda', 'Kutra', 'Lahunipara', 'Lathikata', 'Lefripada', 'Lephripara', 'Mahulpali', 'Nuagaon', 'Rajgangpur', 'Subdega', 'Tangarpali'],
  'Sambalpur': ['Sambalpur', 'Bamra', 'Dhankauda', 'Jujomura', 'Kuchinda', 'Maneswar', 'Naktideul', 'Rairakhol', 'Rengali'],
  'Deogarh': ['Deogarh', 'Barkote', 'Reamal', 'Tileibani'],
  'Jharsuguda': ['Jharsuguda', 'Brajrajnagar', 'Kirmira', 'Kolabira', 'Lakhanpur', 'Laikera'],
  'Bargarh': ['Bargarh', 'Ambabhona', 'Attabira', 'Barpali', 'Bheden', 'Bhatli', 'Bijepur', 'Gaisilet', 'Padampur', 'Paikmal', 'Sohela'],
  'Subarnapur': ['Subarnapur', 'Birmaharajpur', 'Dunguripali', 'Tarabha', 'Ullunda'],
  
  // Northern Districts
  'Mayurbhanj': ['Baripada', 'Bangriposi', 'Badasahi', 'Betanoti', 'Bholaganj', 'Bijatala', 'Bisoi', 'Gopabandhunagar', 'Jashipur', 'Karanjia', 'Kaptipada', 'Khunta', 'Kuliana', 'Kusumi', 'Moroda', 'Rairangpur', 'Rasgovindpur', 'Samakhunta', 'Saraskana', 'Sukruli', 'Thakurmunda', 'Udala'],
  'Keonjhar': ['Keonjhar', 'Anandapur', 'Banspal', 'Barbil', 'Champua', 'Ghatagaon', 'Harichandanpur', 'Hatadihi', 'Jhumpura', 'Karanjia', 'Patna', 'Saharpada', 'Telkoi', 'Turumunga'],
  
  // Southern Districts
  'Gajapati': ['Paralakhemundi', 'Gumma', 'Kasinagar', 'Mohana', 'Nuagada', 'Rayagada', 'R.Udayagiri'],
  'Rayagada': ['Rayagada', 'Ambadola', 'Bisam Cuttack', 'Chandrapur', 'Gunupur', 'Gudari', 'Kalyansinghpur', 'Kalyani', 'Kolnara', 'Muniguda', 'Padmapur'],
  'Koraput': ['Koraput', 'Baipariguda', 'Bandhugaon', 'Boipariguda', 'Dasmantpur', 'Jeypore', 'Kotpad', 'Kundra', 'Lamtaput', 'Laxmipur', 'Narayanpatna', 'Nandapur', 'Pottangi', 'Semiliguda'],
  'Nabarangpur': ['Nabarangpur', 'Chandahandi', 'Dabugaon', 'Jharigaon', 'Kosagumuda', 'Nandahandi', 'Papadahandi', 'Raighar', 'Tentulikhunti', 'Umerkote'],
  'Malkangiri': ['Malkangiri', 'Balimela', 'Chitrakonda', 'Kalimela', 'Khairput', 'Korukonda', 'Kudumulugumma', 'Mathili', 'Motu', 'Orkel', 'Podia'],
  
  // Other Districts
  'Angul': ['Angul', 'Athamallik', 'Banarpal', 'Chhendipada', 'Colliery', 'Jarapada', 'Kaniha', 'Kishorenagar', 'Pallahara', 'Talcher'],
  'Boudh': ['Boudh', 'Kantamal', 'Manamunda', 'Purunakatak'],
  'Kandhamal': ['Phulbani', 'Baliguda', 'Chakapada', 'Daringbadi', 'G.Udayagiri', 'Khajuripada', 'Kotagarh', 'Nuagaon', 'Phiringia', 'Raikia', 'Tikabali', 'Tumudibandha'],
  'Kalahandi': ['Bhawanipatna', 'Dharamgarh', 'Golamunda', 'Jaipatna', 'Junagarh', 'Kalampur', 'Karlamunda', 'Kesinga', 'Kokasara', 'Lanjigarh', 'M.Rampur', 'Narla', 'Thuamul Rampur'],
  'Nuapada': ['Nuapada', 'Boden', 'Khariar', 'Komna', 'Sinapali'],
  'Balangir': ['Balangir', 'Agalpur', 'Bangomunda', 'Belpada', 'Deogaon', 'Gudvela', 'Khaprakhol', 'Loisinga', 'Muribahal', 'Patnagarh', 'Puintala', 'Saintala', 'Tarbha', 'Titlagarh']
};

// Comprehensive location-specific recommendations
export const locationBasedRecommendations: LocationRecommendation[] = [
  // Coastal Districts Recommendations
  {
    id: 'coastal-rice-kharif',
    title: 'Salt-Tolerant Rice Cultivation',
    description: 'Specialized rice varieties for coastal saline conditions during monsoon.',
    priority: 'high',
    category: 'crop',
    season: 'kharif',
    ecosystem: 'coastal',
    actionItems: [
      'Use salt-tolerant varieties: Lunishree, Bhudeb, Matangini, or CSR-36',
      'Apply gypsum (500-750 kg/ha) before transplanting to reduce salinity',
      'Maintain 5-7 cm water depth to prevent salt accumulation',
      'Use organic mulch to reduce evaporation and salt buildup',
      'Monitor for brown planthopper - common in coastal humidity'
    ],
    applicableDistricts: ['Balasore', 'Bhadrak', 'Kendrapara', 'Jagatsinghpur', 'Puri', 'Ganjam']
  },
  {
    id: 'coastal-cyclone-management',
    title: 'Cyclone & Storm Surge Protection',
    description: 'Comprehensive disaster preparedness for coastal agricultural areas.',
    priority: 'high',
    category: 'weather',
    season: 'kharif',
    ecosystem: 'coastal',
    actionItems: [
      'Plant protective windbreaks using casuarina, coconut, or palmyra palm',
      'Choose short-duration varieties (90-100 days) to avoid October cyclones',
      'Create elevated seed and fertilizer storage facilities',
      'Install early warning systems and weather monitoring equipment',
      'Use submergence-tolerant varieties like Swarna-Sub1 in flood-prone areas'
    ],
    applicableDistricts: ['Balasore', 'Bhadrak', 'Kendrapara', 'Jagatsinghpur', 'Puri', 'Ganjam']
  },

  // Central Districts Recommendations
  {
    id: 'central-intensive-rice',
    title: 'High-Yield Rice Production',
    description: 'Intensive cultivation methods for well-irrigated central plains.',
    priority: 'high',
    category: 'crop',
    season: 'kharif',
    ecosystem: 'irrigated',
    actionItems: [
      'Use high-yielding varieties: Swarna, MTU-1010, Improved Lalat, or Naveen',
      'Apply NPK in ratio 120:60:60 kg/ha for maximum yield potential',
      'Practice System of Rice Intensification (SRI) for 20-30% yield increase',
      'Use leaf color chart for precise nitrogen management',
      'Apply zinc sulfate (25 kg/ha) at transplanting for better grain filling'
    ],
    applicableDistricts: ['Cuttack', 'Khordha', 'Nayagarh']
  },
  {
    id: 'central-vegetable-rabi',
    title: 'Commercial Vegetable Production',
    description: 'High-value vegetable cultivation during winter season.',
    priority: 'medium',
    category: 'crop',
    season: 'rabi',
    ecosystem: 'irrigated',
    actionItems: [
      'Grow tomato, brinjal, cauliflower, cabbage, and onion for market',
      'Install drip irrigation systems for 40-50% water savings',
      'Use plastic mulch to conserve moisture and control weeds',
      'Apply balanced fertilization with emphasis on potassium for quality',
      'Implement integrated pest management with bio-pesticides'
    ],
    applicableDistricts: ['Cuttack', 'Khordha', 'Nayagarh']
  },

  // Western Plateau Recommendations
  {
    id: 'plateau-drought-rice',
    title: 'Drought-Resistant Rice Cultivation',
    description: 'Water-efficient rice production for upland plateau regions.',
    priority: 'high',
    category: 'crop',
    season: 'kharif',
    ecosystem: 'upland',
    actionItems: [
      'Use drought-tolerant varieties: Sahbhagi Dhan, Anjali, Vandana, or Kalinga III',
      'Practice direct seeding to reduce water requirement by 25-30%',
      'Apply mulching with crop residues to conserve soil moisture',
      'Use alternate wetting and drying (AWD) irrigation method',
      'Apply phosphorus-rich fertilizers for better root development'
    ],
    applicableDistricts: ['Sundargarh', 'Sambalpur', 'Deogarh', 'Jharsuguda', 'Bargarh', 'Subarnapur']
  },
  {
    id: 'plateau-red-soil-management',
    title: 'Red Lateritic Soil Improvement',
    description: 'Soil fertility enhancement for acidic red soils of western plateau.',
    priority: 'medium',
    category: 'soil',
    season: 'all',
    ecosystem: 'upland',
    actionItems: [
      'Apply agricultural lime (2-3 tons/ha) to raise pH from 4.5-5.5 to 6.0-6.5',
      'Use farmyard manure (10-15 tons/ha) to improve organic matter content',
      'Apply rock phosphate or single super phosphate to overcome P-fixation',
      'Grow green manure crops like dhaincha or sunhemp during summer',
      'Use micronutrient mixtures containing Zn, B, Mo for deficiency correction'
    ],
    applicableDistricts: ['Sundargarh', 'Sambalpur', 'Deogarh', 'Jharsuguda', 'Bargarh', 'Subarnapur']
  },

  // Northern Districts Recommendations
  {
    id: 'northern-tribal-farming',
    title: 'Sustainable Tribal Agriculture',
    description: 'Eco-friendly mixed farming systems for hilly tribal regions.',
    priority: 'medium',
    category: 'crop',
    season: 'kharif',
    ecosystem: 'upland',
    actionItems: [
      'Practice mixed cropping: rice + finger millet + black gram combinations',
      'Use indigenous varieties adapted to local climate and soil conditions',
      'Implement contour farming and terracing on slopes to prevent erosion',
      'Use organic farming methods with compost, vermicompost, and bio-fertilizers',
      'Grow high-value crops: turmeric, ginger, medicinal plants as cash crops'
    ],
    applicableDistricts: ['Mayurbhanj', 'Keonjhar']
  },
  {
    id: 'northern-forest-integration',
    title: 'Agroforestry Systems',
    description: 'Integration of trees with agriculture in forest-adjacent areas.',
    priority: 'medium',
    category: 'crop',
    season: 'all',
    ecosystem: 'upland',
    actionItems: [
      'Plant multipurpose trees: neem, mahua, sal, bamboo around field boundaries',
      'Practice alley cropping with leguminous trees for nitrogen fixation',
      'Grow shade-tolerant crops under tree canopy during summer',
      'Collect and market non-timber forest products for additional income',
      'Use tree leaves as organic mulch and green manure'
    ],
    applicableDistricts: ['Mayurbhanj', 'Keonjhar']
  },

  // Southern Districts Recommendations
  {
    id: 'southern-millet-cultivation',
    title: 'Climate-Resilient Millet Production',
    description: 'Drought-resistant millets for food and nutritional security.',
    priority: 'medium',
    category: 'crop',
    season: 'kharif',
    ecosystem: 'upland',
    actionItems: [
      'Grow finger millet (ragi), pearl millet (bajra), and little millet varieties',
      'Use minimal external inputs - ideal for organic and natural farming',
      'Practice intercropping with legumes: black gram, cowpea, or field pea',
      'Apply farmyard manure (5-8 tons/ha) as primary nutrient source',
      'Harvest rainwater in farm ponds for life-saving irrigation'
    ],
    applicableDistricts: ['Gajapati', 'Rayagada', 'Koraput', 'Nabarangpur', 'Malkangiri']
  },
  {
    id: 'southern-spice-cultivation',
    title: 'High-Value Spice Production',
    description: 'Commercial cultivation of spices in hilly terrain.',
    priority: 'medium',
    category: 'crop',
    season: 'all',
    ecosystem: 'upland',
    actionItems: [
      'Grow turmeric, ginger, black pepper, and cardamom in well-drained soils',
      'Use shade nets (50-75%) for ginger cultivation during summer months',
      'Apply organic mulch (paddy straw, leaves) to conserve moisture',
      'Practice crop rotation with cereals and pulses to maintain soil health',
      'Add value through processing, grading, and direct marketing'
    ],
    applicableDistricts: ['Gajapati', 'Rayagada', 'Koraput', 'Nabarangpur', 'Malkangiri']
  },

  // Universal Recommendations for All Districts
  {
    id: 'universal-ipm',
    title: 'Integrated Pest Management',
    description: 'Sustainable pest control strategies for all cropping systems.',
    priority: 'high',
    category: 'pest',
    season: 'all',
    ecosystem: 'all',
    actionItems: [
      'Use pheromone traps for early detection and monitoring of major pests',
      'Apply neem-based bio-pesticides as first line of defense',
      'Encourage beneficial insects through flowering plants and habitat management',
      'Practice crop rotation to break pest life cycles',
      'Use resistant varieties when available for major pest problems'
    ],
    applicableDistricts: ['All']
  },
  {
    id: 'universal-water-conservation',
    title: 'Water Conservation Techniques',
    description: 'Efficient water management for sustainable agriculture.',
    priority: 'high',
    category: 'water',
    season: 'all',
    ecosystem: 'all',
    actionItems: [
      'Construct farm ponds and check dams for rainwater harvesting',
      'Use drip irrigation or sprinkler systems for 30-50% water savings',
      'Apply mulching to reduce evaporation losses by 40-60%',
      'Practice conservation tillage to improve water infiltration',
      'Grow cover crops during fallow periods to prevent soil moisture loss'
    ],
    applicableDistricts: ['All']
  },
  {
    id: 'universal-soil-health',
    title: 'Soil Health Management',
    description: 'Comprehensive soil fertility and health improvement strategies.',
    priority: 'medium',
    category: 'soil',
    season: 'all',
    ecosystem: 'all',
    actionItems: [
      'Test soil annually for pH, organic carbon, and major nutrients',
      'Apply organic matter (compost, FYM) at 5-10 tons/ha annually',
      'Use bio-fertilizers (Rhizobium, PSB, Azotobacter) to reduce chemical inputs',
      'Practice green manuring with dhaincha, sunhemp, or cowpea',
      'Maintain soil cover through crop residues or cover crops'
    ],
    applicableDistricts: ['All']
  },
  {
    id: 'universal-climate-adaptation',
    title: 'Climate Change Adaptation',
    description: 'Building resilience against climate variability and extreme weather.',
    priority: 'high',
    category: 'weather',
    season: 'all',
    ecosystem: 'all',
    actionItems: [
      'Use weather-based agro-advisories for timely farm operations',
      'Diversify crops and varieties to spread climate risks',
      'Adopt climate-resilient varieties tolerant to heat, drought, or flooding',
      'Install weather monitoring equipment for micro-climate management',
      'Develop contingency plans for extreme weather events'
    ],
    applicableDistricts: ['All']
  }
];

// Helper function to get district from location string
export const getDistrictFromLocation = (location: string): string | null => {
  if (!location) return null;
  
  // Handle different location formats
  const parts = location.split(',').map(part => part.trim());
  
  // If location has comma, assume format is "Town, District"
  if (parts.length >= 2) {
    const potentialDistrict = parts[1];
    // Check if it's a valid district
    if (Object.keys(odishaDistricts).includes(potentialDistrict)) {
      return potentialDistrict;
    }
  }
  
  // If single location, check if it's a district or find district containing this town
  const singleLocation = parts[0];
  
  // Check if it's directly a district
  if (Object.keys(odishaDistricts).includes(singleLocation)) {
    return singleLocation;
  }
  
  // Find district containing this town
  for (const [district, towns] of Object.entries(odishaDistricts)) {
    if (towns.includes(singleLocation)) {
      return district;
    }
  }
  
  return null;
};

// Get location-based recommendations
export const getLocationBasedRecommendations = (
  district: string, 
  currentSeason: string
): LocationRecommendation[] => {
  if (!district) return [];
  
  return locationBasedRecommendations.filter(rec => {
    // Check if recommendation applies to this district
    const appliesToDistrict = rec.applicableDistricts.includes(district) || 
                             rec.applicableDistricts.includes('All');
    
    // Check season compatibility
    const appliesToSeason = rec.season === currentSeason || rec.season === 'all';
    
    return appliesToDistrict && appliesToSeason;
  });
};

// Get available categories for a district and season
export const getAvailableCategories = (district: string, season: string): string[] => {
  const recommendations = getLocationBasedRecommendations(district, season);
  const categories = Array.from(new Set(recommendations.map(rec => rec.category)));
  return categories.sort();
};

// Get available ecosystems for a district and season
export const getAvailableEcosystems = (district: string, season: string): string[] => {
  const recommendations = getLocationBasedRecommendations(district, season);
  const ecosystems = Array.from(new Set(recommendations.map(rec => rec.ecosystem)));
  return ecosystems.filter(eco => eco !== 'all').sort();
};