export interface User {
  id: number
  name: string
  email: string
  phone: string
  language: string
  region: string
  farmSize: number
  experience: number
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  units: {
    temperature: 'celsius' | 'fahrenheit'
    distance: 'metric' | 'imperial'
    weight: 'kg' | 'lbs'
  }
  theme: 'light' | 'dark'
  language: string
}

export interface Farm {
  id: number
  name: string
  location: {
    latitude: number
    longitude: number
    address: string
    region: string
  }
  size: number
  soilType: string
  irrigation: 'manual' | 'drip' | 'sprinkler' | 'flood'
  crops: number[]
  establishedDate: string
}
