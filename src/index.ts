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

async function main(): Promise<void> {
  while (true) {
    const cities = await loadCities();
    const settings = await loadSettings();

    console.log("");
    renderMenu(cities, settings);

    const option = askMenuOption();

    switch (option) {
      case "1":
        await getWeather();
        break;
      case "2":
        await getAllWeather();
        break;
      case "3":
        await addCity();
        break;
      case "4":
        await removeCity();
        break;
      case "5":
        await setDefaultCity();
        break;
      case "6":
        await getForecast();
        break;
      case "8":
        await updateSettings();
        break;
      case "9":
        showMessage("¡Hasta luego!");
        return;
      default:
        showMessage("Opción inválida.");
    }
  }
}

await main();
