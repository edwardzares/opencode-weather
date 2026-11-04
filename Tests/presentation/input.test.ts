import { describe, expect, test } from "bun:test";
import {
  ask,
  askCityName,
  askMenuOption,
  askUnit,
  selectCity,
} from "../../src/presentation/input.ts";
import { bogota, madrid } from "../helpers/fixtures.ts";
import { captureConsole } from "../helpers/console.ts";
import { withPrompt } from "../helpers/prompt.ts";

describe("ask", () => {
  test("recorta espacios", async () => {
    const value = await withPrompt(["  Bogotá  "], async () => ask("Ciudad: "));
    expect(value).toBe("Bogotá");
  });

  test("devuelve cadena vacía si se cancela", async () => {
    const value = await withPrompt([], async () => ask("Ciudad: "));
    expect(value).toBe("");
  });

  test("preguntas con etiquetas propias", async () => {
    const menu = await withPrompt(["1"], async () => askMenuOption());
    const city = await withPrompt(["Lima"], async () => askCityName());
    expect(menu).toBe("1");
    expect(city).toBe("Lima");
  });
});

describe("askUnit", () => {
  test("1 es Celsius", async () => {
    expect(await withPrompt(["1"], async () => askUnit())).toBe("C");
  });

  test("2 es Fahrenheit", async () => {
    expect(await withPrompt(["2"], async () => askUnit())).toBe("F");
  });

  test("cualquier otra cosa es inválida", async () => {
    expect(await withPrompt(["3"], async () => askUnit())).toBeNull();
    expect(await withPrompt([], async () => askUnit())).toBeNull();
  });
});

describe("selectCity", () => {
  test("sin ciudades muestra aviso", async () => {
    const capture = captureConsole();
    try {
      const city = await withPrompt(["1"], async () => selectCity([], "Elige:"));
      expect(city).toBeNull();
      expect(capture.text()).toContain("No hay ciudades registradas.");
    } finally {
      capture.restore();
    }
  });

  test("selecciona por número", async () => {
    const capture = captureConsole();
    try {
      const city = await withPrompt(["2"], async () =>
        selectCity([bogota, madrid], "Elige:"),
      );
      expect(city).toEqual(madrid);
      expect(capture.text()).toContain("Elige:");
      expect(capture.text()).toContain("2. Madrid");
    } finally {
      capture.restore();
    }
  });

  test("rechaza índices fuera de rango o no numéricos", async () => {
    for (const answer of ["9", "0", "abc", "-1"]) {
      const capture = captureConsole();
      try {
        const city = await withPrompt([answer], async () =>
          selectCity([bogota, madrid], "Elige:"),
        );
        expect(city).toBeNull();
        expect(capture.text()).toContain("Opción inválida.");
      } finally {
        capture.restore();
      }
    }
  });

  test("rechaza selección cancelada", async () => {
    const capture = captureConsole();
    try {
      const city = await withPrompt([], async () => selectCity([bogota], "Elige:"));
      expect(city).toBeNull();
      expect(capture.text()).toContain("Opción inválida.");
    } finally {
      capture.restore();
    }
  });
});
