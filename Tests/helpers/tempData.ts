import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export type TempData = {
  path: string;
  write: (data: unknown) => Promise<void>;
};

export async function withTempDataFile<T>(fn: (temp: TempData) => Promise<T>): Promise<T> {
  const path = join(tmpdir(), `weather-test-${crypto.randomUUID()}.json`);
  process.env.WEATHER_DATA_FILE = path;

  try {
    return await fn({
      path,
      write: async (data: unknown) => {
        await Bun.write(path, `${JSON.stringify(data, null, 2)}\n`);
      },
    });
  } finally {
    delete process.env.WEATHER_DATA_FILE;
    await rm(path, { force: true });
  }
}
