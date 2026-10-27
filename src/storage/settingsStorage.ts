import type { Settings } from "../types/Settings.ts";
import { loadStore, saveStore } from "./dataFile.ts";

export async function loadSettings(): Promise<Settings> {
  const store = await loadStore();
  return { defaultCityId: store.defaultCityId, unit: store.unit };
}

export async function saveSettings(settings: Settings): Promise<void> {
  const store = await loadStore();
  await saveStore({ ...store, ...settings });
}
