import React from "react";
import { Clock } from "lucide-react";

interface LastUpdatedProps {
  lastUpdated: Date | null;
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({ lastUpdated }) =>
  lastUpdated ? (
    <div className="mt-auto pt-6 text-center text-xs opacity-70 flex items-center justify-center">
      <Clock className="h-3 w-3 mr-1" />
      Last updated: {lastUpdated.toLocaleTimeString()}
    </div>
  ) : null;
