import { selectCity } from "../presentation/input.ts";
import { showMessage } from "../presentation/output.ts";
import { loadCities, saveCities } from "../storage/citiesStorage.ts";
import { loadSettings, saveSettings } from "../storage/settingsStorage.ts";
import { formatCity } from "../utils/format.ts";

export async function removeCity(): Promise<void> {
  const cities = await loadCities();
  const city = selectCity(cities, "Selecciona una ciudad para eliminar:");
  if (!city) return;

  await saveCities(cities.filter((candidate) => candidate.id !== city.id));

  const settings = await loadSettings();
  if (settings.defaultCityId === city.id) {
    await saveSettings({ ...settings, defaultCityId: null });
  }

  showMessage(`Eliminada: ${formatCity(city)}`);
}
