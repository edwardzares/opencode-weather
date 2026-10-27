import type { City } from "../types/City.ts";
import type { Unit } from "../types/Settings.ts";
import { showCityList, showMessage } from "./output.ts";

export function ask(message: string): string {
  return (prompt(message) ?? "").trim();
}

export function askMenuOption(): string {
  return ask("  Selecciona una opción: ");
}

export function askCityName(): string {
  return ask("  Nombre de la ciudad: ");
}

export function askUnit(): Unit | null {
  const option = ask("  Opción: ");
  if (option === "1") return "C";
  if (option === "2") return "F";
  return null;
}

export function selectCity(cities: City[], title: string): City | null {
  if (cities.length === 0) {
    showMessage("No hay ciudades registradas.");
    return null;
  }

  showCityList(cities, title);

  const index = Number(ask("  Número: "));
  if (!Number.isInteger(index) || index < 1 || index > cities.length) {
    showMessage("Opción inválida.");
    return null;
  }
  return cities[index - 1] ?? null;
}
