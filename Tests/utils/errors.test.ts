import { describe, expect, test } from "bun:test";
import { errorMessage } from "../../src/utils/errors.ts";

describe("errorMessage", () => {
  test("devuelve el mensaje de un Error", () => {
    expect(errorMessage(new Error("boom"))).toBe("boom");
  });

  test("valores no-Error devuelven mensaje genérico", () => {
    expect(errorMessage("texto")).toBe("Error desconocido");
    expect(errorMessage(null)).toBe("Error desconocido");
    expect(errorMessage(undefined)).toBe("Error desconocido");
  });
});
