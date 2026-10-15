import type { City, Store, Unit } from "./types.ts";

const DATA_FILE = "data.json";

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

export function addCity(store: Store, city: City): void {
  store.cities.push(city);
}

export function removeCity(store: Store, id: string): void {
  store.cities = store.cities.filter((city) => city.id !== id);
  if (store.defaultCityId === id) {
    store.defaultCityId = null;
  }
}

export function setDefaultCity(store: Store, id: string): void {
  store.defaultCityId = id;
}

export function setUnit(store: Store, unit: Unit): void {
  store.unit = unit;
}
