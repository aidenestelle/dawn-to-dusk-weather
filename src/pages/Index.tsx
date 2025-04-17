import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useWeather } from "@/hooks/use-weather";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { LocationPermissionModal } from "@/components/LocationPermissionModal";
import { LocationSearch } from "@/components/LocationSearch";
import { WeatherIcon } from "@/components/WeatherIcon";
import { LocationHeader } from "@/components/LocationHeader";
import { UnitToggles } from "@/components/UnitToggles";
import { WeatherDetails } from "@/components/WeatherDetails";
import { ForecastTabs } from "@/components/ForecastTabs";
import { LastUpdated } from "@/components/LastUpdated";
import { getLocationName } from "@/lib/api";
import { 
  formatTemperature, 
  mapWeatherCode, 
  getWeatherGradient,
  formatDay, 
  formatHour,
  formatFullDate,
  WeatherCondition
} from "@/lib/utils/weather";
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Clock, 
  Umbrella, 
  RefreshCw 
} from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Index = () => {
  // State for location name
  const [locationName, setLocationName] = useState<string>("Loading location...");
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  const [locationError, setLocationErrorState] = useState<boolean>(false);
  
  // Access user preferences
  const { preferences, setTemperatureUnit, setWindSpeedUnit, setPrecipitationUnit } = useUserPreferences();
  
  // Get geolocation
  const {
    coordinates,
    loading: locationLoading,
    error: locationErrorMsg,
    requestGeolocation,
    setManualCoordinates,
    hasRequestedBefore
  } = useGeolocation();
  
  // Get weather data
  const {
    data: weatherData,
    loading: weatherLoading,
    error: weatherError,
    refreshWeather,
    lastUpdated
  } = useWeather(coordinates, preferences.temperatureUnit);
  
  // Determine if we should show the location modal
  useEffect(() => {
    // Show the modal if we don't have coordinates and haven't requested before
    if (!coordinates && !locationLoading && !hasRequestedBefore()) {
      setShowLocationModal(true);
      setLocationErrorState(false);
    }
    
    // Show error modal if there's a location error
    if (locationErrorMsg && !coordinates) {
      setShowLocationModal(true);
      setLocationErrorState(true);
    }
  }, [coordinates, locationLoading, locationErrorMsg, hasRequestedBefore]);
  
  // Get location name when coordinates change
  useEffect(() => {
    const fetchLocationName = async () => {
      if (coordinates) {
        try {
          const name = await getLocationName(coordinates);
          setLocationName(name);
        } catch (error) {
          console.error("Error getting location name:", error);
          setLocationName("Unknown Location");
        }
      }
    };
    
    fetchLocationName();
  }, [coordinates]);
  
  // Handle location selection from search
  const handleLocationSelected = (lat: number, lon: number, name: string) => {
    setManualCoordinates({ latitude: lat, longitude: lon });
    setLocationName(name);
    setLocationErrorState(false); // Clear error
    setShowLocationModal(false); // Hide modal
    toast.success(`Weather for ${name} loaded`);
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    refreshWeather();
    toast.info("Weather information refreshed");
  };
  
  // Get weather condition and background
  const weatherCondition = weatherData?.current_weather
    ? mapWeatherCode(weatherData.current_weather.weathercode)
    : WeatherCondition.Unknown;
  
  const isDay = weatherData?.current_weather
    ? weatherData.current_weather.is_day === 1
    : true;
  
  const backgroundClass = getWeatherGradient(weatherCondition, isDay);
  
  // Get current hour index for hourly forecast
  const getCurrentHourIndex = () => {
    if (!weatherData?.hourly?.time) return 0;
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // Find the index of the current hour in the hourly forecast
    return weatherData.hourly.time.findIndex(timeString => {
      const forecastDate = new Date(timeString);
      return forecastDate.getHours() === currentHour && 
             forecastDate.getDate() === now.getDate();
    });
  };
  
  // Render loading state
  if (locationLoading || weatherLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-weather-cloudy-start to-weather-cloudy-end flex flex-col">
        <div className="container max-w-md mx-auto px-4 py-8 flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
          
          <div className="text-center my-8">
            <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
            <Skeleton className="h-12 w-32 mx-auto mb-2" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[0, 1, 2].map(i => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          
          <Skeleton className="h-64 rounded-lg mb-8" />
          
          <div className="mt-auto">
            <Skeleton className="h-10 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }
  
  // Always show the location permission modal if geolocation failed and no coordinates are available
  if ((locationErrorMsg || weatherError) && !coordinates) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-b from-destructive/20 to-destructive/40 flex items-center justify-center" />
        <LocationPermissionModal
          open={true}
          onClose={() => {}}
          onAllow={requestGeolocation}
          onDeny={() => {}}
          onManualLocation={handleLocationSelected}
          showError={true}
        />
      </>
    );
  }
  
  // Render weather data if available
  if (!weatherData) {
    return null;
  }
  
  const currentHourIndex = getCurrentHourIndex();
  const currentWeather = weatherData.current_weather;
  const dailyForecast = weatherData.daily;
  const hourlyForecast = weatherData.hourly;
  
  return (
    <>
      <div className={`min-h-screen ${backgroundClass} transition-all duration-500 text-gray-900 dark:text-gray-100 bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800`}>
        <div className="container max-w-lg mx-auto mt-8 mb-8 px-4 py-8 flex flex-col gap-8 dark:bg-gray-900/80 backdrop-blur-lg transition-colors duration-500">
          <LocationHeader
            locationName={locationName}
          />
          <div className="flex items-center mb-6 gap-2">
            <LocationSearch 
              onLocationSelected={handleLocationSelected} 
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              aria-label="Refresh weather"
              className="h-12 w-12 sm:h-10 sm:w-10"
            >
              <RefreshCw className="h-5 w-5 text-gray-700 dark:text-gray-100" />
            </Button>
          </div>
          <WeatherDetails
            currentWeather={currentWeather}
            hourlyForecast={hourlyForecast}
            currentHourIndex={currentHourIndex}
            temperatureUnit={preferences.temperatureUnit}
            windSpeedUnit={preferences.windSpeedUnit}
          />

          <UnitToggles
            temperatureUnit={preferences.temperatureUnit}
            windSpeedUnit={preferences.windSpeedUnit}
            precipitationUnit={preferences.precipitationUnit}
            setTemperatureUnit={setTemperatureUnit}
            setWindSpeedUnit={setWindSpeedUnit}
            setPrecipitationUnit={setPrecipitationUnit}
          />
          <ForecastTabs
            dailyForecast={dailyForecast}
            hourlyForecast={hourlyForecast}
            currentHourIndex={currentHourIndex}
            preferences={preferences}
          />
          <LastUpdated lastUpdated={lastUpdated} />
        </div>
      </div>
      {/* Location permission modal */}
      <LocationPermissionModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAllow={requestGeolocation}
        onDeny={() => setShowLocationModal(false)}
        onManualLocation={handleLocationSelected}
        showError={locationError}
      />
  </>
  );
};

export default Index;
  