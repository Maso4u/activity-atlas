const DAILY_PARAMS = [
  "temperature_2m_max",
  "temperature_2m_min",
  "temperature_2m_mean",
  "weathercode",
  "precipitation_sum",
  "rain_sum",
  "showers_sum",
  "snowfall_sum",
  "windspeed_10m_max",
  "windspeed_10m_mean",
  "windgusts_10m_max",
  "winddirection_10m_dominant",
  "uv_index_max",
  "sunshine_duration",
];

class OpenMeteoService {
  #forecastBaseUrl = "https://api.open-meteo.com/v1/forecast";
  #geocodingBaseUrl = "https://geocoding-api.open-meteo.com/v1/search";

  constructor() {}
  async searchCity(query: string) {
    const url = new URL(this.#geocodingBaseUrl);
    url.searchParams.append("name", query);
    url.searchParams.append("count", "10");
    url.searchParams.append("language", "en");
    url.searchParams.append("format", "json");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Error fetching city data: ${response.statusText}`);
    }
    const data = await response.json();
    // console.log("City search data:", data);
    return data.results || [];
  }

  async getDailyForecast(
    latitude: number,
    longitude: number,
    timezone: string
  ) {
    const url = new URL(this.#forecastBaseUrl);
    url.searchParams.append("latitude", latitude.toString());
    url.searchParams.append("longitude", longitude.toString());
    url.searchParams.append("daily", DAILY_PARAMS.join(","));
    url.searchParams.append("timezone", timezone);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }
    const data = await response.json();
    const forecasts = data.daily.time.map((day: string, index: number) => ({
      date: day,
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      temperatureMean: data.daily.temperature_2m_mean[index],
      weatherCode: data.daily.weathercode[index],
      weatherDescription: "", // This would require a mapping from code to description
      precipitationSum: data.daily.precipitation_sum[index],
      rainSum: data.daily.rain_sum[index],
      showersSum: data.daily.showers_sum[index],
      snowfallSum: data.daily.snowfall_sum[index],
      windSpeedMax: data.daily.windspeed_10m_max[index],
      windSpeedMean: data.daily.windspeed_10m_mean[index],
      windGustsMax: data.daily.windgusts_10m_max[index],
      windDirectionDominant: data.daily.winddirection_10m_dominant[index],
      uvIndexMax: data.daily.uv_index_max[index],
      sunshineDuration: data.daily.sunshine_duration[index],
    }));
    return forecasts;
  }
}
const openMeteoService = new OpenMeteoService();
export { openMeteoService };
