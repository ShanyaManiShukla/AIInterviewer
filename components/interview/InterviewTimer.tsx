'use client';

import { useEffect, useState } from 'react';

export function InterviewTimer({
  secondsTotal,
  running,
  onExpire,
}: {
  secondsTotal: number;
  running: boolean;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(secondsTotal);

  useEffect(() => {
    setRemaining(secondsTotal);
  }, [secondsTotal]);

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          onExpire();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, remaining, onExpire]);

  const pct = secondsTotal > 0 ? (remaining / secondsTotal) * 100 : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span>Time remaining</span>
        <span className={remaining <= 30 ? 'text-red-600' : 'text-foreground/90'}>
          {mins}:{secs.toString().padStart(2, '0')}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-1000 ease-linear"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
