import type { Unit } from '../types/weather';

export function toFahrenheit(valueC: number): number {
  return (valueC * 9) / 5 + 32;
}

export function formatTemperature(valueC: number, unit: Unit): string {
  const value = unit === 'fahrenheit' ? toFahrenheit(valueC) : valueC;

  return `${Math.round(value)}°`;
}
