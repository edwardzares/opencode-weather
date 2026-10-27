import type { City, DailyForecast, Store, Unit } from "./types.ts";

const LINE = "═".repeat(40);
const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const DAY_WIDTH = 11;
const WEATHER_WIDTH = 20;
const CELSIUS_WIDTH = 15;

export function renderMenu(store: Store): void {
  console.log(LINE);
  console.log("              MY CLIMA");
  console.log(LINE);
  console.log("  1. Clima de ciudad default");
  console.log(`  2. Clima de todas las ciudades (${store.cities.length})`);
  console.log("  3. Buscar y agregar ciudad");
  console.log("  4. Eliminar ciudad");
  console.log("  5. Establecer ciudad default");
  console.log("  6. Pronóstico 7 días");
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

const WEATHER_DESCRIPTIONS: Record<number, string> = {
  0: "Despejado",
  1: "Mayormente despejado",
  2: "Parcialmente nublado",
  3: "Nublado",
  45: "Niebla",
  48: "Niebla con escarcha",
  51: "Llovizna ligera",
  53: "Llovizna moderada",
  55: "Llovizna densa",
  56: "Llovizna helada ligera",
  57: "Llovizna helada densa",
  61: "Lluvia ligera",
  63: "Lluvia moderada",
  65: "Lluvia fuerte",
  66: "Lluvia helada ligera",
  67: "Lluvia helada fuerte",
  71: "Nieve ligera",
  73: "Nieve moderada",
  75: "Nieve fuerte",
  77: "Granos de nieve",
  80: "Chubascos ligeros",
  81: "Chubascos moderados",
  82: "Chubascos fuertes",
  85: "Chubascos de nieve ligeros",
  86: "Chubascos de nieve fuertes",
  95: "Tormenta",
  96: "Tormenta con granizo ligero",
  99: "Tormenta con granizo fuerte",
};

export function describeWeather(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? "Desconocido";
}

export function formatDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? "";
  return `${weekday} ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function renderForecast(city: City, days: DailyForecast[]): void {
  console.log(`  Pronóstico 7 días — ${formatCity(city)}`);
  console.log("");
  console.log(
    `  ${"Día".padEnd(DAY_WIDTH)}${"Clima".padEnd(WEATHER_WIDTH)}${"Máx/Mín °C".padEnd(CELSIUS_WIDTH)}Máx/Mín °F`,
  );

  for (const day of days) {
    const weather = truncate(describeWeather(day.weatherCode), WEATHER_WIDTH - 1);
    const celsius = `${day.maxC.toFixed(1)} / ${day.minC.toFixed(1)}`;
    const fahrenheitMax = (day.maxC * 9) / 5 + 32;
    const fahrenheitMin = (day.minC * 9) / 5 + 32;
    const fahrenheit = `${fahrenheitMax.toFixed(1)} / ${fahrenheitMin.toFixed(1)}`;

    console.log(
      `  ${formatDay(day.date).padEnd(DAY_WIDTH)}${weather.padEnd(WEATHER_WIDTH)}${celsius.padEnd(CELSIUS_WIDTH)}${fahrenheit}`,
    );
  }
}
