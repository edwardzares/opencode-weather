import type { City } from "../types/City.ts";
import type { Unit } from "../types/Settings.ts";
import { getCurrentWeather } from "../api/weather.ts";
import { loadCities } from "../storage/citiesStorage.ts";
import { loadSettings } from "../storage/settingsStorage.ts";
import { showCityWeather, showError, showMessage } from "../presentation/output.ts";
import { errorMessage } from "../utils/errors.ts";

export async function showWeatherForCity(city: City, unit: Unit): Promise<void> {
  try {
    const weather = await getCurrentWeather(city.latitude, city.longitude);
    showCityWeather(city, weather.temperatureC, unit);
  } catch (error) {
    showError(errorMessage(error));
  }
}

export async function getWeather(): Promise<void> {
  const cities = await loadCities();
  const settings = await loadSettings();
  const city = cities.find((candidate) => candidate.id === settings.defaultCityId);

  if (!city) {
    showMessage("No hay ciudad default. Usa la opción 5 para establecerla.");
    return;
  }

  console.log("");
  await showWeatherForCity(city, settings.unit);
  console.log("");
}
