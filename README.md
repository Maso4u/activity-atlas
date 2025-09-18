# Travel Planning GraphQL API

A GraphQL API that helps users plan their travel activities based on weather conditions. The API provides city suggestions, weather forecasts, and activity recommendations using sophisticated weather-based scoring algorithms.

## Features

- **Dynamic City Search**: Intelligent city suggestions based on partial user input
- **Weather Forecasts**: 7-day detailed weather forecasts with comprehensive daily parameters
- **Activity Scoring System**: Weather-based recommendations for:
  - Skiing (snow conditions, temperature, wind safety)
  - Surfing (wind patterns, temperature, visibility)
  - Indoor Sightseeing (weather-inverse scoring)
  - Outdoor Sightseeing (sunshine, temperature, precipitation)

## Tech Stack

- **Framework**: [Hono](https://hono.dev/) with [GraphQL Server middleware](https://www.npmjs.com/package/@hono/graphql-server)
- **Runtime**: Node.js with TypeScript
- **API**: GraphQL with GraphiQL interface
- **Testing**: Vitest for unit testing
- **Weather Data**: [OpenMeteo API](https://open-meteo.com/)
- **Validation**: Zod for type-safe input validation

## Architecture

```
src/
├── graphql/
│   ├── resolvers.ts    # GraphQL query resolvers
│   └── schema.ts       # GraphQL type definitions
├── services/
│   ├── activity-ranking-service.ts  # Core scoring algorithms
│   └── open-meteo-service.ts       # Weather API integration
├── tests/
│   └── activity-scoring.test.ts    # Business logic tests
├── types.ts           # TypeScript interfaces
└── index.ts          # Server entry point
```

## Activity Scoring Algorithm

The system uses a **0-10 scale** with activity-specific weather factors:

### Skiing (Snow-dependent)

- **Fresh Snowfall**: 20cm+ = 6pts, 10-20cm = 4pts, 5-10cm = 2pts
- **Temperature Sweet Spot**: -15°C to -2°C = 3pts (optimal powder conditions)
- **Wind Safety**: >30 km/h mean speed = -1pt penalty

### Surfing (Wind-dependent)

- **Optimal Wind**: 5-15 km/h = 4pts (clean wave conditions)
- **Temperature Comfort**: 18-25°C = 2pts
- **Safety**: Wind gusts >40 km/h = -2pts (dangerous conditions)

### Outdoor Sightseeing (Weather-dependent)

- **Sunshine Bonus**: 8+ hours = 2pts, 6+ hours = 1pt
- **Temperature Comfort**: 18-25°C = 2pts (optimal walking weather)
- **Precipitation Penalty**: Heavy rain (>10mm) = -3pts

### Indoor Sightseeing (Weather-inverse)

- **Bad Weather Bonus**: Heavy rain = +3pts, extreme temperatures = +2pts
- **Baseline Score**: 5pts (always viable option)

## GraphQL API

### Example Queries

**Search for Cities:**

```graphql
query {
  searchCity(query: "London") {
    name
    country
    latitude
    longitude
    timezone
  }
}
```

**Get Weather Forecasts:**

```graphql
query {
  dailyWeatherForecasts(
    latitude: 51.5074
    longitude: -0.1278
    timezone: "Europe/London"
  ) {
    date
    temperatureMean
    precipitationSum
    snowfallSum
    windSpeedMean
    sunshineDuration
  }
}
```

**Get Activity Rankings:**

```graphql
query {
  activityRankings(
    latitude: 51.5074
    longitude: -0.1278
    timezone: "Europe/London"
  ) {
    date
    activities {
      activity
      score
    }
  }
}
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Start development server
pnpm dev

# Visit GraphiQL interface
open http://localhost:3000/graphql
```

## Key Architecture Decisions

- **GraphQL over REST**: Flexible querying for travel apps with varying data needs
- **0-10 Scoring Scale**: More intuitive than percentage-based systems
- **Rule-based Algorithm**: Transparent, testable logic vs black-box ML approach
- **OpenMeteo Integration**: Comprehensive weather parameters, reliable free tier
- **Service Layer Pattern**: Clean separation of weather API and business logic

## Trade-offs & Omissions

### Prioritized for 2-3 Hour Timeline

✅ **Core functionality**: Activity scoring algorithms and GraphQL API
✅ **Essential testing**: Unit tests for business logic (activity ranking)
✅ **Clean architecture**: Separation of concerns and type safety

### Simplified for Time Constraints

**Weather Data Caching**

- _Omitted_: Redis caching layer for weather forecasts
- _Impact_: Higher API calls to OpenMeteo, slower response times
- _Next_: Implement 1-6 hour TTL cache for weather data

**City Data Persistence**

- _Omitted_: Database storage and city ID system
- _Current_: Direct lat/lng parameters instead of city-based queries
- _Next_: City caching service and ID-based weather lookups

**Comprehensive Validation**

- _Omitted_: Input sanitization and detailed error handling
- _Impact_: Potential for malformed requests
- _Next_: Zod schema validation for all GraphQL inputs

**Geographic Intelligence**

- _Omitted_: Location-aware scoring (coastal detection, elevation)
- _Impact_: Surfing scored equally in landlocked areas
- _Next_: Geographic context for activity recommendations

## Future Enhancements

### Immediate (Next Sprint)

1. **City ID System**: Enable city-based caching and cleaner queries
2. **Weather Descriptions**: Map OpenMeteo codes to human-readable descriptions
3. **Error Handling**: Structured error responses and logging

### Short-term (Next Release)

1. **Intelligent Caching**: Weather data caching with appropriate TTLs
2. **Rate Limiting**: API quotas and request throttling
3. **Geographic Context**: Coastal detection for surfing, elevation for skiing

### Long-term Vision

1. **Machine Learning**: Personalized scoring based on user preferences
2. **Multi-source Weather**: Aggregate multiple APIs for improved accuracy
3. **Real-time Updates**: WebSocket integration for live conditions
4. **Historical Analysis**: Seasonal activity recommendations
