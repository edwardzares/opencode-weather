import { describe, expect, test } from "bun:test";
import { getForecast } from "../../src/actions/getForecast.ts";
import { jsonResponse, mockFetch, withFetch } from "../helpers/fetch.ts";
import {
  dailyForecastResponse,
  emptyStore,
  sampleStore,
} from "../helpers/fixtures.ts";
import { withPrompt } from "../helpers/prompt.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("getForecast", () => {
  test("avisa cuando no hay ciudades", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await getForecast();
    });

    expect(text).toContain("No hay ciudades registradas.");
  });

  test("muestra la tabla del pronóstico", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["1"], () =>
        withFetch(() => jsonResponse(dailyForecastResponse), () => getForecast()),
      );
    });

    expect(text).toContain("Pronóstico 2 días — Bogotá, Bogotá D.C., Colombia");
    expect(text).toContain("Lun 26/10");
    expect(text).toContain("Máx/Mín °C");
    expect(text).toContain("Máx/Mín °F");
  });

  test("muestra el error de red", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["1"], () =>
        withFetch(() => jsonResponse({}, 500), () => getForecast()),
      );
    });

    expect(text).toContain("HTTP 500");
  });

  test("un índice inválido no llama a la API", async () => {
    await runScenario(async ({ write }) => {
      await write(sampleStore());

      const fetchMock = mockFetch(() => jsonResponse(dailyForecastResponse));
      try {
        await withPrompt(["9"], () => getForecast());
      } finally {
        fetchMock.restore();
      }

      expect(fetchMock.calls).toHaveLength(0);
    });
  });
});
