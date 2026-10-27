import { geocodeCity } from "../api/geocoding.ts";
import { askCityName } from "../presentation/input.ts";
import { showError, showMessage } from "../presentation/output.ts";
import { loadCities, saveCities } from "../storage/citiesStorage.ts";
import { loadSettings, saveSettings } from "../storage/settingsStorage.ts";
import { errorMessage } from "../utils/errors.ts";
import { formatCity } from "../utils/format.ts";

export async function addCity(): Promise<void> {
  const name = askCityName();
  if (!name) return;

  try {
    const city = await geocodeCity(name);
    if (!city) {
      showMessage(`Ciudad "${name}" no encontrada.`);
      return;
    }

    const cities = await loadCities();
    if (cities.some((candidate) => candidate.id === city.id)) {
      showMessage(`"${formatCity(city)}" ya está registrada.`);
      return;
    }

    cities.push(city);
    await saveCities(cities);

    const settings = await loadSettings();
    if (settings.defaultCityId === null) {
      await saveSettings({ ...settings, defaultCityId: city.id });
    }

    showMessage(`Agregada: ${formatCity(city)}`);
  } catch (error) {
    showError(errorMessage(error));
  }
}
