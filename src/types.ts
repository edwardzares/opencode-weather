export type Unit = "C" | "F";

export type City = {
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
};

export type Store = {
  cities: City[];
  defaultCityId: string | null;
  unit: Unit;
};

export type GeocodingResult = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
};

export type GeocodingResponse = {
  results?: GeocodingResult[];
};

export type ForecastResponse = {
  current?: {
    temperature_2m?: number;
  };
};
