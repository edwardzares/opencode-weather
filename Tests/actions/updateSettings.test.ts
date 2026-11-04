import { describe, expect, test } from "bun:test";
import { updateSettings } from "../../src/actions/updateSettings.ts";
import { loadStore } from "../../src/storage/dataFile.ts";
import { bogota, madrid, sampleStore } from "../helpers/fixtures.ts";
import { withPrompt } from "../helpers/prompt.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("updateSettings", () => {
  test("cambia a Fahrenheit y conserva las ciudades", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["2"], () => updateSettings());
      store = await loadStore();
    });

    expect(text).toContain("Unidad establecida: °F");
    expect(store?.unit).toBe("F");
    expect(store?.cities).toEqual([bogota, madrid]);
  });

  test("cambia a Celsius", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write({ ...sampleStore(), unit: "F" });
      await withPrompt(["1"], () => updateSettings());
      store = await loadStore();
    });

    expect(text).toContain("Unidad actual: °F");
    expect(text).toContain("Unidad establecida: °C");
    expect(store?.unit).toBe("C");
  });

  test("una opción inválida no cambia la unidad", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["9"], () => updateSettings());
      store = await loadStore();
    });

    expect(text).toContain("Opción inválida.");
    expect(store?.unit).toBe("C");
  });

  test("cancelar no cambia la unidad", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    await runScenario(async ({ write }) => {
      await write({ ...sampleStore(), unit: "F" });
      await withPrompt([], () => updateSettings());
      store = await loadStore();
    });

    expect(store?.unit).toBe("F");
  });
});
