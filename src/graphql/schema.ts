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

  type DailyForecast{
    date: String!        

    # Temperature data
    temperatureMax: Float!
    temperatureMin: Float!
    temperatureMean: Float!

    # Weather conditions
    weatherCode: Int!
    weatherDescription: String!


    # Precipitation breakdown (key for activity differentiation)
    precipitationSum: Float! 
    rainSum: Float 
    showersSum: Float 
    snowfallSum: Float! 

    # Wind data
    windSpeedMax: Float! 
    windSpeedMean: Float! 
    windGustsMax: Float 
    windDirectionDominant: Float 

    # Additional factors
    uvIndexMax: Float 
    sunshineDuration: Float

  }

  type WeatherForecast {
    city: City!
    days: [DailyForecast!]!
  }

  type Query {
    searchCity(query: String!): [City!]!
    dailyWeatherForecasts(latitude: Float!, longitude: Float!, timezone: String!): [DailyForecast!]!
  }

`);

export default schema;
