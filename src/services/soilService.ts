// Soil data service for Odisha using multiple APIs
// Note: In production, these would be loaded from environment variables
const AGROMONITORING_API_KEY = 'your_agromonitoring_api_key_here';
const AMBEE_API_KEY = 'your_ambee_api_key_here';

// Check if API keys are configured
const isAgromonitoringConfigured = () => {
  return AGROMONITORING_API_KEY && AGROMONITORING_API_KEY !== 'your_agromonitoring_api_key_here';
};

const isAmbeeConfigured = () => {
  return AMBEE_API_KEY && AMBEE_API_KEY !== 'your_ambee_api_key_here';
};

export interface SoilApiData {
  location: {
    name: string;
    district: string;
    lat: number;
    lon: number;
  };
  soilProperties: {
    ph: number;
    organicMatter: number;
    nitrogen: number; // mg/kg
    phosphorus: number; // mg/kg
    potassium: number; // mg/kg
    moisture: number; // %
    temperature: number; // °C
    salinity: number; // dS/m
    texture: string;
    type: string;
  };
  nutrients: {
    nitrogen: 'Low' | 'Medium' | 'High';
    phosphorus: 'Low' | 'Medium' | 'High';
    potassium: 'Low' | 'Medium' | 'High';
  };
  healthScore: number;
  recommendations: string[];
  suitableCrops: string[];
  lastUpdated: string;
  // Enhanced analysis data
  advancedAnalysis?: {
    fertilityIndex: number;
    cropYieldPotential: number;
    waterRetentionCapacity: number;
    nutrientAvailabilityIndex: number;
    soilQualityGrade: string;
    riskAssessment: string[];
  };
}

// Odisha districts with coordinates for soil data
export const odishaSoilLocations = [
  { name: 'Angul', lat: 20.8397, lon: 85.1016 },
  { name: 'Balangir', lat: 20.7081, lon: 83.4847 },
  { name: 'Balasore', lat: 21.4942, lon: 86.9336 },
  { name: 'Bargarh', lat: 21.3347, lon: 83.6197 },
  { name: 'Bhadrak', lat: 21.0569, lon: 86.5181 },
  { name: 'Boudh', lat: 20.4453, lon: 84.3308 },
  { name: 'Cuttack', lat: 20.4625, lon: 85.8828 },
  { name: 'Deogarh', lat: 21.5347, lon: 84.7347 },
  { name: 'Dhenkanal', lat: 20.6586, lon: 85.5947 },
  { name: 'Gajapati', lat: 18.8547, lon: 84.1697 },
  { name: 'Ganjam', lat: 19.3919, lon: 84.8803 },
  { name: 'Jagatsinghpur', lat: 20.2547, lon: 86.1697 },
  { name: 'Jajpur', lat: 20.8397, lon: 86.3297 },
  { name: 'Jharsuguda', lat: 21.8547, lon: 84.0047 },
  { name: 'Kalahandi', lat: 19.9147, lon: 83.1647 },
  { name: 'Kandhamal', lat: 20.1347, lon: 84.0347 },
  { name: 'Kendrapara', lat: 20.4997, lon: 86.4197 },
  { name: 'Kendujhar', lat: 21.6297, lon: 85.5797 },
  { name: 'Khordha', lat: 20.1297, lon: 85.6197 },
  { name: 'Koraput', lat: 18.8147, lon: 82.7097 },
  { name: 'Malkangiri', lat: 18.3497, lon: 81.8797 },
  { name: 'Mayurbhanj', lat: 21.9347, lon: 86.7350 },
  { name: 'Nabarangpur', lat: 19.2297, lon: 82.5497 },
  { name: 'Nayagarh', lat: 20.1297, lon: 85.0997 },
  { name: 'Nuapada', lat: 20.7797, lon: 82.5397 },
  { name: 'Puri', lat: 19.8135, lon: 85.8312 },
  { name: 'Rayagada', lat: 19.1697, lon: 83.4197 },
  { name: 'Sambalpur', lat: 21.4669, lon: 83.9812 },
  { name: 'Subarnapur', lat: 20.8497, lon: 83.8997 },
  { name: 'Sundargarh', lat: 22.1197, lon: 84.0297 }
];

export class SoilService {
  private async fetchSoilData(url: string): Promise<any> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Soil API request failed:', error);
      throw error;
    }
  }

  // Get soil data from Agromonitoring API
  private async getAgromonitoringSoilData(lat: number, lon: number): Promise<any> {
    if (!isAgromonitoringConfigured()) {
      throw new Error('Agromonitoring API key not configured');
    }

    const url = `http://api.agromonitoring.com/agro/1.0/soil?lat=${lat}&lon=${lon}&appid=${AGROMONITORING_API_KEY}`;
    return this.fetchSoilData(url);
  }

  // Get soil data from Ambee API
  private async getAmbeeSoilData(lat: number, lon: number): Promise<any> {
    if (!isAmbeeConfigured()) {
      throw new Error('Ambee API key not configured');
    }

    const url = `https://api.ambeedata.com/soil/latest/by-lat-lng?lat=${lat}&lng=${lon}`;
    const response = await fetch(url, {
      headers: {
        'x-api-key': AMBEE_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Ambee API error! status: ${response.status}`);
    }

    return response.json();
  }

  // Generate soil recommendations based on data
  private generateRecommendations(soilData: any): string[] {
    const recommendations: string[] = [];

    if (soilData.ph < 6.0) {
      recommendations.push('Apply lime to increase soil pH for better nutrient availability');
    } else if (soilData.ph > 8.0) {
      recommendations.push('Apply sulfur or organic matter to reduce soil pH');
    }

    if (soilData.organicMatter < 2.0) {
      recommendations.push('Increase organic matter through compost or green manure');
    }

    if (soilData.nitrogen < 200) {
      recommendations.push('Apply nitrogen-rich fertilizers or organic amendments');
    }

    if (soilData.phosphorus < 20) {
      recommendations.push('Add phosphorus fertilizers to improve root development');
    }

    if (soilData.potassium < 250) {
      recommendations.push('Apply potassium fertilizers for better disease resistance');
    }

    if (soilData.moisture < 15) {
      recommendations.push('Improve irrigation or water retention capacity');
    }

    return recommendations.length > 0 ? recommendations : ['Soil conditions are optimal for most crops'];
  }

  // Determine suitable crops based on soil conditions
  private getSuitableCrops(soilData: any): string[] {
    const crops: string[] = [];

    // Rice - suitable for most Odisha soils
    if (soilData.ph >= 5.5 && soilData.ph <= 7.5) {
      crops.push('Rice');
    }

    // Wheat - needs well-drained soil
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5 && soilData.moisture < 25) {
      crops.push('Wheat');
    }

    // Sugarcane - needs rich, well-drained soil
    if (soilData.organicMatter > 2.0 && soilData.nitrogen > 250) {
      crops.push('Sugarcane');
    }

    // Pulses - suitable for various soil types
    if (soilData.ph >= 6.0 && soilData.ph <= 8.0) {
      crops.push('Pulses', 'Lentils');
    }

    // Vegetables - need fertile soil
    if (soilData.organicMatter > 1.5 && soilData.nitrogen > 200) {
      crops.push('Vegetables', 'Tomato', 'Brinjal');
    }

    // Fruits - need well-drained, fertile soil
    if (soilData.ph >= 6.0 && soilData.organicMatter > 2.0) {
      crops.push('Mango', 'Coconut', 'Banana');
    }

    return crops.length > 0 ? crops : ['Consult agricultural expert for crop selection'];
  }

  // Perform comprehensive advanced analysis
  private performComprehensiveAnalysis(soilData: any) {
    return {
      fertilityIndex: this.calculateFertilityIndex(soilData),
      cropYieldPotential: this.calculateCropYieldPotential(soilData),
      waterRetentionCapacity: this.calculateWaterRetentionCapacity(soilData),
      nutrientAvailabilityIndex: this.calculateNutrientAvailabilityIndex(soilData),
      soilQualityGrade: this.determineSoilQualityGrade(this.calculateFertilityIndex(soilData), this.calculateCropYieldPotential(soilData), this.calculateWaterRetentionCapacity(soilData)),
      riskAssessment: this.assessSoilRisks(soilData),
    };
  }

  private calculateFertilityIndex(soilData: any): number {
    let index = 0;
    
    // pH contribution (25%)
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      index += 25;
    } else if (soilData.ph >= 5.5 && soilData.ph <= 8.0) {
      index += 20;
    } else {
      index += 10;
    }
    
    // Organic matter contribution (30%)
    const omScore = Math.min((soilData.organicMatter / 4.0) * 30, 30);
    index += omScore;
    
    // Nutrient balance contribution (35%)
    const nScore = Math.min((soilData.nitrogen / 300) * 12, 12);
    const pScore = Math.min((soilData.phosphorus / 30) * 12, 12);
    const kScore = Math.min((soilData.potassium / 350) * 11, 11);
    index += nScore + pScore + kScore;
    
    // Salinity penalty (10%)
    if (soilData.salinity <= 0.5) {
      index += 10;
    } else if (soilData.salinity <= 1.0) {
      index += 5;
    }
    
    return Math.round(Math.min(index, 100));
  }

  private calculateCropYieldPotential(soilData: any): number {
    let potential = 0;
    
    // Base potential from soil health
    const healthScore = this.calculateHealthScore(soilData);
    potential += healthScore * 0.4;
    
    // Moisture availability (30%)
    if (soilData.moisture >= 20 && soilData.moisture <= 30) {
      potential += 30;
    } else if (soilData.moisture >= 15 && soilData.moisture <= 35) {
      potential += 25;
    } else {
      potential += 15;
    }
    
    // Temperature suitability (20%)
    if (soilData.temperature >= 25 && soilData.temperature <= 30) {
      potential += 20;
    } else if (soilData.temperature >= 20 && soilData.temperature <= 35) {
      potential += 15;
    } else {
      potential += 10;
    }
    
    // Nutrient balance (10%)
    const nutrientBalance = (soilData.nitrogen + soilData.phosphorus + soilData.potassium) / 3;
    potential += Math.min((nutrientBalance / 250) * 10, 10);
    
    return Math.round(Math.min(potential, 100));
  }

  private calculateWaterRetentionCapacity(soilData: any): number {
    let capacity = 0;
    
    // Organic matter contribution (40%)
    capacity += Math.min((soilData.organicMatter / 4.0) * 40, 40);
    
    // Clay content estimation based on texture (30%)
    if (soilData.texture.toLowerCase().includes('clay')) {
      capacity += 30;
    } else if (soilData.texture.toLowerCase().includes('loam')) {
      capacity += 25;
    } else {
      capacity += 15;
    }
    
    // Current moisture level indicator (20%)
    capacity += Math.min((soilData.moisture / 35) * 20, 20);
    
    // pH effect on water retention (10%)
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      capacity += 10;
    } else {
      capacity += 5;
    }
    
    return Math.round(Math.min(capacity, 100));
  }

  private calculateNutrientAvailabilityIndex(soilData: any): number {
    let availability = 0;
    
    // pH effect on nutrient availability (30%)
    if (soilData.ph >= 6.0 && soilData.ph <= 7.0) {
      availability += 30;
    } else if (soilData.ph >= 5.5 && soilData.ph <= 7.5) {
      availability += 25;
    } else {
      availability += 15;
    }
    
    // Organic matter effect (25%)
    availability += Math.min((soilData.organicMatter / 3.5) * 25, 25);
    
    // Individual nutrient levels (35%)
    const nAvail = Math.min((soilData.nitrogen / 300) * 12, 12);
    const pAvail = Math.min((soilData.phosphorus / 30) * 12, 12);
    const kAvail = Math.min((soilData.potassium / 350) * 11, 11);
    availability += nAvail + pAvail + kAvail;
    
    // Salinity penalty (10%)
    if (soilData.salinity <= 0.5) {
      availability += 10;
    } else if (soilData.salinity <= 1.0) {
      availability += 5;
    }
    
    return Math.round(Math.min(availability, 100));
  }

  private determineSoilQualityGrade(fertility: number, yieldPotential: number, waterRetention: number): string {
    const average = (fertility + yieldPotential + waterRetention) / 3;
    
    if (average >= 85) return 'Excellent (A+)';
    if (average >= 75) return 'Very Good (A)';
    if (average >= 65) return 'Good (B+)';
    if (average >= 55) return 'Fair (B)';
    if (average >= 45) return 'Poor (C)';
    return 'Very Poor (D)';
  }

  private assessSoilRisks(soilData: any): string[] {
    const risks: string[] = [];
    
    if (soilData.ph < 5.5) {
      risks.push('High acidity risk - may cause nutrient deficiencies');
    } else if (soilData.ph > 8.0) {
      risks.push('High alkalinity risk - may reduce nutrient availability');
    }
    
    if (soilData.salinity > 1.0) {
      risks.push('Salinity stress risk - may affect crop growth');
    }
    
    if (soilData.organicMatter < 1.5) {
      risks.push('Low organic matter - poor soil structure and fertility');
    }
    
    if (soilData.moisture < 15) {
      risks.push('Water stress risk - inadequate moisture for crops');
    } else if (soilData.moisture > 35) {
      risks.push('Waterlogging risk - may cause root rot');
    }
    
    if (soilData.nitrogen < 180) {
      risks.push('Nitrogen deficiency risk - may reduce crop yield');
    }
    
    if (soilData.phosphorus < 15) {
      risks.push('Phosphorus deficiency risk - may affect root development');
    }
    
    if (soilData.potassium < 200) {
      risks.push('Potassium deficiency risk - may reduce disease resistance');
    }
    
    return risks.length > 0 ? risks : ['No significant risks identified'];
   }

   // Calculate soil health score
   private calculateHealthScore(soilData: any): number {
     let score = 0;

    // pH score (0-25 points)
    if (soilData.ph >= 6.0 && soilData.ph <= 7.5) {
      score += 25;
    } else if (soilData.ph >= 5.5 && soilData.ph <= 8.0) {
      score += 20;
    } else {
      score += 10;
    }

    // Organic matter score (0-25 points)
    if (soilData.organicMatter >= 3.0) {
      score += 25;
    } else if (soilData.organicMatter >= 2.0) {
      score += 20;
    } else if (soilData.organicMatter >= 1.0) {
      score += 15;
    } else {
      score += 5;
    }

    // Nutrient score (0-30 points)
    let nutrientScore = 0;
    if (soilData.nitrogen >= 250) nutrientScore += 10;
    else if (soilData.nitrogen >= 200) nutrientScore += 8;
    else nutrientScore += 5;

    if (soilData.phosphorus >= 25) nutrientScore += 10;
    else if (soilData.phosphorus >= 20) nutrientScore += 8;
    else nutrientScore += 5;

    if (soilData.potassium >= 300) nutrientScore += 10;
    else if (soilData.potassium >= 250) nutrientScore += 8;
    else nutrientScore += 5;

    score += nutrientScore;

    // Moisture score (0-20 points)
    if (soilData.moisture >= 20 && soilData.moisture <= 30) {
      score += 20;
    } else if (soilData.moisture >= 15 && soilData.moisture <= 35) {
      score += 15;
    } else {
      score += 10;
    }

    return Math.min(score, 100);
  }

  // Get nutrient levels classification
  private getNutrientLevels(nitrogen: number, phosphorus: number, potassium: number) {
    return {
      nitrogen: nitrogen >= 250 ? 'High' : nitrogen >= 200 ? 'Medium' : 'Low',
      phosphorus: phosphorus >= 25 ? 'High' : phosphorus >= 20 ? 'Medium' : 'Low',
      potassium: potassium >= 300 ? 'High' : potassium >= 250 ? 'Medium' : 'Low'
    } as const;
  }

  // Get mock soil data for testing
  private getMockSoilData(district: string): SoilApiData {
    const location = odishaSoilLocations.find(loc => 
      loc.name.toLowerCase() === district.toLowerCase()
    ) || odishaSoilLocations[0];

    // Generate realistic mock data based on Odisha soil characteristics
    const mockData = {
      ph: 6.2 + Math.random() * 1.6, // 6.2 - 7.8
      organicMatter: 1.5 + Math.random() * 2.0, // 1.5 - 3.5%
      nitrogen: 180 + Math.random() * 120, // 180 - 300 mg/kg
      phosphorus: 15 + Math.random() * 20, // 15 - 35 mg/kg
      potassium: 200 + Math.random() * 150, // 200 - 350 mg/kg
      moisture: 18 + Math.random() * 15, // 18 - 33%
      temperature: 25 + Math.random() * 8, // 25 - 33°C
      salinity: 0.1 + Math.random() * 0.4, // 0.1 - 0.5 dS/m
      texture: 'Clay loam',
      type: 'Red and laterite soil'
    };

    const nutrients = this.getNutrientLevels(mockData.nitrogen, mockData.phosphorus, mockData.potassium);
    const healthScore = this.calculateHealthScore(mockData);
    const recommendations = this.generateRecommendations(mockData);
    const suitableCrops = this.getSuitableCrops(mockData);

    return {
      location: {
        name: location.name,
        district: location.name,
        lat: location.lat,
        lon: location.lon
      },
      soilProperties: mockData,
      nutrients,
      healthScore,
      recommendations,
      suitableCrops,
      lastUpdated: new Date().toISOString(),
      advancedAnalysis: this.performComprehensiveAnalysis(mockData),
    };
  }

  // Main method to get soil data for a district
  async getSoilDataByDistrict(district: string): Promise<SoilApiData> {
    try {
      const location = odishaSoilLocations.find(loc => 
        loc.name.toLowerCase() === district.toLowerCase()
      );

      if (!location) {
        throw new Error(`District ${district} not found in Odisha`);
      }

      // Try to get real data from APIs
      let soilData = null;

      // Try Agromonitoring first
      if (isAgromonitoringConfigured()) {
        try {
          const agroData = await this.getAgromonitoringSoilData(location.lat, location.lon);
          if (agroData && agroData.moisture !== undefined) {
            soilData = {
              ph: 6.5, // Default as not provided by Agromonitoring
              organicMatter: 2.0, // Default
              nitrogen: 220, // Default
              phosphorus: 22, // Default
              potassium: 280, // Default
              moisture: agroData.moisture,
              temperature: agroData.t10 || 28, // 10cm depth temperature
              salinity: 0.3, // Default
              texture: 'Clay loam',
              type: 'Red and laterite soil'
            };
          }
        } catch (error) {
          console.warn('Agromonitoring API failed:', error);
        }
      }

      // Try Ambee API if Agromonitoring failed
      if (!soilData && isAmbeeConfigured()) {
        try {
          const ambeeData = await this.getAmbeeSoilData(location.lat, location.lon);
          if (ambeeData && ambeeData.data) {
            const data = ambeeData.data[0];
            soilData = {
              ph: data.soil_ph || 6.5,
              organicMatter: data.organic_matter || 2.0,
              nitrogen: data.nitrogen || 220,
              phosphorus: data.phosphorus || 22,
              potassium: data.potassium || 280,
              moisture: data.soil_moisture || 25,
              temperature: data.soil_temperature || 28,
              salinity: data.salinity || 0.3,
              texture: 'Clay loam',
              type: 'Red and laterite soil'
            };
          }
        } catch (error) {
          console.warn('Ambee API failed:', error);
        }
      }

      // If no real data available, use mock data
      if (!soilData) {
        console.warn(`No real soil data available for ${district}, using mock data`);
        return this.getMockSoilData(district);
      }

      // Process real data
      const nutrients = this.getNutrientLevels(soilData.nitrogen, soilData.phosphorus, soilData.potassium);
      const healthScore = this.calculateHealthScore(soilData);
      const recommendations = this.generateRecommendations(soilData);
      const suitableCrops = this.getSuitableCrops(soilData);

      return {
        location: {
          name: location.name,
          district: location.name,
          lat: location.lat,
          lon: location.lon
        },
        soilProperties: soilData,
        nutrients,
        healthScore,
        recommendations,
        suitableCrops,
        lastUpdated: new Date().toISOString(),
         advancedAnalysis: this.performComprehensiveAnalysis(soilData),
       };

    } catch (error) {
      console.error(`Failed to get soil data for ${district}:`, error);
      return this.getMockSoilData(district);
    }
  }

  // Get soil data by coordinates
  async getSoilDataByCoordinates(lat: number, lon: number): Promise<SoilApiData> {
    // Find nearest district
    let nearestDistrict = odishaSoilLocations[0];
    let minDistance = Number.MAX_VALUE;

    for (const location of odishaSoilLocations) {
      const distance = Math.sqrt(
        Math.pow(lat - location.lat, 2) + Math.pow(lon - location.lon, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestDistrict = location;
      }
    }

    return this.getSoilDataByDistrict(nearestDistrict.name);
  }

  // Get all available districts
  getAvailableDistricts(): string[] {
    return odishaSoilLocations.map(location => location.name);
  }
}

// Create and export service instance
const soilService = new SoilService();
export default soilService;

// Export individual methods for convenience
export const getSoilDataByDistrict = (district: string) => soilService.getSoilDataByDistrict(district);
export const getSoilDataByCoordinates = (lat: number, lon: number) => soilService.getSoilDataByCoordinates(lat, lon);
export const getAvailableDistricts = () => soilService.getAvailableDistricts();

// Re-export types
export type SoilData = SoilApiData;