import { selectCity } from "../presentation/input.ts";
import { showMessage } from "../presentation/output.ts";
import { loadCities } from "../storage/citiesStorage.ts";
import { loadSettings, saveSettings } from "../storage/settingsStorage.ts";
import { formatCity } from "../utils/format.ts";

export async function setDefaultCity(): Promise<void> {
  const cities = await loadCities();
  const city = selectCity(cities, "Selecciona la ciudad default:");
  if (!city) return;

  const settings = await loadSettings();
  await saveSettings({ ...settings, defaultCityId: city.id });

  showMessage(`Ciudad default: ${formatCity(city)}`);
}
