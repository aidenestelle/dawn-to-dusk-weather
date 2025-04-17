
import { useState, useEffect } from "react";
import { Coordinates, WeatherResponse, fetchWeatherData } from "@/lib/api";

interface WeatherState {
  data: WeatherResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Custom hook for fetching and managing weather data
 * @param coordinates - Location coordinates
 * @param tempUnit - Temperature unit preference
 * @returns Weather state and refresh method
 */
export const useWeather = (
  coordinates: Coordinates | null,
  tempUnit: "celsius" | "fahrenheit" = "celsius"
) => {
  const [state, setState] = useState<WeatherState>({
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });
  
  // Refresh weather data
  const refreshWeather = async () => {
    if (!coordinates) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "No location coordinates available. Please add a location to see weather data.",
      }));
      return;
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await fetchWeatherData(coordinates, tempUnit);
      setState({
        data,
        loading: false,
        error: null,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Failed to fetch weather data. Please try again later.",
      }));
    }
  };
  
  // Fetch weather data when coordinates or temperature unit changes
  useEffect(() => {
    if (coordinates) {
      refreshWeather();
    } else {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "No location selected. Please choose a location to see weather data."
      }));
    }
  }, [coordinates, tempUnit]);
  
  return {
    ...state,
    refreshWeather,
  };
};
