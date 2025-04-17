import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeatherIcon } from "@/components/WeatherIcon";
import { Umbrella, Wind } from "lucide-react";
import { formatDay } from "@/lib/utils/weather";
import { mapWeatherCode } from "@/lib/utils/weather";

interface ForecastTabsProps {
  dailyForecast: any;
  hourlyForecast: any;
  currentHourIndex: number;
  preferences: any;
}

export const ForecastTabs: React.FC<ForecastTabsProps> = ({ dailyForecast, hourlyForecast, currentHourIndex, preferences }) => (
  <Tabs defaultValue="daily" className="animate-fade-in">
    <TabsList className="grid grid-cols-2 mb-4 bg-white/20 backdrop-blur-md sticky top-0 z-10 shadow-sm rounded-t-xl" aria-label="Forecast type tabs">
      <TabsTrigger value="daily">7 Days</TabsTrigger>
      <TabsTrigger value="hourly">Hourly</TabsTrigger>
    </TabsList>
    <TabsContent value="daily" className="mt-4 animate-fade-in" aria-label="7-day forecast">
      <div className="w-full max-w-2xl mx-auto border-t border-blue-100 dark:border-blue-900/40 shadow-sm mb-4" />
      <Card className="bg-gradient-to-br from-white/60 to-blue-50/50 dark:from-gray-800/60 dark:to-blue-900/30 backdrop-blur-md border border-blue-100 dark:border-blue-900/40 shadow-lg rounded-xl transition-all">
        <div className="divide-y divide-blue-100 dark:divide-blue-900/40" role="list" aria-label="7-day forecast list">
          {dailyForecast.time.map((day: string, index: number) => {
            const condition = mapWeatherCode(dailyForecast.weathercode[index]);
            return (
              <div key={day} className={`flex flex-col sm:flex-row items-center justify-between p-4 gap-2 sm:gap-0 transition-all duration-200 rounded-lg animate-slide-in ${index === 0 ? 'bg-blue-100 dark:bg-blue-900/60 shadow-md font-bold' : 'hover:bg-blue-50/40 dark:hover:bg-blue-900/20'}`}
                role="listitem"
                aria-current={index === 0 ? 'true' : undefined}
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
                <div className="flex items-center gap-4">
                  <span className="flex items-center text-xs">
                    <Umbrella className="h-4 w-4 mr-1 text-blue-300" />
                    {dailyForecast.precipitation_probability_max[index] != null
                      ? `${dailyForecast.precipitation_probability_max[index]}%`
                      : '-'}
                  </span>
                  <span className="flex items-center text-xs">
                    <Wind className="h-4 w-4 mr-1 text-blue-600" />
                    {dailyForecast.windspeed_10m_max && preferences.windSpeedUnit === 'kmh'
                      ? `${dailyForecast.windspeed_10m_max[index]} km/h`
                      : dailyForecast.windspeed_10m_max
                        ? `${(dailyForecast.windspeed_10m_max[index] * 0.621371).toFixed(1)} mph`
                        : '-'}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm opacity-80 dark:text-gray-100">
                      {Math.round(dailyForecast.temperature_2m_min[index])}°
                    </span>
                    <div className="w-16 h-1 rounded-full bg-white/50 dark:bg-gray-700 mx-2">
                      <div 
                        className="h-full rounded-full bg-white dark:bg-gray-100"
                        style={{ 
                          width: `${((dailyForecast.temperature_2m_max[index] - dailyForecast.temperature_2m_min[index]) /
                            (Math.max(...dailyForecast.temperature_2m_max) - Math.min(...dailyForecast.temperature_2m_min))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-bold">
                      {Math.round(dailyForecast.temperature_2m_max[index])}°
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </TabsContent>
    <TabsContent value="hourly" className="mt-4 animate-fade-in" aria-label="Hourly forecast">
      <div className="w-full max-w-2xl mx-auto border-t border-blue-100 dark:border-blue-900/40 shadow-sm mb-4" />
      <Card className="bg-gradient-to-br from-white/60 to-blue-50/50 dark:from-gray-800/60 dark:to-blue-900/30 backdrop-blur-md border border-blue-100 dark:border-blue-900/40 shadow-lg rounded-xl transition-all max-h-[540px] overflow-y-auto">
        <div className="divide-y divide-blue-100 dark:divide-blue-900/40" role="list" aria-label="hourly forecast list">
          {(() => {
            // Show all entries from current hour onward, but only display 7 at a time (scrollable)
            const start = currentHourIndex;
            const visible = hourlyForecast.time.slice(start);
            return visible.map((time: string, i: number) => {
              const index = start + i;
              const isCurrent = index === currentHourIndex;
              const condition = mapWeatherCode(hourlyForecast.weathercode[index]);
              return (
                <div
                  key={time}
                  className={`flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 gap-3 sm:gap-0 transition-all duration-200 rounded-xl animate-slide-in border border-transparent sm:border-0 shadow-none sm:shadow-md bg-white/80 dark:bg-gray-900/40 sm:bg-inherit sm:dark:bg-inherit
                    ${isCurrent ? 'bg-blue-100 dark:bg-blue-900/60 shadow-md font-bold ring-2 ring-blue-400' : 'hover:bg-blue-50/40 dark:hover:bg-blue-900/20'}
                  `}
                  role="listitem"
                  aria-current={isCurrent ? 'true' : undefined}
                >
                  {/* Top: Time, Icon, Temp (mobile stacked, desktop inline) */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-start w-full sm:w-auto gap-3 sm:gap-0 mb-2 sm:mb-0">
                    <span className="text-lg sm:text-sm font-semibold opacity-90 dark:text-gray-100 w-20 sm:w-12 text-center">
                      {new Date(time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
                    </span>
                    <WeatherIcon condition={condition} isDay={true} size={36} />
                    <span className="text-2xl sm:text-lg font-bold ml-2 sm:ml-0">
                      {Math.round(hourlyForecast.temperature_2m[index])}°
                    </span>
                  </div>
                  {/* Bottom: Details (stacked on mobile, row on desktop) */}
                  <div className="flex flex-wrap sm:flex-row items-center gap-x-4 gap-y-2 sm:gap-4 flex-1 justify-center">
                    <span className="flex items-center text-xs gap-1 opacity-90">
                      <Umbrella className="h-4 w-4 text-blue-400 mr-1" />
                      <span className="w-10">{hourlyForecast.precipitation_probability ? `${hourlyForecast.precipitation_probability[index]}%` : '-'}</span>
                    </span>
                    <span className="flex items-center text-xs gap-1 opacity-90">
                      <Wind className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="w-14">{preferences.windSpeedUnit === 'kmh'
                        ? `${hourlyForecast.windspeed_10m[index]} km/h`
                        : `${(hourlyForecast.windspeed_10m[index] * 0.621371).toFixed(1)} mph`}</span>
                    </span>
                    {hourlyForecast.humidity && (
                      <span className="flex items-center text-xs gap-1 opacity-90">
                        <span className="inline-block w-4 h-4 bg-gradient-to-tr from-blue-300 to-blue-600 rounded-full mr-1" title="Humidity" />
                        <span className="w-8">{hourlyForecast.humidity[index]}%</span>
                      </span>
                    )}
                    {hourlyForecast.apparent_temperature && (
                      <span className="flex items-center text-xs gap-1 opacity-90">
                        <span className="inline-block w-4 h-4 bg-gradient-to-tr from-orange-200 to-orange-400 rounded-full mr-1" title="Feels Like" />
                        <span className="w-10">{Math.round(hourlyForecast.apparent_temperature[index])}°</span>
                        <span className="opacity-60">feels</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </Card>
    </TabsContent>
  </Tabs>
);
