import { openMeteoService } from "../services/open-meteo-service.js";
const resolvers = {
  Query: {
    searchCity: async ({ query }: { query: string }) => {
      const cities = await openMeteoService.searchCity(query);
      return cities;
    },
  },
};

export default resolvers;
