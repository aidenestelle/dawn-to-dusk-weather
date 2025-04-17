
import { 
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, 
  CloudDrizzle, CloudRain, CloudSnow, CloudLightning 
} from "lucide-react";
import { WeatherCondition, getWeatherIcon } from "@/lib/utils/weather";

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay: boolean;
  className?: string;
  size?: number;
}

export function WeatherIcon({ 
  condition, 
  isDay, 
  className = "", 
  size = 24 
}: WeatherIconProps) {
  // Get the icon name based on condition and time of day
  const iconName = getWeatherIcon(condition, Boolean(isDay));
  
  // Map icon name to the appropriate Lucide icon
  const renderIcon = () => {
    switch (iconName) {
      case "sun":
        return <Sun size={size} className={`text-yellow-400 ${className}`} />;
      case "moon":
        return <Moon size={size} className={`text-slate-200 ${className}`} />;
      case "cloud-sun":
        return <CloudSun size={size} className={`text-blue-400 ${className}`} />;
      case "cloud-moon":
        return <CloudMoon size={size} className={`text-slate-300 ${className}`} />;
      case "cloud":
        return <Cloud size={size} className={`text-gray-400 ${className}`} />;
      case "cloud-fog":
        return <CloudFog size={size} className={`text-gray-300 ${className}`} />;
      case "cloud-drizzle":
        return <CloudDrizzle size={size} className={`text-blue-300 ${className}`} />;
      case "cloud-rain":
        return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
      case "cloud-snow":
        return <CloudSnow size={size} className={`text-slate-200 ${className}`} />;
      case "cloud-lightning":
        return <CloudLightning size={size} className={`text-amber-400 ${className}`} />;
      default:
        return <Sun size={size} className={`text-yellow-400 ${className}`} />;
    }
  };

  return (
    <div className={`${isDay ? "animate-float" : "animate-pulse-slow"} inline-flex`}>
      {renderIcon()}
    </div>
  );
}
