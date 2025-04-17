import React from "react";
import { Card } from "@/components/ui/card";
import { Thermometer, Droplets, Wind } from "lucide-react";
import { formatTemperature } from "@/lib/utils/weather";

interface WeatherDetailsProps {
  currentWeather: any;
  hourlyForecast: any;
  currentHourIndex: number;
  temperatureUnit: "celsius" | "fahrenheit";
  windSpeedUnit: "kmh" | "mph";
}

import { WeatherIcon } from "@/components/WeatherIcon";

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({
  currentWeather,
  hourlyForecast,
  currentHourIndex,
  temperatureUnit,
  windSpeedUnit,
}) => {
  // Get current hour's icon and temperature
  const currentHourTime = hourlyForecast.time[currentHourIndex];
  const currentHourTemp = hourlyForecast.temperature_2m[currentHourIndex];
  const currentHourWeatherCode = hourlyForecast.weathercode[currentHourIndex];
  return (
    <>
      <div className="flex flex-col items-center justify-center mb-8">
        <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 dark:text-blue-200 mb-2">
          {new Date(currentHourTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
        </span>
        <WeatherIcon condition={currentHourWeatherCode} isDay={true} size={56} />
        <span className="text-5xl sm:text-6xl font-extrabold mt-2 mb-2 text-gray-900 dark:text-white">
          {Math.round(currentHourTemp)}°
        </span>
        <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">Current Hour</span>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
    <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-none transition-colors rounded-2xl shadow-md p-4 flex flex-col items-center animate-slide-up">
      <Thermometer className="h-6 w-6 mb-1 text-gray-900 dark:text-gray-100" />
      <span className="text-xs opacity-80">Feels like</span>
      <span className="font-bold">
        {formatTemperature(
          currentWeather.temperature,
          temperatureUnit
        )}
      </span>
    </Card>
    <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-none transition-colors rounded-2xl shadow-md p-4 flex flex-col items-center animate-slide-up" style={{ animationDelay: "100ms" }}>
      <Droplets className="h-6 w-6 mb-1 text-gray-900 dark:text-gray-100" />
      <span className="text-xs opacity-80">Humidity</span>
      <span className="font-bold">
        {hourlyForecast.relativehumidity_2m[currentHourIndex]}%
      </span>
    </Card>
    <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-none transition-colors rounded-2xl shadow-md p-4 flex flex-col items-center animate-slide-up" style={{ animationDelay: "200ms" }}>
      <Wind className="h-6 w-6 mb-1 text-gray-900 dark:text-gray-100" />
      <span className="text-xs opacity-80">Wind</span>
      <span className="font-bold">
        {windSpeedUnit === 'kmh'
          ? `${currentWeather.windspeed} km/h`
          : `${(currentWeather.windspeed * 0.621371).toFixed(1)} mph`}
      </span>
    </Card>
    <Card className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-none transition-colors rounded-2xl shadow-md p-4 flex flex-col items-center animate-slide-up" style={{ animationDelay: "300ms" }}>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1 text-blue-500 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-8.66l-.71.71M4.05 19.07l-.71-.71m16.97-7.07h-1M4 12H3m2.34-6.66l.71.71M19.95 4.93l.71.71" /><path d="M16 13a4 4 0 01-8 0c0-2.21 4-8 4-8s4 5.79 4 8z" /></svg>
      <span className="text-xs opacity-80">Precipitation</span>
      <span className="font-bold">
        {hourlyForecast.precipitation && typeof hourlyForecast.precipitation[currentHourIndex] !== 'undefined'
          ? (temperatureUnit === 'celsius'
              ? `${hourlyForecast.precipitation[currentHourIndex]} mm`
              : `${(hourlyForecast.precipitation[currentHourIndex] * 0.03937).toFixed(2)} in`)
          : hourlyForecast.precipitation_probability && typeof hourlyForecast.precipitation_probability[currentHourIndex] !== 'undefined'
            ? `${hourlyForecast.precipitation_probability[currentHourIndex]}%`
            : '-'}
      </span>
    </Card>
  </div>
    </>
  );
}
