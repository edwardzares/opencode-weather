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
