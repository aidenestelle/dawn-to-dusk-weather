import React from "react";

import { ThemeToggle } from "@/components/ThemeToggle";

interface LocationHeaderProps {
  locationName: string;
}

export const LocationHeader: React.FC<LocationHeaderProps> = ({
  locationName
}) => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex items-center gap-3">
      <h1 className="text-2xl font-bold">{locationName}</h1>
    </div>
    <ThemeToggle className="ml-2" />
  </div>
);
