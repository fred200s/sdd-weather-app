import type { WeatherData } from '../types/weather';

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'Sao Paulo',
    countryCode: 'BR',
    country: 'Brasil',
    region: 'Sao Paulo',
    latitude: -23.5505,
    longitude: -46.6333,
    timezone: 'America/Sao_Paulo',
  },
  current: {
    time: '2026-08-12T10:00',
    temperatureC: 18.4,
    weatherCode: 3,
    humidityPercent: 72,
    windSpeedKmh: 12.5,
    precipitationMm: 0.2,
    pressureHpa: 1014,
  },
  forecast: [
    {
      date: '2026-08-12',
      weatherCode: 3,
      temperatureMinC: 14.2,
      temperatureMaxC: 22.1,
      precipitationProbability: 20,
    },
    {
      date: '2026-08-13',
      weatherCode: 61,
      temperatureMinC: 13.8,
      temperatureMaxC: 20.3,
      precipitationProbability: 65,
    },
    {
      date: '2026-08-14',
      weatherCode: 2,
      temperatureMinC: 15.1,
      temperatureMaxC: 23.4,
      precipitationProbability: 30,
    },
    {
      date: '2026-08-15',
      weatherCode: 0,
      temperatureMinC: 16.2,
      temperatureMaxC: 25.7,
      precipitationProbability: 10,
    },
    {
      date: '2026-08-16',
      weatherCode: 80,
      temperatureMinC: 17.4,
      temperatureMaxC: 24.6,
      precipitationProbability: 55,
    },
  ],
  unit: 'celsius',
};
