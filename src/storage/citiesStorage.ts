import type { City } from "../types/City.ts";
import { loadStore, saveStore } from "./dataFile.ts";

export async function loadCities(): Promise<City[]> {
  return (await loadStore()).cities;
}

export async function saveCities(cities: City[]): Promise<void> {
  const store = await loadStore();
  await saveStore({ ...store, cities });
}
