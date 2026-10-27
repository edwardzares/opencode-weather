import type { City } from "./City.ts";
import type { Unit } from "./Settings.ts";

export type Store = {
  cities: City[];
  defaultCityId: string | null;
  unit: Unit;
};
