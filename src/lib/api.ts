
import axios from "axios";

// Base URL for Open-Meteo API
const BASE_URL = "https://api.open-meteo.com/v1";

// API request timeout in milliseconds
const TIMEOUT = 10000;

// Cache duration in milliseconds (1 hour)
const CACHE_DURATION = 3600000;

// Interface for location coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Interface for current weather data
export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
  is_day: number;
  humidity?: number;
  uv_index?: number;
}

// Interface for daily weather forecast
export interface DailyForecast {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_probability_max: number[];
  weathercode: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  windspeed_10m_max: number[];
}

// Interface for hourly weather forecast
export interface HourlyForecast {
  time: string[];
  temperature_2m: number[];
  relativehumidity_2m: number[];
  precipitation_probability: number[];
  weathercode: number[];
  windspeed_10m: number[];
  winddirection_10m: number[];
  is_day: number[];
}

// Interface for full weather response
export interface WeatherResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current_weather: CurrentWeather;
  daily: DailyForecast;
  hourly: HourlyForecast;
}

// Cache object for storing recent API responses
const apiCache: Record<string, { data: any; timestamp: number }> = {};

/**
 * Fetches weather data for a given location
 * @param coords - Location coordinates
 * @param tempUnit - Temperature unit (celsius/fahrenheit)
 * @returns Promise with weather data
 */
export const fetchWeatherData = async (
  coords: Coordinates,
  tempUnit: "celsius" | "fahrenheit" = "celsius"
): Promise<WeatherResponse> => {
  // Create cache key from coordinates and temperature unit
  const cacheKey = `${coords.latitude},${coords.longitude},${tempUnit}`;
  
  // Check if we have a valid cached response
  const cachedResponse = apiCache[cacheKey];
  if (cachedResponse && Date.now() - cachedResponse.timestamp < CACHE_DURATION) {
    return cachedResponse.data;
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        current_weather: true,
        temperature_unit: tempUnit,
        timezone: "auto",
        daily: "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset,uv_index_max,windspeed_10m_max",
        hourly: "temperature_2m,relativehumidity_2m,precipitation_probability,weathercode,windspeed_10m,winddirection_10m,is_day",
        forecast_days: 7,
      },
      timeout: TIMEOUT,
    });
    
    // Cache the response
    apiCache[cacheKey] = {
      data: response.data,
      timestamp: Date.now()
    };
    
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

/**
 * Reverses geocoding to get location name from coordinates
 * @param coords - Location coordinates
 * @returns Promise with location name
 */
export const getLocationName = async (
  coords: Coordinates
): Promise<string> => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/reverse",
      {
        params: {
          lat: coords.latitude,
          lon: coords.longitude,
          format: "json",
        },
        headers: {
          "User-Agent": "Dawn-to-Dusk-Weather-App",
        },
        timeout: TIMEOUT,
      }
    );
    
    const data = response.data;
    // Extract city or town name
    const city = data.address.city || data.address.town || data.address.village || data.address.hamlet;
    
    if (city && data.address.country) {
      return `${city}, ${data.address.country}`;
    } else if (data.display_name) {
      return data.display_name.split(",").slice(0, 2).join(",");
    }
    
    return "Unknown Location";
  } catch (error) {
    console.error("Error getting location name:", error);
    return "Unknown Location";
  }
};

/**
 * Geocoding to get coordinates from location name (multi-result for live search)
 * @param locationName - Name of the location to search
 * @returns Promise with array of { name, latitude, longitude }
 */
export interface LocationSuggestion {
  name: string;
  latitude: number;
  longitude: number;
}

export const getCoordinatesFromName = async (
  locationName: string
): Promise<LocationSuggestion[]> => {
  try {
    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: locationName,
          format: "json",
          limit: 5,
        },
        headers: {
          "User-Agent": "Dawn-to-Dusk-Weather-App",
        },
        timeout: TIMEOUT,
      }
    );

    if (response.data && response.data.length > 0) {
      return response.data.map((item: any) => ({
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));
    }

    return [];
  } catch (error) {
    console.error("Error geocoding location:", error);
    return [];
  }
};
