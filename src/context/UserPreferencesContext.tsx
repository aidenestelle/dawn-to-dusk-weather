
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface UserPreferences {
  temperatureUnit: "celsius" | "fahrenheit";
  animationsEnabled: boolean;
  lastSearchedLocations: string[];
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setTemperatureUnit: (unit: "celsius" | "fahrenheit") => void;
  toggleAnimations: () => void;
  addSearchedLocation: (location: string) => void;
  removeSearchedLocation: (location: string) => void;
  clearSearchHistory: () => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  temperatureUnit: "celsius",
  animationsEnabled: true,
  lastSearchedLocations: [],
};

// Storage key for localStorage
const PREFERENCES_STORAGE_KEY = "weather-app-preferences";

// Create context
const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  
  // Load preferences from localStorage on initial render
  useEffect(() => {
    const savedPreferences = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (savedPreferences) {
      try {
        const parsedPreferences = JSON.parse(savedPreferences);
        setPreferences(parsedPreferences);
      } catch (error) {
        console.error("Error parsing saved preferences:", error);
        // If there's an error, use default preferences and reset localStorage
        localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(defaultPreferences));
      }
    } else {
      // If no preferences are saved, initialize localStorage with defaults
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(defaultPreferences));
    }
  }, []);
  
  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);
  
  // Set temperature unit preference
  const setTemperatureUnit = (unit: "celsius" | "fahrenheit") => {
    setPreferences(prev => ({ ...prev, temperatureUnit: unit }));
  };
  
  // Toggle animations
  const toggleAnimations = () => {
    setPreferences(prev => ({ ...prev, animationsEnabled: !prev.animationsEnabled }));
  };
  
  // Add a location to search history
  const addSearchedLocation = (location: string) => {
    setPreferences(prev => {
      // Remove if already exists to prevent duplicates
      const filteredLocations = prev.lastSearchedLocations.filter(
        loc => loc !== location
      );
      
      // Add to beginning of array and limit to 5 recent locations
      return {
        ...prev,
        lastSearchedLocations: [location, ...filteredLocations].slice(0, 5),
      };
    });
  };
  
  // Remove a location from search history
  const removeSearchedLocation = (location: string) => {
    setPreferences(prev => ({
      ...prev,
      lastSearchedLocations: prev.lastSearchedLocations.filter(loc => loc !== location),
    }));
  };
  
  // Clear all search history
  const clearSearchHistory = () => {
    setPreferences(prev => ({ ...prev, lastSearchedLocations: [] }));
  };
  
  const value = {
    preferences,
    setTemperatureUnit,
    toggleAnimations,
    addSearchedLocation,
    removeSearchedLocation,
    clearSearchHistory,
  };
  
  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

// Custom hook to use the preferences context
export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  }
  return context;
};
