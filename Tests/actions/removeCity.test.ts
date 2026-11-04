import { describe, expect, test } from "bun:test";
import { removeCity } from "../../src/actions/removeCity.ts";
import { loadStore } from "../../src/storage/dataFile.ts";
import { bogota, emptyStore, madrid, sampleStore } from "../helpers/fixtures.ts";
import { withPrompt } from "../helpers/prompt.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("removeCity", () => {
  test("avisa cuando no hay ciudades", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await removeCity();
    });

    expect(text).toContain("No hay ciudades registradas.");
  });

  test("rechaza un índice inválido sin borrar nada", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["9"], () => removeCity());
      store = await loadStore();
    });

    expect(text).toContain("Opción inválida.");
    expect(store?.cities).toHaveLength(2);
  });

  test("elimina una ciudad que no es la default", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["2"], () => removeCity());
      store = await loadStore();
    });

    expect(text).toContain("Eliminada: Madrid, Comunidad Autónoma de Madrid, España");
    expect(store?.cities).toEqual([bogota]);
    expect(store?.defaultCityId).toBe(bogota.id);
  });

  test("limpia la default al eliminar esa ciudad", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["1"], () => removeCity());
      store = await loadStore();
    });

    expect(store?.cities).toEqual([madrid]);
    expect(store?.defaultCityId).toBeNull();
  });

  test("cancelar la selección no elimina nada", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt([], () => removeCity());
      store = await loadStore();
    });

    expect(store?.cities).toHaveLength(2);
  });
});
