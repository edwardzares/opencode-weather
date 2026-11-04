import { describe, expect, test } from "bun:test";
import { loadStore } from "../../src/storage/dataFile.ts";
import { loadSettings, saveSettings } from "../../src/storage/settingsStorage.ts";
import { bogota, madrid, sampleStore } from "../helpers/fixtures.ts";
import { withTempDataFile } from "../helpers/tempData.ts";

describe("loadSettings", () => {
  test("devuelve defaults sin archivo", async () => {
    await withTempDataFile(async () => {
      expect(await loadSettings()).toEqual({ defaultCityId: null, unit: "C" });
    });
  });

  test("devuelve settings guardados", async () => {
    await withTempDataFile(async ({ write }) => {
      await write({ ...sampleStore(), unit: "F" });
      expect(await loadSettings()).toEqual({ defaultCityId: bogota.id, unit: "F" });
    });
  });
});

describe("saveSettings", () => {
  test("guarda default y unidad", async () => {
    await withTempDataFile(async () => {
      await saveSettings({ defaultCityId: madrid.id, unit: "F" });
      expect(await loadSettings()).toEqual({ defaultCityId: madrid.id, unit: "F" });
    });
  });

  test("preserva las ciudades existentes", async () => {
    await withTempDataFile(async ({ write }) => {
      await write(sampleStore());
      await saveSettings({ defaultCityId: madrid.id, unit: "F" });

      const store = await loadStore();
      expect(store.cities).toEqual([bogota, madrid]);
      expect(store.defaultCityId).toBe(madrid.id);
      expect(store.unit).toBe("F");
    });
  });

  test("permite limpiar la ciudad default", async () => {
    await withTempDataFile(async ({ write }) => {
      await write(sampleStore());
      await saveSettings({ defaultCityId: null, unit: "C" });
      expect((await loadSettings()).defaultCityId).toBeNull();
    });
  });
});
