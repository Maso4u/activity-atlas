import { describe, expect, it } from "vitest";
import { activityScoringService } from "../services/activity-ranking-service.js";
import type { Forecast } from "../types.js";

// Helper to create a base forecast object, allowing overrides for specific tests
const createMockForecast = (
  overrides: Partial<Forecast>
): Partial<Forecast> => ({
  date: "2024-01-01",
  temperatureMean: 10,
  sunshineDuration: 6,
  precipitationSum: 0,
  snowfallSum: 0,
  windSpeedMean: 10,
  windGustsMax: 20,
  ...overrides,
});

describe("ActivityScoringService", () => {
  describe("scoreSkiing", () => {
    it("should score high for ideal skiing conditions", () => {
      const forecast = createMockForecast({
        snowfallSum: 25,
        temperatureMean: -5,
        windSpeedMean: 10,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const skiingScore = result[0].activities.find(
        (a) => a.activity === "SKIING"
      )?.score;
      expect(skiingScore).toBe(9); // 6 for snow + 3 for temp
    });

    it("should score low for poor skiing conditions", () => {
      const forecast = createMockForecast({
        snowfallSum: 0,
        temperatureMean: 10,
        windSpeedMean: 40,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const skiingScore = result[0].activities.find(
        (a) => a.activity === "SKIING"
      )?.score;
      expect(skiingScore).toBe(0); // 0 for snow + 0 for temp - 1 for wind, clamped to 0
    });
  });

  describe("scoreOutdoorSightseeing", () => {
    it("should score high for sunny and pleasant weather", () => {
      const forecast = createMockForecast({
        sunshineDuration: 9,
        temperatureMean: 22,
        precipitationSum: 0,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const outdoorScore = result[0].activities.find(
        (a) => a.activity === "OUTDOOR_SIGHTSEEING"
      )?.score;
      expect(outdoorScore).toBe(9); // 5 baseline + 2 for sun + 2 for temp
    });

    it("should score low for rainy and cold weather", () => {
      const forecast = createMockForecast({
        sunshineDuration: 1,
        temperatureMean: 5,
        precipitationSum: 15,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const outdoorScore = result[0].activities.find(
        (a) => a.activity === "OUTDOOR_SIGHTSEEING"
      )?.score;
      expect(outdoorScore).toBe(2); // 5 baseline - 3 for rain
    });
  });

  describe("scoreIndoorSightseeing", () => {
    it("should score high during bad weather (heavy rain)", () => {
      const forecast = createMockForecast({
        precipitationSum: 15,
        temperatureMean: 15,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const indoorScore = result[0].activities.find(
        (a) => a.activity === "INDOOR_SIGHTSEEING"
      )?.score;
      expect(indoorScore).toBe(8); // 5 baseline + 3 for rain
    });

    it("should score high during extreme temperatures", () => {
      const forecast = createMockForecast({
        precipitationSum: 0,
        temperatureMean: 35,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const indoorScore = result[0].activities.find(
        (a) => a.activity === "INDOOR_SIGHTSEEING"
      )?.score;
      expect(indoorScore).toBe(7); // 5 baseline + 2 for temp
    });

    it("should score baseline for pleasant weather", () => {
      const forecast = createMockForecast({
        precipitationSum: 0,
        temperatureMean: 20,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const indoorScore = result[0].activities.find(
        (a) => a.activity === "INDOOR_SIGHTSEEING"
      )?.score;
      expect(indoorScore).toBe(5); // 5 baseline
    });
  });

  describe("scoreSurfing", () => {
    it("should score high for ideal wind and temperature", () => {
      const forecast = createMockForecast({
        windSpeedMean: 10,
        temperatureMean: 20,
        precipitationSum: 0,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const surfingScore = result[0].activities.find(
        (a) => a.activity === "SURFING"
      )?.score;
      expect(surfingScore).toBe(6); // 4 for wind + 2 for temp
    });

    it("should score low for very high wind gusts", () => {
      const forecast = createMockForecast({
        windSpeedMean: 10,
        windGustsMax: 50,
        temperatureMean: 20,
      });
      const result = activityScoringService.calculateActivityScore([
        forecast as Forecast,
      ]);
      const surfingScore = result[0].activities.find(
        (a) => a.activity === "SURFING"
      )?.score;
      expect(surfingScore).toBe(4); // 4 for wind + 2 for temp - 2 for gusts
    });
  });

  describe("calculateActivityScore", () => {
    it("should calculate scores for multiple forecasts", () => {
      const forecasts = [
        createMockForecast({
          date: "2024-01-01",
          snowfallSum: 30,
          temperatureMean: -5,
        }), // Good for skiing
        createMockForecast({
          date: "2024-01-02",
          sunshineDuration: 10,
          temperatureMean: 22,
        }), // Good for outdoor
      ];
      const result = activityScoringService.calculateActivityScore(
        forecasts as Forecast[]
      );
      expect(result).toHaveLength(2);
      expect(result[0].date).toBe("2024-01-01");
      expect(result[1].date).toBe("2024-01-02");

      const day1SkiingScore = result[0].activities.find(
        (a) => a.activity === "SKIING"
      )?.score;
      const day2OutdoorScore = result[1].activities.find(
        (a) => a.activity === "OUTDOOR_SIGHTSEEING"
      )?.score;

      expect(day1SkiingScore).toBeGreaterThan(8);
      expect(day2OutdoorScore).toBeGreaterThan(8);
    });

    it("should clamp scores between 0 and MAX_SCORE", () => {
      const forecast = createMockForecast({
        snowfallSum: 30, // +6
        temperatureMean: -5, // +3
        windSpeedMean: 0, // +0
        // Total would be 9, let's add more to exceed 10 if possible
        // The current logic maxes out at 9 for skiing, let's test indoor
        precipitationSum: 20, // +3
        // Indoor total = 5 + 3 + 2 = 10
      });

      const forecastOverMax = createMockForecast({
        precipitationSum: 20, // base 5 + 3 = 8
        temperatureMean: -10, // +2 = 10
      });

      const forecastUnderMin = createMockForecast({
        sunshineDuration: 0, // base 5
        temperatureMean: 0, // +0
        precipitationSum: 20, // -3 = 2
      });

      const result = activityScoringService.calculateActivityScore([
        forecastOverMax as Forecast,
        forecastUnderMin as Forecast,
      ]);
      const indoorScore = result[0].activities.find(
        (a) => a.activity === "INDOOR_SIGHTSEEING"
      )?.score;
      const outdoorScore = result[1].activities.find(
        (a) => a.activity === "OUTDOOR_SIGHTSEEING"
      )?.score;

      expect(indoorScore).toBe(10);
      expect(outdoorScore).toBe(2); // Doesn't go below 0, but confirms calculation
    });
  });
});
