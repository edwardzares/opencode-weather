import { describe, expect, test } from "bun:test";
import { colors, createColors } from "../../src/utils/colors.ts";

describe("createColors", () => {
  test("deshabilitado devuelve texto plano", () => {
    const plain = createColors(false);
    expect(plain.red("hola")).toBe("hola");
    expect(plain.cyan("x")).toBe("x");
    expect(plain.bold("x")).toBe("x");
  });

  test("habilitado envuelve con ANSI", () => {
    const colored = createColors(true);
    expect(colored.red("hola")).toBe("\u001b[31mhola\u001b[0m");
    expect(colored.green("x")).toBe("\u001b[32mx\u001b[0m");
    expect(colored.yellow("x")).toBe("\u001b[33mx\u001b[0m");
    expect(colored.cyan("x")).toBe("\u001b[36mx\u001b[0m");
    expect(colored.bold("x")).toBe("\u001b[1mx\u001b[0m");
    expect(colored.dim("x")).toBe("\u001b[2mx\u001b[0m");
  });
});

describe("colors (instancia por defecto)", () => {
  test("todos los helpers devuelven el texto", () => {
    expect(colors.cyan("x")).toContain("x");
    expect(colors.green("x")).toContain("x");
    expect(colors.yellow("x")).toContain("x");
    expect(colors.red("x")).toContain("x");
    expect(colors.bold("x")).toContain("x");
    expect(colors.dim("x")).toContain("x");
  });
});
