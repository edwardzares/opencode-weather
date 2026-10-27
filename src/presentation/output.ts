import type { City } from "../types/City.ts";
import type { DailyForecast } from "../types/Weather.ts";
import type { Unit } from "../types/Settings.ts";
import { CELSIUS_WIDTH, DAY_WIDTH, WEATHER_WIDTH } from "../utils/constants.ts";
import { colors } from "../utils/colors.ts";
import {
  describeWeather,
  formatCity,
  formatDay,
  formatTemperature,
  truncate,
} from "../utils/format.ts";

export function showMessage(message: string): void {
  console.log(`\n  ${message}\n`);
}

export function showError(message: string): void {
  console.log(`\n  ${colors.red(message)}\n`);
}

export function showCityWeather(city: City, temperatureC: number, unit: Unit): void {
  console.log(`  ${formatCity(city)} — ${formatTemperature(temperatureC, unit)}`);
}

export function showCityList(cities: City[], title: string): void {
  console.log(`\n  ${title}`);
  cities.forEach((city, index) => {
    console.log(`  ${index + 1}. ${formatCity(city)}`);
  });
}

export function showForecast(city: City, days: DailyForecast[]): void {
  console.log(`  Pronóstico ${days.length} días — ${formatCity(city)}`);
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
