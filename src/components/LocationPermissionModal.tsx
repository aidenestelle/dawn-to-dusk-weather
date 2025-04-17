
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
import { MapPin } from "lucide-react";

interface LocationPermissionModalProps {
  open: boolean;
  onClose: () => void;
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermissionModal({
  open,
  onClose,
  onAllow,
  onDeny,
}: LocationPermissionModalProps) {
  const [loading, setLoading] = useState(false);

  const handleAllow = () => {
    setLoading(true);
    onAllow();
    // This timeout ensures we show the loading state briefly
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-blue-500" />
          </div>
          <DialogTitle className="text-center pt-4">
            Location Access
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Dawn to Dusk Weather needs your location to provide accurate weather
            forecasts for your area. Your location data will only be used to
            display local weather information.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={onDeny}
            className="sm:w-auto w-full"
          >
            Use Manual Search
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
