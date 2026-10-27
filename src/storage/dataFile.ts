import type { Store } from "../types/Store.ts";
import { DATA_FILE } from "../utils/constants.ts";

function emptyStore(): Store {
  return { cities: [], defaultCityId: null, unit: "C" };
}

export async function loadStore(): Promise<Store> {
  const file = Bun.file(DATA_FILE);
  if (!(await file.exists())) {
    return emptyStore();
  }

  try {
    const data = (await file.json()) as Partial<Store>;
    return {
      cities: Array.isArray(data.cities) ? data.cities : [],
      defaultCityId: data.defaultCityId ?? null,
      unit: data.unit === "F" ? "F" : "C",
    };
  } catch {
    return emptyStore();
  }
}

export async function saveStore(store: Store): Promise<void> {
  await Bun.write(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`);
}
