import type { City, Store, Unit } from "./types.ts";

const LINE = "═".repeat(40);

export function renderMenu(store: Store): void {
  console.log(LINE);
  console.log("         WEATHER CLI");
  console.log(LINE);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${store.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log(`  8. Ajustes (${unitLabel(store.unit)})`);
  console.log("  9. Salir");
  console.log(LINE);
}

export function ask(message: string): string {
  return (prompt(message) ?? "").trim();
}

export function unitLabel(unit: Unit): string {
  return unit === "C" ? "°C" : "°F";
}

export function formatCity(city: City): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(", ");
}

export function formatTemperature(celsius: number, unit: Unit): string {
  const fahrenheit = (celsius * 9) / 5 + 32;
  const c = `${celsius.toFixed(1)} °C`;
  const f = `${fahrenheit.toFixed(1)} °F`;
  return unit === "C" ? `${c} / ${f}` : `${f} / ${c}`;
}
