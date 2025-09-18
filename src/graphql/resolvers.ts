import { openMeteoService } from "../services/open-meteo-service.js";
const resolvers = {
  Query: {
    searchCity: async ({ query }: { query: string }) => {
      const cities = await openMeteoService.searchCity(query);
      return cities;
    },
    getWeatherForecasts: async ({
      latitude,
      longitude,
      timezone,
    }: {
      latitude: number;
      longitude: number;
      timezone: string;
    }) => {
      const forecasts = await openMeteoService.getDailyForecast(
        latitude,
        longitude,
        timezone
      );

      return forecasts;
    },
  },
};

export default resolvers;
