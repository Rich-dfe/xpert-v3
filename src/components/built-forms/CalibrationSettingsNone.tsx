import { MessageCircleWarning } from "lucide-react";

export default function CalibrationSettingsNone() {
  return (
    <>
      <div className="flex items-center gap-2">
        <MessageCircleWarning className="h-5 w-5 text-muted-foreground" />
        There are no calibration settings required for this logger type.
      </div>
    </>
  );
}
