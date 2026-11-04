import { describe, expect, test } from "bun:test";
import { geocodeCity } from "../../src/api/geocoding.ts";
import { jsonResponse, mockFetch, withFetch } from "../helpers/fetch.ts";
import { geocodingResponse } from "../helpers/fixtures.ts";

describe("geocodeCity", () => {
  test("mapea el primer resultado", async () => {
    const city = await withFetch(
      () => jsonResponse(geocodingResponse),
      () => geocodeCity("Bogotá"),
    );

    expect(city).toEqual({
      id: "3688689",
      name: "Bogotá",
      admin1: "Bogotá D.C.",
      country: "Colombia",
      latitude: 4.60971,
      longitude: -74.08175,
    });
  });

  test("devuelve null cuando no hay resultados", async () => {
    const city = await withFetch(() => jsonResponse({}), () => geocodeCity("Nada"));
    expect(city).toBeNull();
  });

  test("lanza error en HTTP no-OK", async () => {
    await expect(
      withFetch(() => jsonResponse({ error: true }, 500), () => geocodeCity("Bogotá")),
    ).rejects.toThrow("HTTP 500");
  });

  test("envía los parámetros correctos", async () => {
    const mock = mockFetch(() => jsonResponse(geocodingResponse));
    try {
      await geocodeCity("Bogotá");
    } finally {
      mock.restore();
    }

    expect(mock.calls).toHaveLength(1);
    const url = new URL(mock.calls[0] ?? "");
    expect(`${url.origin}${url.pathname}`).toBe(
      "https://geocoding-api.open-meteo.com/v1/search",
    );
    expect(url.searchParams.get("name")).toBe("Bogotá");
    expect(url.searchParams.get("count")).toBe("1");
    expect(url.searchParams.get("language")).toBe("es");
    expect(url.searchParams.get("format")).toBe("json");
  });
});
