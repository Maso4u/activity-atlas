const resolvers = {
  Query: {
    searchCity: ({ query }: { query: string }) => {
      const cities = [
        {
          latitude: 40.7128,
          longitude: -74.006,
          name: "New York",
          country: "USA",
        },
        {
          latitude: 34.0522,
          longitude: -118.2437,
          name: "Los Angeles",
          country: "USA",
        },
        {
          latitude: 51.5074,
          longitude: -0.1278,
          name: "London",
          country: "UK",
        },
        {
          latitude: 48.8566,
          longitude: 2.3522,
          name: "Paris",
          country: "France",
        },
        {
          latitude: 35.6895,
          longitude: 139.6917,
          name: "Tokyo",
          country: "Japan",
        },
      ];
      return cities.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase())
      );
    },
  },
};

export default resolvers;
