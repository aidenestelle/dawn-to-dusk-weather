
import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useWeather } from "@/hooks/use-weather";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { LocationPermissionModal } from "@/components/LocationPermissionModal";
import { LocationSearch } from "@/components/LocationSearch";
import { WeatherIcon } from "@/components/WeatherIcon";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  // State for location name
  const [locationName, setLocationName] = useState<string>("Loading location...");
  const [showLocationModal, setShowLocationModal] = useState<boolean>(false);
  
  // Access user preferences
  const { preferences } = useUserPreferences();
  
  // Get geolocation
  const {
    coordinates,
    loading: locationLoading,
    error: locationError,
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
    }
  }, [coordinates, locationLoading, hasRequestedBefore]);
  
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
  };
  
  // Handle refresh button click
  const handleRefresh = () => {
    refreshWeather();
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
  
  // Render error state
  if (locationError || weatherError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-destructive/20 to-destructive/40 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-destructive">
              {locationError ? "Location Error" : "Weather Error"}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {locationError || weatherError}
            </p>
            <Button
              onClick={locationError ? requestGeolocation : refreshWeather}
              className="mr-2"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowLocationModal(true)}
            >
              Search Location
            </Button>
          </div>
        </div>
      </div>
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
    <div className={`min-h-screen ${backgroundClass} transition-all duration-500 text-white`}>
      <div className="container max-w-md mx-auto px-4 py-8 flex flex-col min-h-screen">
        {/* Location header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{locationName}</h1>
            <p className="text-sm opacity-80">
              {formatFullDate(new Date().toISOString())}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Location search */}
        <LocationSearch 
          onLocationSelected={handleLocationSelected} 
          className="mb-6"
        />
        
        {/* Current weather */}
        <div className="text-center my-8 animate-fade-in">
          <WeatherIcon 
            condition={weatherCondition}
            isDay={isDay}
            size={96}
            className="mb-4 mx-auto"
          />
          <h2 className="text-6xl font-bold mb-2">
            {formatTemperature(
              currentWeather.temperature, 
              preferences.temperatureUnit
            )}
          </h2>
          <p className="text-xl opacity-90 capitalize">
            {weatherCondition.replace("-", " ")}
          </p>
        </div>
        
        {/* Weather details */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 flex flex-col items-center animate-slide-up">
            <Thermometer className="h-6 w-6 mb-1" />
            <span className="text-xs opacity-80">Feels like</span>
            <span className="font-bold">
              {formatTemperature(
                currentWeather.temperature, 
                preferences.temperatureUnit
              )}
            </span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 flex flex-col items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
            <Droplets className="h-6 w-6 mb-1" />
            <span className="text-xs opacity-80">Humidity</span>
            <span className="font-bold">
              {hourlyForecast.relativehumidity_2m[currentHourIndex]}%
            </span>
          </div>
          
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-4 flex flex-col items-center animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Wind className="h-6 w-6 mb-1" />
            <span className="text-xs opacity-80">Wind</span>
            <span className="font-bold">
              {currentWeather.windspeed} km/h
            </span>
          </div>
        </div>
        
        {/* Forecast tabs */}
        <Tabs defaultValue="hourly" className="animate-fade-in">
          <TabsList className="grid grid-cols-2 mb-4 bg-white/20 backdrop-blur-md">
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">7 Days</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="mt-0">
            <Card className="bg-white/20 backdrop-blur-md border-none">
              <div className="overflow-x-auto p-4">
                <div className="flex gap-4">
                  {hourlyForecast.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => {
                    const i = currentHourIndex + index;
                    const weatherCode = hourlyForecast.weathercode[i];
                                        const condition = mapWeatherCode(weatherCode);
                    const isHourDay = hourlyForecast.is_day[i] === 1;
                    
                    return (
                      <div 
                        key={time} 
                        className="flex flex-col items-center min-w-14"
                      >
                        <span className="text-xs opacity-80">
                          {index === 0 ? "Now" : formatHour(time)}
                        </span>
                        <WeatherIcon 
                          condition={condition}
                          isDay={isHourDay}
                          size={28}
                          className="my-2"
                        />
                        <span className="text-sm font-medium">
                          {Math.round(hourlyForecast.temperature_2m[i])}°
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-0">
            <Card className="bg-white/20 backdrop-blur-md border-none">
              <div className="divide-y divide-white/10">
                {dailyForecast.time.map((day, index) => {
                  const condition = mapWeatherCode(dailyForecast.weathercode[index]);
                  
                  return (
                    <div 
                      key={day}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center">
                        <div className="w-10">
                          <WeatherIcon 
                            condition={condition}
                            isDay={true}
                            size={24}
                          />
                        </div>
                        <span className={`ml-2 ${index === 0 ? "font-medium" : ""}`}>
                          {index === 0 ? "Today" : formatDay(day)}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Umbrella className="h-4 w-4 mr-1 text-blue-300" />
                        <span className="text-xs mr-4">
                          {dailyForecast.precipitation_probability_max[index]}%
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm opacity-80">
                            {Math.round(dailyForecast.temperature_2m_min[index])}°
                          </span>
                          <div className="w-16 h-1 rounded-full bg-white/50">
                            <div 
                              className="h-full rounded-full bg-white"
                              style={{ 
                                width: `${(dailyForecast.temperature_2m_max[index] - dailyForecast.temperature_2m_min[index]) / 
                                        (Math.max(...dailyForecast.temperature_2m_max) - Math.min(...dailyForecast.temperature_2m_min)) * 100}%` 
                              }}
                            />
                          </div>
                          <span className="text-sm font-bold">
                            {Math.round(dailyForecast.temperature_2m_max[index])}°
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Last updated */}
        {lastUpdated && (
          <div className="mt-auto pt-6 text-center text-xs opacity-70 flex items-center justify-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>
      
      {/* Location permission modal */}
      <LocationPermissionModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        onAllow={requestGeolocation}
        onDeny={() => setShowLocationModal(false)}
      />
    </div>
  );
};

export default Index;
