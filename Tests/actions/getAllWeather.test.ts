import { describe, expect, test } from "bun:test";
import { getAllWeather } from "../../src/actions/getAllWeather.ts";
import { jsonResponse, withFetch } from "../helpers/fetch.ts";
import { currentWeatherResponse, emptyStore, sampleStore } from "../helpers/fixtures.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("getAllWeather", () => {
  test("avisa cuando no hay ciudades", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await getAllWeather();
    });

    expect(text).toContain("No hay ciudades registradas");
  });

  test("muestra el clima de todas las ciudades", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withFetch(() => jsonResponse(currentWeatherResponse), () => getAllWeather());
    });

    expect(text).toContain("Bogotá, Bogotá D.C., Colombia — 14.4 °C");
    expect(text).toContain("Madrid, Comunidad Autónoma de Madrid, España — 14.4 °C");
    expect(text.match(/14\.4 °C/g)).toHaveLength(2);
  });

  test("continúa si una ciudad falla", async () => {
    let calls = 0;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withFetch(
        () => {
          calls += 1;
          return calls === 1 ? jsonResponse({}, 500) : jsonResponse(currentWeatherResponse);
        },
        () => getAllWeather(),
      );
    });

    expect(text).toContain("HTTP 500");
    expect(text).toContain("14.4 °C");
  });

  test("respeta Fahrenheit", async () => {
    const text = await runScenario(async ({ write }) => {
      await write({ ...sampleStore(), unit: "F" });
      await withFetch(() => jsonResponse(currentWeatherResponse), () => getAllWeather());
    });

    expect(text).toContain("57.9 °F / 14.4 °C");
  });
});
