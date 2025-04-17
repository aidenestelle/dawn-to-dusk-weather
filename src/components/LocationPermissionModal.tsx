
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Search, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getCoordinatesFromName } from "@/lib/api";

interface LocationPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
  onManualLocation?: (lat: number, lon: number, name: string) => void;
  showError?: boolean;
}

export function LocationPermissionModal({
  open,
  onClose,
  onAllow,
  onDeny,
  onManualLocation,
  showError = false,
}: LocationPermissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");

  const handleAllow = () => {
    setLoading(true);
    onAllow();
    // This timeout ensures we show the loading state briefly
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchError("Please enter a location");
      return;
    }
    
    setLoading(true);
    setSearchError("");
    
    try {
      const coords = await getCoordinatesFromName(searchQuery);
      if (coords && onManualLocation) {
        onManualLocation(coords.latitude, coords.longitude, searchQuery);
        onClose();
      } else {
        setSearchError("Location not found. Please try another search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      setSearchError("Error finding location. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`mx-auto p-3 rounded-full w-16 h-16 flex items-center justify-center ${showError ? 'bg-red-100' : 'bg-blue-100'}`}>
            {showError ? (
              <AlertTriangle className="h-8 w-8 text-red-500" />
            ) : (
              <MapPin className="h-8 w-8 text-blue-500" />
            )}
          </div>
          <DialogTitle className="text-center pt-4">
            {showError ? "Location Error" : "Location Access"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {showError 
              ? "We couldn't access your location. Please allow location access or search for your location manually."
              : "Dawn to Dusk Weather needs your location to provide accurate weather forecasts for your area."}
          </DialogDescription>
        </DialogHeader>

        {/* Manual location search */}
        <form onSubmit={handleManualSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchError && (
            <p className="text-sm text-destructive">{searchError}</p>
          )}
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading || !searchQuery.trim()}
          >
            {loading ? "Searching..." : "Search Location"}
          </Button>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={onDeny}
            className="sm:w-auto w-full"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleAllow}
            className="sm:w-auto w-full"
            disabled={loading}
          >
            {loading ? "Getting location..." : "Allow Location Access"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
