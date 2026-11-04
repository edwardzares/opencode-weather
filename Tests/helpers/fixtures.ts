import type { City } from "../../src/types/City.ts";
import type { Store } from "../../src/types/Store.ts";

export const bogota: City = {
  id: "3688689",
  name: "Bogotá",
  admin1: "Bogotá D.C.",
  country: "Colombia",
  latitude: 4.60971,
  longitude: -74.08175,
};

export const madrid: City = {
  id: "3117735",
  name: "Madrid",
  admin1: "Comunidad Autónoma de Madrid",
  country: "España",
  latitude: 40.4165,
  longitude: -3.70256,
};

export function emptyStore(): Store {
  return { cities: [], defaultCityId: null, unit: "C" };
}

export function sampleStore(): Store {
  return {
    cities: [bogota, madrid],
    defaultCityId: bogota.id,
    unit: "C",
  };
}

export const geocodingResponse = {
  results: [
    {
      id: 3688689,
      name: "Bogotá",
      latitude: 4.60971,
      longitude: -74.08175,
      country: "Colombia",
      admin1: "Bogotá D.C.",
    },
  ],
};

export const currentWeatherResponse = {
  current: { temperature_2m: 14.4 },
};

export const dailyForecastResponse = {
  daily: {
    time: ["2026-10-26", "2026-10-27"],
    temperature_2m_max: [21.6, 23.9],
    temperature_2m_min: [10.7, 9.5],
    weather_code: [51, 55],
  },
};
