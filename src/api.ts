import type {
  City,
  DailyForecast,
  DailyForecastResponse,
  ForecastResponse,
  GeocodingResponse,
} from "./types.ts";

const GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export async function geocodeCity(name: string): Promise<City | null> {
  const url = new URL(GEOCODING_URL);
  url.searchParams.set("name", name);
  url.searchParams.set("count", "1");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error de red al buscar la ciudad (HTTP ${response.status})`);
  }

  const data = (await response.json()) as GeocodingResponse;
  const result = data.results?.[0];
  if (!result) return null;

  return {
    id: String(result.id),
    name: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

export async function getTemperature(latitude: number, longitude: number): Promise<number> {
  const url = new URL(FORECAST_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set("current", "temperature_2m");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error de red al consultar el clima (HTTP ${response.status})`);
  }

  const data = (await response.json()) as ForecastResponse;
  const temperature = data.current?.temperature_2m;
  if (typeof temperature !== "number") {
    throw new Error("La API no devolvió una temperatura válida");
  }

  return temperature;
}

export async function getForecast(
  latitude: number,
  longitude: number,
  days = 7,
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
