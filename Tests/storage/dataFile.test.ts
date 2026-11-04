import { describe, expect, test } from "bun:test";
import { loadStore, saveStore } from "../../src/storage/dataFile.ts";
import { emptyStore, sampleStore } from "../helpers/fixtures.ts";
import { withTempDataFile } from "../helpers/tempData.ts";

describe("loadStore", () => {
  test("archivo inexistente devuelve store vacío", async () => {
    await withTempDataFile(async () => {
      expect(await loadStore()).toEqual(emptyStore());
    });
  });

  test("JSON corrupto devuelve store vacío", async () => {
    await withTempDataFile(async ({ path }) => {
      await Bun.write(path, "{ esto no es json");
      expect(await loadStore()).toEqual(emptyStore());
    });
  });

  test("normaliza una unidad inválida a Celsius", async () => {
    await withTempDataFile(async ({ write }) => {
      await write({ cities: [], defaultCityId: null, unit: "X" });
      expect((await loadStore()).unit).toBe("C");
    });
  });

  test("normaliza cities inválido a lista vacía", async () => {
    await withTempDataFile(async ({ write }) => {
      await write({ cities: "no-es-lista", defaultCityId: null, unit: "F" });
      const store = await loadStore();
      expect(store.cities).toEqual([]);
      expect(store.unit).toBe("F");
    });
  });

  test("usa null cuando falta defaultCityId", async () => {
    await withTempDataFile(async ({ write }) => {
      await write({ cities: [], unit: "C" });
      expect((await loadStore()).defaultCityId).toBeNull();
    });
  });
});

describe("saveStore", () => {
  test("round-trip conserva el store completo", async () => {
    await withTempDataFile(async () => {
      const store = sampleStore();
      await saveStore(store);
      expect(await loadStore()).toEqual(store);
    });
  });

  test("escribe JSON legible con salto de línea final", async () => {
    await withTempDataFile(async ({ path }) => {
      await saveStore(sampleStore());
      const raw = await Bun.file(path).text();

      expect(raw.endsWith("\n")).toBe(true);
      expect(raw).toContain('\n  "cities": [');
    });
  });
});
