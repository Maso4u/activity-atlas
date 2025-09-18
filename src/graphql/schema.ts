import { buildSchema } from "graphql";

const schema = buildSchema(`
  enum TravelActivity {
    SKIING
    SURFING
    INDOOR_SIGHTSEEING
    OUTDOOR_SIGHTSEEING
  }

  type City {
    latitude: Float!
    longitude: Float!
    name: String!
    country: String!
    timezone: String!
  }
  type Query {
    searchCity(query: String!): [City!]!
  }

`);

export default schema;
