import { describe, expect, test } from "bun:test";
import { dispatchOption, main } from "../src/index.ts";
import { jsonResponse, withFetch } from "./helpers/fetch.ts";
import { currentWeatherResponse, sampleStore } from "./helpers/fixtures.ts";
import { withPrompt } from "./helpers/prompt.ts";
import { runScenario } from "./helpers/scenario.ts";

describe("dispatchOption", () => {
  test("la opción 9 termina el bucle", async () => {
    const text = await runScenario(async () => {
      const keepRunning = await dispatchOption("9");
      expect(keepRunning).toBe(false);
    });

    expect(text).toContain("¡Hasta luego!");
  });

  test("una opción inválida avisa y continúa", async () => {
    const text = await runScenario(async () => {
      const keepRunning = await dispatchOption("7");
      expect(keepRunning).toBe(true);
    });

    expect(text).toContain("Opción inválida.");
  });

  test("la opción 1 despacha el clima", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withFetch(() => jsonResponse(currentWeatherResponse), async () => {
        const keepRunning = await dispatchOption("1");
        expect(keepRunning).toBe(true);
      });
    });

    expect(text).toContain("Bogotá, Bogotá D.C., Colombia — 14.4 °C");
  });
});

describe("main", () => {
  test("dibuja el menú y termina con la opción 9", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["9"], () => main());
    });

    expect(text).toContain("MY CLIMA");
    expect(text).toContain("2. Clima de todas las ciudades (2)");
    expect(text).toContain("¡Hasta luego!");
  });
});
