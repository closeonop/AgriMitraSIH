export interface CurrentWeather {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

export interface WeatherForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
}

export interface WeatherAlert {
  title: string;
  description: string;
  validUntil: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: WeatherForecast[];
  alerts: WeatherAlert[];
}

export interface SoilData {
  type: string;
  ph: number;
  organicMatter: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  recommendations: string[];
  healthScore: number;
}

export interface Crop {
  id: string;
  name: string;
  season: string;
  waterRequirement: string;
  soilType: string;
  growthDuration: string;
  imageUrl?: string;
}

export interface YieldPrediction {
  cropId: string;
  cropName: string;
  predictedYield: number;
  confidence: number;
  status: 'excellent' | 'good' | 'average' | 'poor';
  factors: string[];
}

export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'crop' | 'soil' | 'water' | 'pest';
  actionItems: string[];
}