import { describe, expect, test } from "bun:test";
import { buildMenuOptions, renderMenu } from "../../src/presentation/menu.ts";
import type { Settings } from "../../src/types/Settings.ts";
import { bogota } from "../helpers/fixtures.ts";
import { captureConsole } from "../helpers/console.ts";

const settingsC: Settings = { defaultCityId: "1", unit: "C" };

describe("buildMenuOptions", () => {
  test("incluye las opciones del menú sin la 7", () => {
    const options = buildMenuOptions(5, settingsC);
    expect(options.map((option) => option.id)).toEqual([
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "8",
      "9",
    ]);
  });

  test("muestra el número de ciudades", () => {
    const options = buildMenuOptions(5, settingsC);
    expect(options[1]?.label).toBe("Clima de todas las ciudades (5)");
  });

  test("muestra la unidad actual en ajustes", () => {
    expect(buildMenuOptions(0, settingsC)[6]?.label).toBe("Ajustes (°C)");
    expect(buildMenuOptions(0, { defaultCityId: null, unit: "F" })[6]?.label).toBe(
      "Ajustes (°F)",
    );
  });

  test("etiquetas de las acciones principales", () => {
    const labels = buildMenuOptions(2, settingsC).map((option) => option.label);
    expect(labels[0]).toBe("Clima de ciudad default");
    expect(labels[2]).toBe("Buscar y agregar ciudad");
    expect(labels[3]).toBe("Eliminar ciudad");
    expect(labels[4]).toBe("Establecer ciudad default");
    expect(labels[5]).toBe("Pronóstico 7 días");
    expect(labels[7]).toBe("Salir");
  });
});

describe("renderMenu", () => {
  test("dibuja título, separadores y opciones", () => {
    const capture = captureConsole();
    try {
      renderMenu([bogota], settingsC);
    } finally {
      capture.restore();
    }

    const text = capture.text();
    expect(text).toContain("MY CLIMA");
    expect(text).toContain("═".repeat(40));
    expect(text).toContain("1. Clima de ciudad default");
    expect(text).toContain("2. Clima de todas las ciudades (1)");
    expect(text).toContain("8. Ajustes (°C)");
    expect(text).toContain("9. Salir");
  });
});
