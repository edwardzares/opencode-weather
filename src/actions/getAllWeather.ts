import { loadCities } from "../storage/citiesStorage.ts";
import { loadSettings } from "../storage/settingsStorage.ts";
import { showMessage } from "../presentation/output.ts";
import { showWeatherForCity } from "./getWeather.ts";

export async function getAllWeather(): Promise<void> {
  const cities = await loadCities();
  const settings = await loadSettings();

  if (cities.length === 0) {
    showMessage("No hay ciudades registradas. Usa la opción 3 para agregar.");
    return;
  }

  console.log("");
  for (const city of cities) {
    await showWeatherForCity(city, settings.unit);
  }
  console.log("");
}
