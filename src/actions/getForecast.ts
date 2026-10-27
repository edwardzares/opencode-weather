import { getForecast as fetchForecast } from "../api/weather.ts";
import { selectCity } from "../presentation/input.ts";
import { showError, showForecast } from "../presentation/output.ts";
import { loadCities } from "../storage/citiesStorage.ts";
import { errorMessage } from "../utils/errors.ts";

export async function getForecast(): Promise<void> {
  const cities = await loadCities();
  const city = selectCity(cities, "Selecciona una ciudad para el pronóstico:");
  if (!city) return;

  try {
    const days = await fetchForecast(city.latitude, city.longitude);
    console.log("");
    showForecast(city, days);
    console.log("");
  } catch (error) {
    showError(errorMessage(error));
  }
}
