import type { Forecast } from "../types.js";

const ActivityType = {
  SKIING: "SKIING",
  SURFING: "SURFING",
  INDOOR_SIGHTSEEING: "INDOOR_SIGHTSEEING",
  OUTDOOR_SIGHTSEEING: "OUTDOOR_SIGHTSEEING",
} as const;

class ActivityScoringService {
  MAX_SCORE = 10;
  calculateActivityScore(weatherForecasts: Array<Forecast>) {
    // Implement scoring logic based on weather data
    return weatherForecasts.map((forecast) => ({
      date: forecast.date,
      activities: [
        {
          activity: ActivityType.SKIING,
          score: this.scoreSkiing(forecast),
        },
        {
          activity: ActivityType.SURFING,
          score: this.scoreSurfing(forecast),
        },
        {
          activity: ActivityType.INDOOR_SIGHTSEEING,
          score: this.scoreIndoorSightseeing(forecast),
        },
        {
          activity: ActivityType.OUTDOOR_SIGHTSEEING,
          score: this.scoreOutdoorSightseeing(forecast),
        },
      ],
    }));
  }

  private scoreSkiing(weather: Forecast): number {
    let score = 0;

    if (weather.snowfallSum > 20) score += 6;
    else if (weather.snowfallSum > 10) score += 4;
    else if (weather.snowfallSum > 5) score += 2;

    const temp = weather.temperatureMean;
    if (temp >= -15 && temp <= -2) score += 3;
    else if (temp >= -20 && temp <= 5) score += 1;

    if (weather.windSpeedMean > 30) score -= 1;

    return Math.max(0, Math.min(this.MAX_SCORE, score));
  }

  private scoreOutdoorSightseeing(weather: Forecast): number {
    let score = 5; // baseline

    if (weather.sunshineDuration > 8) score += 2;
    else if (weather.sunshineDuration > 6) score += 1;

    // Temperature comfort
    const temp = weather.temperatureMean;
    if (temp >= 18 && temp <= 25) score += 2;
    else if (temp >= 15 && temp <= 28) score += 1.5;
    else if (temp >= 10 && temp <= 32) score += 1;

    // Precipitation penalty
    if (weather.precipitationSum > 10) score -= 3;
    else if (weather.precipitationSum > 2) score -= 1;

    return Math.max(0, Math.min(this.MAX_SCORE, score));
  }

  private scoreIndoorSightseeing(weather: Forecast): number {
    let score = 5;

    // Bad weather bonus
    if (weather.precipitationSum > 10) score += 3;
    else if (weather.precipitationSum > 2) score += 1;

    // Extreme temperature bonus
    const temp = weather.temperatureMean;
    if (temp < 0 || temp > 30) score += 2;
    else if (temp < 5 || temp > 25) score += 1;

    return Math.max(0, Math.min(this.MAX_SCORE, score));
  }

  private scoreSurfing(weather: Forecast): number {
    let score = 0;

    // Wave height (0-6 points)
    if (weather.windSpeedMean >= 5 && weather.windSpeedMean <= 15) score += 4;
    else if (weather.windSpeedMean <= 25) score += 2;

    // High gusts are bad (dangerous conditions)
    if (weather.windGustsMax! > 40) score -= 2;

    // Temperature comfort (air temp, not water)
    const temp = weather.temperatureMean;
    if (temp >= 18 && temp <= 25) score += 2;
    else if (temp >= 10 && temp <= 30) score += 1;

    // Light rain okay, heavy rain reduces visibility
    if (weather.precipitationSum > 15) score -= 2;
    else if (weather.precipitationSum > 5) score -= 1;

    return Math.max(0, Math.min(this.MAX_SCORE, score));
  }
}

const activityScoringService = new ActivityScoringService();
export { activityScoringService, ActivityType };
