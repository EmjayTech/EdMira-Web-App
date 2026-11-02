'use client';

import { useCallback, useEffect, useState } from 'react';
import { friendlyError } from '@/api/errors';

/**
 * Runs an async loader and exposes loading / error / reload state.
 * Errors are turned into a student-friendly sentence.
 */
export const useAsync = <T>(loader: () => Promise<T>, deps: unknown[]) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Same API as the mobile hook: callers pass the loader's dependencies.
  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  const run = useCallback(loader, deps);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await run());
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setLoading(false);
    }
  }, [run]);

  useEffect(() => {
    // Loading on mount / when deps change is the point of this hook.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload();
  }, [reload]);

  return { data, loading, error, reload };
};
