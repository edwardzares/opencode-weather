import type { ConsoleCapture } from "./console.ts";
import { captureConsole } from "./console.ts";
import { withTempDataFile } from "./tempData.ts";

export type Scenario = {
  dataPath: string;
  write: (data: unknown) => Promise<void>;
  capture: ConsoleCapture;
};

export async function runScenario(
  fn: (scenario: Scenario) => Promise<void> | void,
): Promise<string> {
  return withTempDataFile(async ({ path, write }) => {
    const capture = captureConsole();
    try {
      await fn({ dataPath: path, write, capture });
      return capture.text();
    } finally {
      capture.restore();
    }
  });
}
