
import { useState } from "react";
import { useDebounce } from "use-debounce";
import { Search, X, MapPin, History, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCoordinatesFromName } from "@/lib/api";
import { useUserPreferences } from "@/context/UserPreferencesContext";

interface LocationSearchProps {
  onLocationSelected: (lat: number, lon: number, name: string) => void;
  className?: string;
}

export function LocationSearch({
  onLocationSelected,
  className = "",
}: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 500);
  const [suggestions, setSuggestions] = useState<Array<{ name: string; lat: number; lon: number }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { preferences, addSearchedLocation } = useUserPreferences();

  // Search for locations when query changes
  const searchLocations = async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      // Use the Nominatim API via our utility function
      const coords = await getCoordinatesFromName(query);
      if (coords) {
        // For simplicity, we're just setting one result
        // A real implementation would show multiple suggestions
        setSuggestions([
          {
            name: query,
            lat: coords.latitude,
            lon: coords.longitude,
          },
        ]);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error searching locations:", error);
      setSuggestions([]);
    }
    setIsSearching(false);
  };

  // Handle search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (name: string, lat: number, lon: number) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    setSuggestions([]);
    // Add to search history
    addSearchedLocation(name);
    // Notify parent component
    onLocationSelected(lat, lon, name);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && !isSearching) {
      searchLocations(searchQuery);
    }
  };

  // Search based on debounced query
  useState(() => {
    if (debouncedQuery) {
      searchLocations(debouncedQuery);
    }
  });

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover shadow-md rounded-md z-10 max-h-60 overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Searching...</span>
            </div>
          ) : (
            <>
              {/* Search results */}
              {suggestions.length > 0 ? (
                <div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={`suggestion-${index}`}
                      className="w-full text-left px-4 py-3 flex items-center hover:bg-muted transition-colors"
                      onClick={() => handleLocationSelect(suggestion.name, suggestion.lat, suggestion.lon)}
                    >
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{suggestion.name}</span>
                    </button>
                  ))}
                </div>
              ) : debouncedQuery && debouncedQuery.length > 1 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No locations found
                </div>
              ) : null}

              {/* Recent locations */}
              {preferences.lastSearchedLocations.length > 0 && (
                <div className="border-t border-border">
                  <div className="px-4 py-2 text-xs text-muted-foreground font-medium">
                    Recent Searches
                  </div>
                  {preferences.lastSearchedLocations.map((location, index) => (
                    <button
                      key={`recent-${index}`}
                      className="w-full text-left px-4 py-2 flex items-center hover:bg-muted transition-colors"
                      onClick={() => {
                        setSearchQuery(location);
                        setShowSuggestions(false);
                        searchLocations(location);
                      }}
                    >
                      <History className="h-3 w-3 mr-2 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{location}</span>
                    </button>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      // Clear search history functionality would go here
                    }}
                    className="w-full justify-start px-4 py-2 h-auto font-normal text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-2" />
                    Clear search history
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
