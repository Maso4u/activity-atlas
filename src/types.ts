export type Forecast = {
  date: string;

  // Temperature data
  temperatureMax: number;
  temperatureMin: number;
  temperatureMean: number;

  // Weather conditions
  weatherCode: number;
  weatherDescription: string;

  // Precipitation breakdown (key for activity differentiation)
  precipitationSum: number;
  rainSum: number | null;
  showersSum: number | null;
  snowfallSum: number;

  // Wind data
  windSpeedMax: number;
  windSpeedMean: number;
  windGustsMax: number | null;
  windDirectionDominant: number | null;

  // Additional factors
  uvIndexMax: number | null;
  sunshineDuration: number;
};

export type City = {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
  timezone: string;
};

// export type WeatherForecast = {
//   city: City;
//   days: Forecast[];
// };
