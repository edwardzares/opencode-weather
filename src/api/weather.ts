import type {
  CurrentWeather,
  CurrentWeatherResponse,
  DailyForecast,
  DailyForecastResponse,
} from "../types/Weather.ts";
import { DEFAULT_FORECAST_DAYS, FORECAST_URL } from "../utils/constants.ts";

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<CurrentWeather> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error de red al consultar el clima (HTTP ${response.status})`);
  }

  const data = (await response.json()) as CurrentWeatherResponse;
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number") {
    throw new Error("La API no devolvió una temperatura válida");
  }

  return { temperatureC: temperature };
}

export async function getForecast(
  latitude: number,
  longitude: number,
  days = DEFAULT_FORECAST_DAYS,
): Promise<DailyForecast[]> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", String(days));

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error de red al consultar el pronóstico (HTTP ${response.status})`);
  }

  const data = (await response.json()) as DailyForecastResponse;
  const daily = data.daily;
  if (
    !daily ||
    !Array.isArray(daily.time) ||
    !Array.isArray(daily.temperature_2m_max) ||
    !Array.isArray(daily.temperature_2m_min) ||
    !Array.isArray(daily.weather_code)
  ) {
    throw new Error("La API no devolvió un pronóstico válido");
  }

  return daily.time.map((date, index) => ({
    date,
    maxC: daily.temperature_2m_max[index] ?? 0,
    minC: daily.temperature_2m_min[index] ?? 0,
    weatherCode: daily.weather_code[index] ?? 0,
  }));
}
