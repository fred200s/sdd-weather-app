export type Unit = 'celsius' | 'fahrenheit';

export interface City {
  id: number;
  name: string;
  countryCode: string;
  country: string;
  region?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface CurrentWeather {
  time: string;
  temperatureC: number;
  weatherCode: number;
  humidityPercent?: number;
  windSpeedKmh?: number;
  precipitationMm?: number;
  pressureHpa?: number;
}

export interface ForecastDay {
  date: string;
  weatherCode: number;
  temperatureMinC: number;
  temperatureMaxC: number;
  precipitationProbability: number;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  forecast: ForecastDay[];
  unit: Unit;
}
