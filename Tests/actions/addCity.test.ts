import { describe, expect, test } from "bun:test";
import { addCity } from "../../src/actions/addCity.ts";
import { loadStore } from "../../src/storage/dataFile.ts";
import { jsonResponse, mockFetch, withFetch } from "../helpers/fetch.ts";
import {
  bogota,
  emptyStore,
  geocodingResponse,
  sampleStore,
} from "../helpers/fixtures.ts";
import { withPrompt } from "../helpers/prompt.ts";
import { runScenario } from "../helpers/scenario.ts";

const limaResponse = {
  results: [
    {
      id: 3936456,
      name: "Lima",
      latitude: -12.04318,
      longitude: -77.02824,
      country: "Perú",
      admin1: "Provincia de Lima",
    },
  ],
};

describe("addCity", () => {
  test("no hace nada si el nombre está vacío", async () => {
    await runScenario(async ({ write }) => {
      await write(emptyStore());

      const fetchMock = mockFetch(() => jsonResponse(limaResponse));
      try {
        await withPrompt([""], () => addCity());
      } finally {
        fetchMock.restore();
      }

      expect(fetchMock.calls).toHaveLength(0);
    });
  });

  test("avisa cuando la ciudad no existe", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await withPrompt(["Atlantis"], () =>
        withFetch(() => jsonResponse({}), () => addCity()),
      );
    });

    expect(text).toContain('Ciudad "Atlantis" no encontrada.');
  });

  test("agrega la ciudad y la vuelve default si no había", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await withPrompt(["Lima"], () =>
        withFetch(() => jsonResponse(limaResponse), () => addCity()),
      );
      store = await loadStore();
    });

    expect(text).toContain("Agregada: Lima, Provincia de Lima, Perú");
    expect(store?.cities).toHaveLength(1);
    expect(store?.cities[0]?.name).toBe("Lima");
    expect(store?.defaultCityId).toBe("3936456");
  });

  test("no cambia la default si ya existía", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["Lima"], () =>
        withFetch(() => jsonResponse(limaResponse), () => addCity()),
      );
      store = await loadStore();
    });

    expect(store?.defaultCityId).toBe(bogota.id);
    expect(store?.cities).toHaveLength(3);
  });

  test("rechaza ciudades duplicadas", async () => {
    let store: Awaited<ReturnType<typeof loadStore>> | undefined;

    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await withPrompt(["Bogotá"], () =>
        withFetch(() => jsonResponse(geocodingResponse), () => addCity()),
      );
      store = await loadStore();
    });

    expect(text).toContain("ya está registrada");
    expect(store?.cities).toHaveLength(2);
  });

  test("muestra el error de red", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await withPrompt(["Lima"], () =>
        withFetch(() => jsonResponse({}, 500), () => addCity()),
      );
    });

    expect(text).toContain("HTTP 500");
  });
});
