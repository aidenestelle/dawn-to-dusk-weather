import React from "react";

interface UnitTogglesProps {
  temperatureUnit: "celsius" | "fahrenheit";
  windSpeedUnit: "kmh" | "mph";
  precipitationUnit: "mm" | "in";
  setTemperatureUnit: (unit: "celsius" | "fahrenheit") => void;
  setWindSpeedUnit: (unit: "kmh" | "mph") => void;
  setPrecipitationUnit: (unit: "mm" | "in") => void;
}

import { Thermometer, Wind, Droplets } from "lucide-react";

export const UnitToggles: React.FC<UnitTogglesProps> = ({
  temperatureUnit,
  windSpeedUnit,
  precipitationUnit,
  setTemperatureUnit,
  setWindSpeedUnit,
  setPrecipitationUnit,
}) => (
  <div className="flex flex-wrap gap-3 mt-2">
    {/* Temperature unit toggle */}
    <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-sm px-2 py-1">
      <Thermometer className="h-4 w-4 text-blue-400 mr-1" />
      <button
        className={`px-3 py-1 rounded-l-lg font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${temperatureUnit === 'celsius' ? 'bg-blue-500 text-white shadow' : 'text-blue-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        onClick={() => setTemperatureUnit('celsius')}
        disabled={temperatureUnit === 'celsius'}
        aria-label="Show temperatures in Celsius"
        tabIndex={0}
      >
        °C
      </button>
      <button
        className={`px-3 py-1 rounded-r-lg font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${temperatureUnit === 'fahrenheit' ? 'bg-blue-500 text-white shadow' : 'text-blue-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        onClick={() => setTemperatureUnit('fahrenheit')}
        disabled={temperatureUnit === 'fahrenheit'}
        aria-label="Show temperatures in Fahrenheit"
        tabIndex={0}
      >
        °F
      </button>
    </div>
    {/* Wind speed unit toggle */}
    <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-sm px-2 py-1">
      <Wind className="h-4 w-4 text-blue-400 mr-1" />
      <button
        className={`px-3 py-1 rounded-l-lg font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${windSpeedUnit === 'kmh' ? 'bg-blue-500 text-white shadow' : 'text-blue-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        onClick={() => setWindSpeedUnit('kmh')}
        disabled={windSpeedUnit === 'kmh'}
        aria-label="Show wind speed in km/h"
        tabIndex={0}
      >
        km/h
      </button>
      <button
        className={`px-3 py-1 rounded-r-lg font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${windSpeedUnit === 'mph' ? 'bg-blue-500 text-white shadow' : 'text-blue-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        onClick={() => setWindSpeedUnit('mph')}
        disabled={windSpeedUnit === 'mph'}
        aria-label="Show wind speed in mph"
        tabIndex={0}
      >
        mph
      </button>
    </div>
    {/* Precipitation unit toggle */}
    <div className="flex items-center gap-2 bg-white/60 dark:bg-gray-800/60 rounded-xl shadow-sm px-2 py-1">
      <Droplets className="h-4 w-4 text-blue-400 mr-1" />
      <button
        className={`px-3 py-1 rounded-l-lg font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${precipitationUnit === 'mm' ? 'bg-blue-500 text-white shadow' : 'text-blue-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        onClick={() => setPrecipitationUnit('mm')}
        disabled={precipitationUnit === 'mm'}
        aria-label="Show precipitation in mm"
        tabIndex={0}
      >
        mm
      </button>
      <button
        className={`px-3 py-1 rounded-r-lg font-semibold text-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${precipitationUnit === 'in' ? 'bg-blue-500 text-white shadow' : 'text-blue-800 dark:text-gray-100 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
        onClick={() => setPrecipitationUnit('in')}
        disabled={precipitationUnit === 'in'}
        aria-label="Show precipitation in inches"
        tabIndex={0}
      >
        in
      </button>
    </div>
  </div>
);
