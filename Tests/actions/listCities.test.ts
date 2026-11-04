import { describe, expect, test } from "bun:test";
import { listCities } from "../../src/actions/listCities.ts";
import { emptyStore, sampleStore } from "../helpers/fixtures.ts";
import { runScenario } from "../helpers/scenario.ts";

describe("listCities", () => {
  test("avisa cuando no hay ciudades", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(emptyStore());
      await listCities();
    });

    expect(text).toContain("No hay ciudades registradas.");
  });

  test("lista las ciudades numeradas", async () => {
    const text = await runScenario(async ({ write }) => {
      await write(sampleStore());
      await listCities();
    });

    expect(text).toContain("Ciudades guardadas:");
    expect(text).toContain("1. Bogotá, Bogotá D.C., Colombia");
    expect(text).toContain("2. Madrid, Comunidad Autónoma de Madrid, España");
  });
});
