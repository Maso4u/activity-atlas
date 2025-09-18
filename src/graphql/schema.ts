import { buildSchema } from "graphql";

const schema = buildSchema(`
  type City {
    latitude: Float!
    longitude: Float!
    name: String!
    country: String!
  }

  type Query {
    searchCity(query: String!): [City!]!
  }

`);

export default schema;
