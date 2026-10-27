import { loadCities } from "../storage/citiesStorage.ts";
import { showCityList, showMessage } from "../presentation/output.ts";

export async function listCities(): Promise<void> {
  const cities = await loadCities();
  if (cities.length === 0) {
    showMessage("No hay ciudades registradas.");
    return;
  }

  showCityList(cities, "Ciudades guardadas:");
}
