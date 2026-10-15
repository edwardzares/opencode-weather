import type { City, ForecastResponse, GeocodingResponse } from "./types.ts";

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
