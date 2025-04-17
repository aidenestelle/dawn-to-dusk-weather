
import { useState, useEffect } from "react";
import { Coordinates } from "@/lib/api";

interface GeolocationState {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
}

// Key for storing coordinates in localStorage
const COORDINATES_STORAGE_KEY = "weather-app-coordinates";

/**
 * Custom hook for handling geolocation
 * @param skipCache - Whether to skip checking localStorage
 * @returns Geolocation state and methods
 */
export const useGeolocation = (skipCache = false) => {
  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    loading: true,
    error: null,
  });
  
  const [permissionRequested, setPermissionRequested] = useState(false);

  // Check if user has previously allowed location access
  const requestHasBeenMadeBefore = (): boolean => {
    return localStorage.getItem("location-permission-requested") === "true";
  };

  // Mark that we've requested location permission
  const markRequestMade = (): void => {
    localStorage.setItem("location-permission-requested", "true");
    setPermissionRequested(true);
  };
  
  // Save coordinates to localStorage
  const saveCoordinates = (coords: Coordinates): void => {
    localStorage.setItem(COORDINATES_STORAGE_KEY, JSON.stringify(coords));
  };
  
  // Get coordinates from localStorage
  const getSavedCoordinates = (): Coordinates | null => {
    const saved = localStorage.getItem(COORDINATES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  };
  
  // Manually set coordinates
  const setManualCoordinates = (coords: Coordinates): void => {
    setState({
      coordinates: coords,
      loading: false,
      error: null,
    });
    saveCoordinates(coords);
  };
  
  // Request user's geolocation
  const requestGeolocation = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (!navigator.geolocation) {
      setState({
        coordinates: null,
        loading: false,
        error: "Geolocation is not supported by your browser",
      });
      return;
    }
    
    markRequestMade();
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        setState({
          coordinates,
          loading: false,
          error: null,
        });
        
        saveCoordinates(coordinates);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setState({
          coordinates: null,
          loading: false,
          error: getGeolocationErrorMessage(error),
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 3600000, // 1 hour
      }
    );
  };
  
  // Get human-readable error message
  const getGeolocationErrorMessage = (error: GeolocationPositionError): string => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access was denied. Please enable location services for this site.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. Please try again later.";
      case error.TIMEOUT:
        return "The request to get your location timed out. Please try again.";
      default:
        return "An unknown error occurred while trying to get your location.";
    }
  };

  useEffect(() => {
    // First, check if we should use cached coordinates
    if (!skipCache) {
      const savedCoords = getSavedCoordinates();
      if (savedCoords) {
        setState({
          coordinates: savedCoords,
          loading: false,
          error: null,
        });
        return;
      }
    }
    
    // If no cached coordinates or skipCache is true, check if we've already requested permission
    if (!permissionRequested) {
      if (requestHasBeenMadeBefore()) {
        setPermissionRequested(true);
      } else {
        requestGeolocation();
      }
    }
  }, [skipCache, permissionRequested]);

  return {
    ...state,
    requestGeolocation,
    setManualCoordinates,
    permissionRequested,
    hasRequestedBefore: requestHasBeenMadeBefore,
  };
};
