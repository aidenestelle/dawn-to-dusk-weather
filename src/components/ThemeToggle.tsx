import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, Theme } from "@/context/ThemeContext";

const icons = {
  light: <Sun className="h-5 w-5 text-yellow-400" />, // sun icon
  dark: <Moon className="h-5 w-5 text-blue-500" />, // moon icon
  system: <Monitor className="h-5 w-5 text-gray-500" /> // monitor icon
};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        className={`p-2 rounded-full transition-colors ${theme === "light" ? "bg-yellow-100" : "hover:bg-gray-100"}`}
        aria-label="Light mode"
        onClick={() => setTheme("light")}
      >
        {icons.light}
      </button>
      <button
        className={`p-2 rounded-full transition-colors ${theme === "dark" ? "bg-blue-100" : "hover:bg-gray-100"}`}
        aria-label="Dark mode"
        onClick={() => setTheme("dark")}
      >
        {icons.dark}
      </button>
      <button
        className={`p-2 rounded-full transition-colors ${theme === "system" ? "bg-gray-200" : "hover:bg-gray-100"}`}
        aria-label="System theme"
        onClick={() => setTheme("system")}
      >
        {icons.system}
      </button>
    </div>
  );
}
