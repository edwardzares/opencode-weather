import { describe, expect, test } from "bun:test";
import { getWeather } from "../../src/actions/getWeather.ts";
import { jsonResponse, withFetch } from "../helpers/fetch.ts";
import { currentWeatherResponse, emptyStore, sampleStore } from "../helpers/fixtures.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("getWeather", () => {
  test("avisa cuando no hay ciudad default", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await getWeather();
    });

    expect(text).toContain("No hay ciudad default");
  });

  test("muestra el clima de la ciudad default en Celsius", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withFetch(() => jsonResponse(currentWeatherResponse), () => getWeather());
    });

    expect(text).toContain("Bogotá, Bogotá D.C., Colombia — 14.4 °C / 57.9 °F");
  });

  test("respeta la unidad Fahrenheit", async () => {
    const text = await runScenario(async ({ write }) => {
      await write({ ...sampleStore(), unit: "F" });
      await withFetch(() => jsonResponse(currentWeatherResponse), () => getWeather());
    });

    expect(text).toContain("57.9 °F / 14.4 °C");
  });

  test("muestra el error de red", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withFetch(() => jsonResponse({}, 500), () => getWeather());
    });

    expect(text).toContain("HTTP 500");
  });
});
