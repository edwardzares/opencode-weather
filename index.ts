import { geocodeCity, getTemperature } from "./src/api.ts";
import {
  addCity,
  loadStore,
  removeCity,
  saveStore,
  setDefaultCity,
  setUnit,
} from "./src/store.ts";
import { ask, formatCity, formatTemperature, renderMenu, unitLabel } from "./src/ui.ts";
import type { City, Store } from "./src/types.ts";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Error desconocido";
}

async function showCityWeather(store: Store, city: City): Promise<void> {
  try {
    const temperature = await getTemperature(city.latitude, city.longitude);
    console.log(`  ${formatCity(city)} — ${formatTemperature(temperature, store.unit)}`);
  } catch (error) {
    console.log(`  ${formatCity(city)} — ${errorMessage(error)}`);
  }
}

async function actionDefault(store: Store): Promise<void> {
  const city = store.cities.find((c) => c.id === store.defaultCityId);
  if (!city) {
    console.log("\n  No hay ciudad default. Usa la opción 5 para establecerla.\n");
    return;
  }
  console.log("");
  await showCityWeather(store, city);
  console.log("");
}

async function actionAll(store: Store): Promise<void> {
  if (store.cities.length === 0) {
    console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar.\n");
    return;
  }
  console.log("");
  for (const city of store.cities) {
    await showCityWeather(store, city);
  }
  console.log("");
}

async function actionAdd(store: Store): Promise<void> {
  const name = ask("  Nombre de la ciudad: ");
  if (!name) return;

  try {
    const city = await geocodeCity(name);
    if (!city) {
      console.log(`\n  Ciudad "${name}" no encontrada.\n`);
      return;
    }
    if (store.cities.some((c) => c.id === city.id)) {
      console.log(`\n  "${formatCity(city)}" ya está registrada.\n`);
      return;
    }

    addCity(store, city);
    if (store.defaultCityId === null) {
      setDefaultCity(store, city.id);
    }
    await saveStore(store);
    console.log(`\n  Agregada: ${formatCity(city)}\n`);
  } catch (error) {
    console.log(`\n  ${errorMessage(error)}\n`);
  }
}

function selectCity(store: Store, title: string): City | null {
  if (store.cities.length === 0) {
    console.log("\n  No hay ciudades registradas.\n");
    return null;
  }

  console.log(`\n  ${title}`);
  store.cities.forEach((city, index) => {
    console.log(`  ${index + 1}. ${formatCity(city)}`);
  });

  const index = Number(ask("  Número: "));
  if (!Number.isInteger(index) || index < 1 || index > store.cities.length) {
    console.log("\n  Opción inválida.\n");
    return null;
  }
  return store.cities[index - 1] ?? null;
}

async function actionRemove(store: Store): Promise<void> {
  const city = selectCity(store, "Selecciona una ciudad para eliminar:");
  if (!city) return;
  removeCity(store, city.id);
  await saveStore(store);
  console.log(`\n  Eliminada: ${formatCity(city)}\n`);
}

async function actionSetDefault(store: Store): Promise<void> {
  const city = selectCity(store, "Selecciona la ciudad default:");
  if (!city) return;
  setDefaultCity(store, city.id);
  await saveStore(store);
  console.log(`\n  Ciudad default: ${formatCity(city)}\n`);
}

async function actionSettings(store: Store): Promise<void> {
  console.log(`\n  Unidad actual: ${unitLabel(store.unit)}`);
  console.log("  1. Celsius (°C)");
  console.log("  2. Fahrenheit (°F)");

  const option = ask("  Opción: ");
  if (option === "1") {
    setUnit(store, "C");
    await saveStore(store);
    console.log("\n  Unidad establecida: °C\n");
  } else if (option === "2") {
    setUnit(store, "F");
    await saveStore(store);
    console.log("\n  Unidad establecida: °F\n");
  } else {
    console.log("\n  Opción inválida.\n");
  }
}

async function main(): Promise<void> {
  const store = await loadStore();

  while (true) {
    console.log("");
    renderMenu(store);

    const option = ask("  Selecciona una opción: ");
    switch (option) {
      case "1":
        await actionDefault(store);
        break;
      case "2":
        await actionAll(store);
        break;
      case "3":
        await actionAdd(store);
        break;
      case "4":
        await actionRemove(store);
        break;
      case "5":
        await actionSetDefault(store);
        break;
      case "8":
        await actionSettings(store);
        break;
      case "9":
        console.log("\n  ¡Hasta luego!\n");
        return;
      default:
        console.log("\n  Opción inválida.\n");
    }
  }
}

await main();
