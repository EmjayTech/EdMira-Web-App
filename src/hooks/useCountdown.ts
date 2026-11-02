'use client';

import { useCallback, useEffect, useState } from 'react';

/** Seconds left on a countdown; `restart(n)` starts it again. */
export const useCountdown = (initialSeconds: number) => {
  const [endsAt, setEndsAt] = useState(() => Date.now() + initialSeconds * 1000);
  const [left, setLeft] = useState(initialSeconds);

  useEffect(() => {
    const tick = () => setLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)));
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [endsAt]);

  const restart = useCallback((seconds: number) => setEndsAt(Date.now() + seconds * 1000), []);
  return { left, done: left === 0, restart };
};
