import { describe, expect, test } from "bun:test";
import {
  showCityList,
  showCityWeather,
  showError,
  showForecast,
  showMessage,
} from "../../src/presentation/output.ts";
import type { DailyForecast } from "../../src/types/Weather.ts";
import { bogota, madrid } from "../helpers/fixtures.ts";
import { captureConsole } from "../helpers/console.ts";

function capture(run: () => void): string {
  const consoleCapture = captureConsole();
  try {
    run();
    return consoleCapture.text();
  } finally {
    consoleCapture.restore();
  }
}

describe("showMessage", () => {
  test("imprime el mensaje con líneas en blanco", () => {
    expect(capture(() => showMessage("hola"))).toBe("\n  hola\n");
  });
});

describe("showError", () => {
  test("imprime el error", () => {
    expect(capture(() => showError("boom"))).toContain("boom");
  });
});

describe("showCityWeather", () => {
  test("muestra ciudad y ambas unidades", () => {
    const text = capture(() => showCityWeather(bogota, 14.4, "C"));
    expect(text).toBe("  Bogotá, Bogotá D.C., Colombia — 14.4 °C / 57.9 °F");
  });

  test("respeta el orden Fahrenheit", () => {
    const text = capture(() => showCityWeather(bogota, 14.4, "F"));
    expect(text).toBe("  Bogotá, Bogotá D.C., Colombia — 57.9 °F / 14.4 °C");
  });
});

describe("showCityList", () => {
  test("numera las ciudades", () => {
    const text = capture(() => showCityList([bogota, madrid], "Ciudades:"));
    expect(text).toContain("Ciudades:");
    expect(text).toContain("  1. Bogotá, Bogotá D.C., Colombia");
    expect(text).toContain("  2. Madrid, Comunidad Autónoma de Madrid, España");
  });
});

describe("showForecast", () => {
  const days: DailyForecast[] = [
    { date: "2026-10-26", maxC: 21.6, minC: 10.7, weatherCode: 51 },
    { date: "2026-10-27", maxC: 23.9, minC: 9.5, weatherCode: 55 },
  ];

  test("incluye encabezado y columnas fijas", () => {
    const text = capture(() => showForecast(bogota, days));
    expect(text).toContain("Pronóstico 2 días — Bogotá, Bogotá D.C., Colombia");
    expect(text).toContain("Día");
    expect(text).toContain("Clima");
    expect(text).toContain("Máx/Mín °C");
    expect(text).toContain("Máx/Mín °F");
  });

  test("convierte cada día a °C y °F", () => {
    const text = capture(() => showForecast(bogota, days));
    expect(text).toContain("Lun 26/10");
    expect(text).toContain("Llovizna ligera");
    expect(text).toContain("21.6 / 10.7");
    expect(text).toContain("70.9 / 51.3");
  });

  test("recorta descripciones largas al ancho de la columna", () => {
    const text = capture(() =>
      showForecast(bogota, [
        { date: "2026-10-28", maxC: 1, minC: 0, weatherCode: 85 },
      ]),
    );
    expect(text).toContain("Chubascos de nieve…");
  });
});
