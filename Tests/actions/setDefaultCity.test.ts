import { describe, expect, test } from "bun:test";
import { setDefaultCity } from "../../src/actions/setDefaultCity.ts";
import { loadStore } from "../../src/storage/dataFile.ts";
import { bogota, emptyStore, madrid, sampleStore } from "../helpers/fixtures.ts";
import { withPrompt } from "../helpers/prompt.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("setDefaultCity", () => {
  test("avisa cuando no hay ciudades", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await setDefaultCity();
    });

    expect(text).toContain("No hay ciudades registradas.");
  });

  test("cambia la ciudad default", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["2"], () => setDefaultCity());
      store = await loadStore();
    });

    expect(text).toContain("Ciudad default: Madrid, Comunidad Autónoma de Madrid, España");
    expect(store?.defaultCityId).toBe(madrid.id);
    expect(store?.cities).toEqual([bogota, madrid]);
  });

  test("un índice inválido no cambia la default", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["0"], () => setDefaultCity());
      store = await loadStore();
    });

    expect(text).toContain("Opción inválida.");
    expect(store?.defaultCityId).toBe(bogota.id);
  });
});
