export type CurrentWeather = {
  temperatureC: number;
};

export type DailyForecast = {
  date: string;
  maxC: number;
  minC: number;
  weatherCode: number;
};

export type CurrentWeatherResponse = {
  current?: {
    temperature_2m?: number;
  };
};

export type DailyForecastResponse = {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};
