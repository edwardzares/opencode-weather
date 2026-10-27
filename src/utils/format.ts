import type { City } from "../types/City.ts";
import type { Unit } from "../types/Settings.ts";
import { WEEKDAYS, WEATHER_DESCRIPTIONS } from "./constants.ts";

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

export function describeWeather(code: number): string {
  return WEATHER_DESCRIPTIONS[code] ?? "Desconocido";
}

export function formatDay(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;

  const weekday = WEEKDAYS[new Date(Date.UTC(year, month - 1, day)).getUTCDay()] ?? "";
  return `${weekday} ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
}

export function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}
