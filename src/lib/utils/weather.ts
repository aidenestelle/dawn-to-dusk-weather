
import { format, fromUnixTime } from "date-fns";

// Weather code mapping to weather conditions
export enum WeatherCondition {
  Clear = "clear",
  PartlyCloudy = "partly-cloudy",
  Cloudy = "cloudy",
  Fog = "fog",
  Drizzle = "drizzle",
  Rain = "rain",
  SnowFall = "snow",
  Thunderstorm = "thunderstorm",
  Unknown = "unknown"
}

// Map Open-Meteo weather codes to our internal conditions
export const mapWeatherCode = (code: number): WeatherCondition => {
  // Codes from Open-Meteo API documentation
  if (code === 0) return WeatherCondition.Clear;
  if (code === 1 || code === 2) return WeatherCondition.PartlyCloudy;
  if (code === 3) return WeatherCondition.Cloudy;
  if (code === 45 || code === 48) return WeatherCondition.Fog;
  if (code >= 51 && code <= 57) return WeatherCondition.Drizzle;
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return WeatherCondition.Rain;
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return WeatherCondition.SnowFall;
  if (code >= 95 && code <= 99) return WeatherCondition.Thunderstorm;
  return WeatherCondition.Unknown;
};

// Map weather condition to appropriate background gradient
export const getWeatherGradient = (condition: WeatherCondition, isDay: boolean): string => {
  if (!isDay) {
    return "bg-gradient-to-b from-weather-night-start to-weather-night-end";
  }
  
  switch (condition) {
    case WeatherCondition.Clear:
      return "bg-gradient-to-b from-weather-sunny-start to-weather-sunny-end";
    case WeatherCondition.PartlyCloudy:
    case WeatherCondition.Cloudy:
      return "bg-gradient-to-b from-weather-cloudy-start to-weather-cloudy-end";
    case WeatherCondition.Fog:
    case WeatherCondition.Drizzle:
    case WeatherCondition.Rain:
    case WeatherCondition.Thunderstorm:
      return "bg-gradient-to-b from-weather-rainy-start to-weather-rainy-end";
    case WeatherCondition.SnowFall:
      return "bg-gradient-to-b from-weather-snow-start to-weather-snow-end";
    default:
      return "bg-gradient-to-b from-weather-sunny-start to-weather-sunny-end";
  }
};

// Format temperature with unit
export const formatTemperature = (
  temp: number,
  unit: "celsius" | "fahrenheit"
): string => {
  return `${Math.round(temp)}°${unit === "celsius" ? "C" : "F"}`;
};

// Format date to display day name
export const formatDay = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "EEEE");
};

// Format time to display hour
export const formatHour = (timeString: string): string => {
  const date = new Date(timeString);
  return format(date, "ha");
};

// Format full date for display
export const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, "MMMM d, yyyy");
};

// Get appropriate weather icon based on condition and time of day
export const getWeatherIcon = (condition: WeatherCondition, isDay: boolean): string => {
  const timePrefix = isDay ? "day" : "night";
  
  switch (condition) {
    case WeatherCondition.Clear:
      return isDay ? "sun" : "moon";
    case WeatherCondition.PartlyCloudy:
      return isDay ? "cloud-sun" : "cloud-moon";
    case WeatherCondition.Cloudy:
      return "cloud";
    case WeatherCondition.Fog:
      return "cloud-fog";
    case WeatherCondition.Drizzle:
      return "cloud-drizzle";
    case WeatherCondition.Rain:
      return "cloud-rain";
    case WeatherCondition.SnowFall:
      return "cloud-snow";
    case WeatherCondition.Thunderstorm:
      return "cloud-lightning";
    default:
      return isDay ? "sun" : "moon";
  }
};

// Convert wind speed to beaufort scale (0-12)
export const getWindBeaufortScale = (speed: number): number => {
  if (speed < 1) return 0;
  if (speed < 6) return 1;
  if (speed < 12) return 2;
  if (speed < 20) return 3;
  if (speed < 29) return 4;
  if (speed < 39) return 5;
  if (speed < 50) return 6;
  if (speed < 62) return 7;
  if (speed < 75) return 8;
  if (speed < 89) return 9;
  if (speed < 103) return 10;
  if (speed < 118) return 11;
  return 12;
};

// Get wind direction as text
export const getWindDirection = (degrees: number): string => {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};
