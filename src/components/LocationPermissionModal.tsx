
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCoordinatesFromName, LocationSuggestion } from "@/lib/api";
import { useDebounce } from "use-debounce";
import { useUserPreferences } from "@/context/UserPreferencesContext";

interface LocationPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
  onManualLocation?: (lat: number, lon: number, name: string) => void;
  showError?: boolean;
}

export function LocationPermissionModal({
  open,
  onClose,
  onAllow,
  onDeny,
  onManualLocation,
  showError = false,
}: LocationPermissionModalProps) {
  const { preferences, setTemperatureUnit, setWindSpeedUnit, setPrecipitationUnit } = useUserPreferences();
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [debouncedQuery] = useDebounce(searchQuery, 400);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Reset search input and suggestions when modal opens
  useEffect(() => {
    if (open) {
      setSearchQuery("");
      setSuggestions([]);
      setSearchError("");
      setShowSuggestions(false);
    }
  }, [open]);

  useEffect(() => {
    let active = true;
    if (debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setLoading(true);
    getCoordinatesFromName(debouncedQuery).then(results => {
      if (active) {
        setSuggestions(results);
        setShowSuggestions(true);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    if (onManualLocation) {
      onManualLocation(suggestion.latitude, suggestion.longitude, suggestion.name);
      onClose();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleAllow = () => {
    setLoading(true);
    onAllow();
    // This timeout ensures we show the loading state briefly
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError("Please enter a location");
      return;
    }
    
    setLoading(true);
    setSearchError("");
    
    try {
      const coords = await getCoordinatesFromName(searchQuery);
      if (coords.length > 0 && onManualLocation) {
        onManualLocation(coords[0].latitude, coords[0].longitude, searchQuery);
        onClose();
      } else {
        setSearchError("Location not found. Please try another search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchError("Error finding location. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-900/90 rounded-xl shadow-xl w-full max-w-sm mx-auto p-6 relative transition-colors duration-500">
        <DialogHeader>
          <div className={`mx-auto p-3 rounded-full w-16 h-16 flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-blue-100'}`}>
            {showError ? (
              <AlertTriangle className="h-8 w-8 text-red-500" />
            ) : (
              <MapPin className="h-8 w-8 text-blue-500" />
            )}
          </div>
          <DialogTitle className="text-center pt-4 text-gray-900 dark:text-gray-100">
            {showError ? "Location Error" : "Location Access"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2 text-gray-600 dark:text-gray-300">
            {showError 
              ? "We couldn't access your location. Please allow location access or search for your location manually."
              : "Dawn to Dusk Weather needs your location to provide accurate weather forecasts for your area."}
          </DialogDescription>
        </DialogHeader>

        {/* Unit toggles */}
        <div className="flex flex-col gap-2 pb-2">
          {/* Temperature unit toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Temperature:</span>
            <button
              className={`px-2 py-1 rounded-l font-medium text-xs transition-colors duration-150 ${preferences.temperatureUnit === 'celsius' ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
              onClick={() => setTemperatureUnit('celsius')}
              disabled={preferences.temperatureUnit === 'celsius'}
              aria-label="Show temperatures in Celsius"
            >
              °C
            </button>
            <button
              className={`px-2 py-1 rounded-r font-medium text-xs transition-colors duration-150 ${preferences.temperatureUnit === 'fahrenheit' ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
              onClick={() => setTemperatureUnit('fahrenheit')}
              disabled={preferences.temperatureUnit === 'fahrenheit'}
              aria-label="Show temperatures in Fahrenheit"
            >
              °F
            </button>
          </div>
          {/* Wind speed unit toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Wind:</span>
            <button
              className={`px-2 py-1 rounded-l font-medium text-xs transition-colors duration-150 ${preferences.windSpeedUnit === 'kmh' ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
              onClick={() => setWindSpeedUnit('kmh')}
              disabled={preferences.windSpeedUnit === 'kmh'}
              aria-label="Show wind speed in km/h"
            >
              km/h
            </button>
            <button
              className={`px-2 py-1 rounded-r font-medium text-xs transition-colors duration-150 ${preferences.windSpeedUnit === 'mph' ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
              onClick={() => setWindSpeedUnit('mph')}
              disabled={preferences.windSpeedUnit === 'mph'}
              aria-label="Show wind speed in mph"
            >
              mph
            </button>
          </div>
          {/* Precipitation unit toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-300">Precipitation:</span>
            <button
              className={`px-2 py-1 rounded-l font-medium text-xs transition-colors duration-150 ${preferences.precipitationUnit === 'mm' ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
              onClick={() => setPrecipitationUnit('mm')}
              disabled={preferences.precipitationUnit === 'mm'}
              aria-label="Show precipitation in mm"
            >
              mm
            </button>
            <button
              className={`px-2 py-1 rounded-r font-medium text-xs transition-colors duration-150 ${preferences.precipitationUnit === 'in' ? 'bg-blue-500 text-white' : 'text-blue-800 hover:bg-blue-200'}`}
              onClick={() => setPrecipitationUnit('in')}
              disabled={preferences.precipitationUnit === 'in'}
              aria-label="Show precipitation in inches"
            >
              in
            </button>
          </div>
        </div>
        {/* Manual location search - live suggestions */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={handleInputChange}
              className="pl-10 text-gray-900 dark:text-gray-100 placeholder:text-gray-500"
              autoFocus
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && (
              <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="block w-full text-left px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-700 text-sm text-gray-700 dark:text-gray-100 truncate"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.name}
                    </button>
                  ))
                ) : (
                  debouncedQuery.trim().length >= 2 && !loading && (
                    <div className="px-4 py-2 text-gray-600 dark:text-gray-300 text-sm">No locations found</div>
                  )
                )}
              </div>
            )} 
          </div>
          {searchError && (
            <p className="text-sm text-destructive">{searchError}</p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={onDeny}
            className="sm:w-auto w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-100"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleAllow}
            className="sm:w-auto w-full"
            disabled={loading}
          >
            {loading ? "Getting location..." : "Allow Location Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
