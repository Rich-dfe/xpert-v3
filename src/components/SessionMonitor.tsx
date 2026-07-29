"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function SessionMonitor() {
  const { data: session } = useSession();

  const [minutesRemaining, setMinutesRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!session?.expiresAt) {
      return;
    }

    const updateCounter = () => {
      const now = Math.floor(Date.now() / 1000);

      const remaining = Math.floor(
        (session.expiresAt - now) / 60
      );

      setMinutesRemaining(remaining);
    };

    updateCounter();

    const timer = setInterval(updateCounter, 60000);

    return () => clearInterval(timer);

  }, [session]);

  if (minutesRemaining === null) {
    return null;
  }

  return (
    minutesRemaining > 0 ? <div className="px-2 py-2 text-sm text-green-400">Session: {minutesRemaining} mins remaining</div> : <div className="px-2 py-2 text-sm text-red-400 animate-pulse">Session Expired: {Math.abs(minutesRemaining)} mins ago</div>
  );
}