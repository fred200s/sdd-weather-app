import { formatDayLabel } from '../lib/format';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import type { ForecastDay, Unit } from '../types/weather';

export interface ForecastCardProps {
  day: ForecastDay;
  position: number;
  unit: Unit;
}

export default function ForecastCard({ day, position, unit }: ForecastCardProps) {
  const weather = getWeatherCodeInfo(day.weatherCode);

  return (
    <article
      aria-label={`Previsão para ${formatDayLabel(day.date, position)}`}
      className="flex min-h-52 flex-col rounded-2xl border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md transition hover:border-accent-400/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold capitalize text-white">
            {formatDayLabel(day.date, position)}
          </h3>
          <time className="text-xs text-white/50" dateTime={day.date}>
            {day.date}
          </time>
        </div>
        <div aria-label={weather.description} className="text-3xl" role="img">
          {weather.icon}
        </div>
      </div>

      <p className="mt-4 text-sm text-white/70">{weather.description}</p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <div>
          <p className="text-2xl font-bold text-white">
            {formatTemperature(day.temperatureMaxC, unit)}
          </p>
          <p className="text-xs text-white/50">
            mín. {formatTemperature(day.temperatureMinC, unit)}
          </p>
        </div>
        <p className="text-right text-xs text-accent-400">
          <span className="block text-white/50">Chuva</span>
          {day.precipitationProbability}%
        </p>
      </div>
    </article>
  );
}
