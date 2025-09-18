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
}
const openMeteoService = new OpenMeteoService();
export { openMeteoService };
