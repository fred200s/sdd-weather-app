import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

export interface ForecastListProps {
  forecast: ForecastDay[];
  unit: Unit;
}

export default function ForecastList({ forecast, unit }: ForecastListProps) {
  return (
    <section aria-labelledby="forecast-title">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-accent-400">Próximos dias</p>
          <h2 className="text-2xl font-semibold text-white" id="forecast-title">
            Previsão de 5 dias
          </h2>
        </div>
        <span className="text-sm text-white/50">{forecast.length} dias</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {forecast.map((day, index) => (
          <ForecastCard day={day} key={day.date} position={index} unit={unit} />
        ))}
      </div>
    </section>
  );
}
