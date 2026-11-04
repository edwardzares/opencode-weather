import { describe, expect, test } from "bun:test";
import {
  describeWeather,
  formatCity,
  formatDay,
  formatTemperature,
  truncate,
  unitLabel,
} from "../../src/utils/format.ts";
import type { City } from "../../src/types/City.ts";
import { bogota } from "../helpers/fixtures.ts";

describe("unitLabel", () => {
  test("Celsius", () => {
    expect(unitLabel("C")).toBe("°C");
  });

  test("Fahrenheit", () => {
    expect(unitLabel("F")).toBe("°F");
  });
});

describe("formatCity", () => {
  test("incluye ciudad, región y país", () => {
    expect(formatCity(bogota)).toBe("Bogotá, Bogotá D.C., Colombia");
  });

  test("omite región ausente", () => {
    const city: City = { ...bogota, admin1: undefined };
    expect(formatCity(city)).toBe("Bogotá, Colombia");
  });

  test("omite país ausente", () => {
    const city: City = { ...bogota, country: undefined };
    expect(formatCity(city)).toBe("Bogotá, Bogotá D.C.");
  });

  test("solo nombre", () => {
    const city: City = {
      id: "1",
      name: "Solo",
      latitude: 0,
      longitude: 0,
    };
    expect(formatCity(city)).toBe("Solo");
  });
});

describe("formatTemperature", () => {
  test("ordena Celsius primero", () => {
    expect(formatTemperature(0, "C")).toBe("0.0 °C / 32.0 °F");
  });

  test("ordena Fahrenheit primero", () => {
    expect(formatTemperature(0, "F")).toBe("32.0 °F / 0.0 °C");
  });

  test("redondea a un decimal", () => {
    expect(formatTemperature(12.34, "C")).toBe("12.3 °C / 54.2 °F");
  });

  test("maneja negativos", () => {
    expect(formatTemperature(-5, "C")).toBe("-5.0 °C / 23.0 °F");
  });

  test("punto de ebullición", () => {
    expect(formatTemperature(100, "C")).toBe("100.0 °C / 212.0 °F");
  });
});

describe("describeWeather", () => {
  test("códigos conocidos", () => {
    expect(describeWeather(0)).toBe("Despejado");
    expect(describeWeather(2)).toBe("Parcialmente nublado");
    expect(describeWeather(61)).toBe("Lluvia ligera");
    expect(describeWeather(95)).toBe("Tormenta");
  });

  test("código desconocido", () => {
    expect(describeWeather(999)).toBe("Desconocido");
  });
});

describe("formatDay", () => {
  test("lunes", () => {
    expect(formatDay("2026-10-26")).toBe("Lun 26/10");
  });

  test("domingo", () => {
    expect(formatDay("2026-11-01")).toBe("Dom 01/11");
  });

  test("fecha inválida se devuelve igual", () => {
    expect(formatDay("abc")).toBe("abc");
    expect(formatDay("")).toBe("");
  });
});

describe("truncate", () => {
  test("texto corto no cambia", () => {
    expect(truncate("Corto", 20)).toBe("Corto");
  });

  test("texto justo en el límite no cambia", () => {
    expect(truncate("Parcialmente nublado", 20)).toBe("Parcialmente nublado");
  });

  test("texto largo se recorta con elipsis", () => {
    expect(truncate("abcdef", 5)).toBe("abcd…");
  });

  test("respeta la longitud máxima", () => {
    expect(truncate("Parcialmente nublado", 19)).toHaveLength(19);
  });
});
