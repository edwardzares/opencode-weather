import { describe, expect, test } from "bun:test";
import { getCurrentWeather, getForecast } from "../../src/api/weather.ts";
import { jsonResponse, mockFetch, withFetch } from "../helpers/fetch.ts";
import { currentWeatherResponse, dailyForecastResponse } from "../helpers/fixtures.ts";

describe("getCurrentWeather", () => {
  test("devuelve la temperatura actual", async () => {
    const weather = await withFetch(
      () => jsonResponse(currentWeatherResponse),
      () => getCurrentWeather(4.6, -74.08),
    );
    expect(weather).toEqual({ temperatureC: 14.4 });
  });

  test("lanza error si falta la temperatura", async () => {
    await expect(
      withFetch(() => jsonResponse({ current: {} }), () => getCurrentWeather(0, 0)),
    ).rejects.toThrow("temperatura válida");
  });

  test("lanza error si la temperatura no es numérica", async () => {
    await expect(
      withFetch(
        () => jsonResponse({ current: { temperature_2m: null } }),
        () => getCurrentWeather(0, 0),
      ),
    ).rejects.toThrow("temperatura válida");
  });

  test("lanza error en HTTP no-OK", async () => {
    await expect(
      withFetch(() => jsonResponse({}, 502), () => getCurrentWeather(0, 0)),
    ).rejects.toThrow("HTTP 502");
  });

  test("envía coordenadas y current=temperature_2m", async () => {
    const mock = mockFetch(() => jsonResponse(currentWeatherResponse));
    try {
      await getCurrentWeather(4.6, -74.08);
    } finally {
      mock.restore();
    }

    const url = new URL(mock.calls[0] ?? "");
    expect(url.searchParams.get("latitude")).toBe("4.6");
    expect(url.searchParams.get("longitude")).toBe("-74.08");
    expect(url.searchParams.get("current")).toBe("temperature_2m");
  });
});

describe("getForecast", () => {
  test("mapea el pronóstico diario", async () => {
    const days = await withFetch(
      () => jsonResponse(dailyForecastResponse),
      () => getForecast(4.6, -74.08),
    );

    expect(days).toEqual([
      { date: "2026-10-26", maxC: 21.6, minC: 10.7, weatherCode: 51 },
      { date: "2026-10-27", maxC: 23.9, minC: 9.5, weatherCode: 55 },
    ]);
  });

  test("usa 7 días, timezone=auto y las variables diarias por defecto", async () => {
    const mock = mockFetch(() => jsonResponse(dailyForecastResponse));
    try {
      await getForecast(4.6, -74.08);
    } finally {
      mock.restore();
    }

    const url = new URL(mock.calls[0] ?? "");
    expect(url.searchParams.get("forecast_days")).toBe("7");
    expect(url.searchParams.get("timezone")).toBe("auto");
    expect(url.searchParams.get("daily")).toBe(
      "temperature_2m_max,temperature_2m_min,weather_code",
    );
  });

  test("respeta días personalizados", async () => {
    const mock = mockFetch(() => jsonResponse(dailyForecastResponse));
    try {
      await getForecast(4.6, -74.08, 3);
    } finally {
      mock.restore();
    }

    const url = new URL(mock.calls[0] ?? "");
    expect(url.searchParams.get("forecast_days")).toBe("3");
  });

  test("lanza error si falta daily", async () => {
    await expect(
      withFetch(() => jsonResponse({}), () => getForecast(0, 0)),
    ).rejects.toThrow("pronóstico válido");
  });

  test("lanza error si faltan arrays", async () => {
    await expect(
      withFetch(() => jsonResponse({ daily: { time: [] } }), () => getForecast(0, 0)),
    ).rejects.toThrow("pronóstico válido");
  });

  test("lanza error en HTTP no-OK", async () => {
    await expect(
      withFetch(() => jsonResponse({}, 503), () => getForecast(0, 0)),
    ).rejects.toThrow("HTTP 503");
  });

  test("rellena con 0 cuando faltan valores", async () => {
    const days = await withFetch(
      () =>
        jsonResponse({
          daily: {
            time: ["2026-10-26", "2026-10-27"],
            temperature_2m_max: [21.6],
            temperature_2m_min: [10.7],
            weather_code: [51],
          },
        }),
      () => getForecast(0, 0),
    );

    expect(days[1]).toEqual({
      date: "2026-10-27",
      maxC: 0,
      minC: 0,
      weatherCode: 0,
    });
  });
});
