import { useEffect, useState } from "react";

function computeRemaining() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const diff = Math.max(0, end.getTime() - now.getTime());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours, minutes, seconds };
}

export function useMidnightCountdown() {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setTime(computeRemaining());
    const id = setInterval(() => setTime(computeRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");
  return {
    ...time,
    formatted: `${pad(time.hours)}h ${pad(time.minutes)}m ${pad(time.seconds)}s`,
  };
}
