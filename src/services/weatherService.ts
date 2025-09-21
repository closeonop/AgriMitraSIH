// Real-time weather service for Odisha using OpenWeatherMap API
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if API key is configured
const isApiKeyConfigured = () => {
  return OPENWEATHER_API_KEY && OPENWEATHER_API_KEY !== 'your_openweather_api_key_here';
};

export interface RealTimeWeatherData {
  location: {
    name: string;
    lat: number;
    lon: number;
    country: string;
    state: string;
  };
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    pressure: number;
    windSpeed: number;
    windDirection: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    description: string;
    icon: string;
    timestamp: string;
  };
  forecast: Array<{
    date: string;
    day: string;
    high: number;
    low: number;
    condition: string;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    precipitation: number;
  }>;
}

// Major cities and districts in Odisha with coordinates
export const odishaLocations = [
  { name: 'Bhubaneswar', lat: 20.2961, lon: 85.8245, district: 'Khordha' },
  { name: 'Cuttack', lat: 20.4625, lon: 85.8828, district: 'Cuttack' },
  { name: 'Rourkela', lat: 22.2604, lon: 84.8536, district: 'Sundargarh' },
  { name: 'Berhampur', lat: 19.3149, lon: 84.7941, district: 'Ganjam' },
  { name: 'Sambalpur', lat: 21.4669, lon: 83.9812, district: 'Sambalpur' },
  { name: 'Puri', lat: 19.8135, lon: 85.8312, district: 'Puri' },
  { name: 'Balasore', lat: 21.4942, lon: 86.9336, district: 'Balasore' },
  { name: 'Bhadrak', lat: 21.0569, lon: 86.5181, district: 'Bhadrak' },
  { name: 'Baripada', lat: 21.9347, lon: 86.7350, district: 'Mayurbhanj' },
  { name: 'Jharsuguda', lat: 21.8558, lon: 84.0058, district: 'Jharsuguda' },
  { name: 'Jeypore', lat: 18.8557, lon: 82.5678, district: 'Koraput' }
];

export class WeatherService {
  private async fetchWeatherData(url: string): Promise<any> {
    // Check if API key is configured
    if (!isApiKeyConfigured()) {
      console.warn('OpenWeatherMap API key not configured. Using mock data.');
      throw new Error('API key not configured. Please add VITE_OPENWEATHER_API_KEY to your .env file.');
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your VITE_OPENWEATHER_API_KEY in .env file.');
        }
        throw new Error(`Weather API error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch weather data:', error);
      throw error; // Re-throw to handle in calling function
    }
  }

  async getCurrentWeather(lat: number, lon: number): Promise<RealTimeWeatherData> {
    try {
      const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const data = await this.fetchWeatherData(url);
      
      return this.transformCurrentWeatherData(data);
    } catch (error) {
      console.warn('Failed to fetch real-time weather, using mock data:', error);
      return this.getMockWeatherData();
    }
  }

  async getForecastWeather(lat: number, lon: number): Promise<RealTimeWeatherData> {
    try {
      const currentUrl = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const forecastUrl = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      
      const [currentData, forecastData] = await Promise.all([
        this.fetchWeatherData(currentUrl),
        this.fetchWeatherData(forecastUrl)
      ]);

      return this.transformForecastData(currentData, forecastData);
    } catch (error) {
      console.warn('Failed to fetch forecast weather, using mock data:', error);
      return this.getMockWeatherData();
    }
  }

  async getWeatherByCity(cityName: string): Promise<RealTimeWeatherData> {
    try {
      const location = odishaLocations.find(loc => 
        loc.name.toLowerCase() === cityName.toLowerCase() ||
        loc.district.toLowerCase() === cityName.toLowerCase()
      );
      
      if (!location) {
        throw new Error(`City ${cityName} not found in Odisha locations`);
      }

      return await this.getCurrentWeather(location.lat, location.lon);
    } catch (error) {
      console.warn(`Failed to get weather for ${cityName}, using mock data:`, error);
      return this.getMockWeatherData();
    }
  }

  async getWeatherByCoordinates(lat: number, lon: number): Promise<RealTimeWeatherData> {
    return this.getForecastWeather(lat, lon);
  }

  async getWeatherByDistrict(districtName: string): Promise<RealTimeWeatherData> {
    try {
      // First try to find by district name
      let location = odishaLocations.find(loc => 
        loc.district.toLowerCase() === districtName.toLowerCase()
      );
      
      // If not found, try to find by city name
      if (!location) {
        location = odishaLocations.find(loc => 
          loc.name.toLowerCase() === districtName.toLowerCase()
        );
      }
      
      if (!location) {
        // If still not found, use geocoding to get coordinates for the district
        try {
          const geocodeUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${districtName},Odisha,IN&limit=1&appid=${OPENWEATHER_API_KEY}`;
          const geocodeData = await this.fetchWeatherData(geocodeUrl);
          
          if (geocodeData && geocodeData.length > 0) {
            const { lat, lon } = geocodeData[0];
            return this.getForecastWeather(lat, lon);
          }
        } catch (error) {
          console.error('Geocoding failed:', error);
        }
        
        throw new Error(`District ${districtName} not found in Odisha`);
      }

      return this.getForecastWeather(location.lat, location.lon);
    } catch (error) {
      console.warn(`Failed to get weather for district ${districtName}, using mock data:`, error);
      return this.getMockWeatherData();
    }
  }

  private transformCurrentWeatherData(data: any): RealTimeWeatherData {
    return {
      location: {
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
        state: 'Odisha'
      },
      current: {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // Not available in current weather API
        condition: this.getComponentCondition(data.weather[0].main),
        description: data.weather[0].description,
        icon: this.getWeatherIcon(data.weather[0].main),
        timestamp: new Date().toISOString()
      },
      forecast: []
    };
  }

  private transformForecastData(currentData: any, forecastData: any): RealTimeWeatherData {
    const current = this.transformCurrentWeatherData(currentData);
    
    // Group forecast by days and get daily min/max
    const dailyForecasts = new Map();
    
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, {
          date: dateKey,
          day: this.getDayName(date),
          temps: [],
          conditions: [],
          humidity: [],
          windSpeed: [],
          precipitation: 0
        });
      }
      
      const dayData = dailyForecasts.get(dateKey);
      dayData.temps.push(item.main.temp);
      dayData.conditions.push(item.weather[0].main);
      dayData.humidity.push(item.main.humidity);
      dayData.windSpeed.push(item.wind.speed * 3.6);
      if (item.rain) dayData.precipitation += item.rain['3h'] || 0;
    });

    const forecast = Array.from(dailyForecasts.values()).slice(0, 7).map((day: any) => ({
      date: day.date,
      day: day.day,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      condition: this.getComponentCondition(this.getMostFrequentCondition(day.conditions)),
      description: this.getConditionDescription(this.getMostFrequentCondition(day.conditions)),
      icon: this.getWeatherIcon(this.getMostFrequentCondition(day.conditions)),
      humidity: Math.round(day.humidity.reduce((a: number, b: number) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a: number, b: number) => a + b, 0) / day.windSpeed.length),
      precipitation: Math.round(day.precipitation)
    }));

    return {
      ...current,
      forecast
    };
  }

  private getDayName(date: Date): string {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  private getMostFrequentCondition(conditions: string[]): string {
    const frequency = conditions.reduce((acc, condition) => {
      acc[condition] = (acc[condition] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.keys(frequency).reduce((a, b) => 
      frequency[a] > frequency[b] ? a : b
    );
  }

  private getConditionDescription(condition: string): string {
    const descriptions: Record<string, string> = {
      'Clear': 'Clear sky',
      'Clouds': 'Cloudy',
      'Rain': 'Rainy',
      'Drizzle': 'Light rain',
      'Thunderstorm': 'Thunderstorm',
      'Snow': 'Snow',
      'Mist': 'Misty',
      'Fog': 'Foggy',
      'Haze': 'Hazy'
    };
    return descriptions[condition] || condition;
  }

  private getWeatherIcon(condition: string, weatherCode?: string): string {
    // More comprehensive mapping based on OpenWeatherMap conditions
    const icons: Record<string, string> = {
      // Clear conditions
      'Clear': '☀️',
      
      // Cloud conditions
      'Clouds': '☁️',
      
      // Rain conditions
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Shower rain': '🌦️',
      'Heavy intensity rain': '🌧️',
      'Light rain': '🌦️',
      'Moderate rain': '🌧️',
      
      // Thunderstorm conditions
      'Thunderstorm': '⛈️',
      'Thunderstorm with light rain': '⛈️',
      'Thunderstorm with rain': '⛈️',
      'Thunderstorm with heavy rain': '⛈️',
      
      // Snow conditions
      'Snow': '❄️',
      'Light snow': '🌨️',
      'Heavy snow': '❄️',
      
      // Atmospheric conditions
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
      'Smoke': '🌫️',
      'Sand': '🌪️',
      'Dust': '🌪️',
      'Ash': '🌋',
      'Squall': '💨',
      'Tornado': '🌪️'
    };
    
    return icons[condition] || '⛅';
  }

  // New method to get component-friendly condition names
  private getComponentCondition(apiCondition: string): string {
    const conditionMap: Record<string, string> = {
      'Clear': 'sunny',
      'Clouds': 'cloudy',
      'Rain': 'rainy',
      'Drizzle': 'rainy',
      'Thunderstorm': 'stormy',
      'Snow': 'snowy',
      'Mist': 'cloudy',
      'Fog': 'cloudy',
      'Haze': 'cloudy',
      'Smoke': 'cloudy',
      'Sand': 'stormy',
      'Dust': 'stormy',
      'Ash': 'stormy',
      'Squall': 'stormy',
      'Tornado': 'stormy'
    };
    
    return conditionMap[apiCondition] || 'partly-cloudy';
  }

  private getMockWeatherData(): any {
    // Fallback mock data for Bhubaneswar when API fails
    return {
      name: 'Bhubaneswar',
      coord: { lat: 20.2961, lon: 85.8245 },
      sys: { country: 'IN' },
      main: {
        temp: 28,
        feels_like: 32,
        humidity: 75,
        pressure: 1013
      },
      wind: { speed: 3.5, deg: 180 },
      visibility: 10000,
      weather: [{ main: 'Clouds', description: 'partly cloudy' }]
    };
  }
}

export const weatherService = new WeatherService();
export default weatherService;