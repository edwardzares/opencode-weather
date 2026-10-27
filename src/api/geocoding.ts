import type { City } from "../types/City.ts";
import type { GeocodingResponse } from "../types/Geocoding.ts";
import { GEOCODING_URL } from "../utils/constants.ts";

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
