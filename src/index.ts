import { addCity } from "./actions/addCity.ts";
import { getAllWeather } from "./actions/getAllWeather.ts";
import { getForecast } from "./actions/getForecast.ts";
import { getWeather } from "./actions/getWeather.ts";
import { removeCity } from "./actions/removeCity.ts";
import { setDefaultCity } from "./actions/setDefaultCity.ts";
import { updateSettings } from "./actions/updateSettings.ts";
import { askMenuOption } from "./presentation/input.ts";
import { renderMenu } from "./presentation/menu.ts";
import { showMessage } from "./presentation/output.ts";
import { loadCities } from "./storage/citiesStorage.ts";
import { loadSettings } from "./storage/settingsStorage.ts";

const actions: Record<string, () => Promise<void>> = {
  "1": getWeather,
  "2": getAllWeather,
  "3": addCity,
  "4": removeCity,
  "5": setDefaultCity,
  "6": getForecast,
  "8": updateSettings,
};

export async function dispatchOption(option: string): Promise<boolean> {
  if (option === "9") {
    showMessage("¡Hasta luego!");
    return false;
  }

  const action = actions[option];
  if (!action) {
    showMessage("Opción inválida.");
    return true;
  }

  await action();
  return true;
}

export async function main(): Promise<void> {
  while (true) {
    const cities = await loadCities();
    const settings = await loadSettings();

    console.log("");
    renderMenu(cities, settings);

    const keepRunning = await dispatchOption(askMenuOption());
    if (!keepRunning) return;
  }
}

if (import.meta.main) {
  await main();
}
