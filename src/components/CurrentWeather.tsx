import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';

export interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  label: string;
  value: string;
}

function Metric({ label, value }: MetricProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-white/60">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-white">{value}</dd>
    </div>
  );
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps) {
  const weather = getWeatherCodeInfo(current.weatherCode);
  const region = city.region ? `${city.region}, ` : '';

  return (
    <article
      aria-labelledby="current-weather-title"
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-md"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-accent-400">Clima atual</p>
          <h1 className="mt-1 text-2xl font-semibold text-white" id="current-weather-title">
            {city.name}
          </h1>
          <p className="text-sm text-white/60">
            {region}
            {city.country}
          </p>
        </div>
        <div aria-label={weather.description} className="text-6xl" role="img">
          {weather.icon}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-6xl font-bold tracking-tight text-white sm:text-7xl">
            {formatTemperature(current.temperatureC, unit)}
          </p>
          <p className="mt-2 text-base text-white/70">{weather.description}</p>
        </div>
        <p className="text-sm text-white/50">Medição: {current.time}</p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Metric
          label="Umidade"
          value={current.humidityPercent === undefined ? '—' : `${current.humidityPercent}%`}
        />
        <Metric
          label="Vento"
          value={current.windSpeedKmh === undefined ? '—' : `${current.windSpeedKmh} km/h`}
        />
        <Metric
          label="Precipitação"
          value={current.precipitationMm === undefined ? '—' : `${current.precipitationMm} mm`}
        />
        <Metric
          label="Pressão"
          value={current.pressureHpa === undefined ? '—' : `${current.pressureHpa} hPa`}
        />
      </dl>
    </article>
  );
}
