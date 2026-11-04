import { describe, expect, test } from "bun:test";
import { loadCities, saveCities } from "../../src/storage/citiesStorage.ts";
import { loadStore } from "../../src/storage/dataFile.ts";
import { bogota, madrid, sampleStore } from "../helpers/fixtures.ts";
import { withTempDataFile } from "../helpers/tempData.ts";

describe("loadCities", () => {
  test("devuelve lista vacía sin archivo", async () => {
    await withTempDataFile(async () => {
      expect(await loadCities()).toEqual([]);
    });
  });

  test("devuelve las ciudades guardadas", async () => {
    await withTempDataFile(async ({ write }) => {
      await write(sampleStore());
      expect(await loadCities()).toEqual([bogota, madrid]);
    });
  });
});

describe("saveCities", () => {
  test("guarda las ciudades y las vuelve a cargar", async () => {
    await withTempDataFile(async () => {
      await saveCities([madrid]);
      expect(await loadCities()).toEqual([madrid]);
    });
  });

  test("preserva defaultCityId y unit existentes", async () => {
    await withTempDataFile(async ({ write }) => {
      await write({ ...sampleStore(), unit: "F" });
      await saveCities([madrid]);

      const store = await loadStore();
      expect(store.cities).toEqual([madrid]);
      expect(store.defaultCityId).toBe(bogota.id);
      expect(store.unit).toBe("F");
    });
  });

  test("permite guardar una lista vacía", async () => {
    await withTempDataFile(async ({ write }) => {
      await write(sampleStore());
      await saveCities([]);
      expect(await loadCities()).toEqual([]);
    });
  });
});
