import { useState, useCallback, useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns null during SSR, then the factory result on the client.
 * Uses useSyncExternalStore so React handles the server→client
 * transition with a synchronous re-render — no hydration mismatch,
 * no setState in effects, no refs read during render.
 *
 * The factory is called once and cached. Call reset() to regenerate
 * (e.g., for "play again" in game sessions).
 */
export function useClientValue<T>(factory: () => T): [T | null, () => void] {
  const [version, setVersion] = useState(0);
  const [store] = useState(() => {
    let cached: { version: number; value: T } | null = null;
    return {
      getSnapshot(v: number): T {
        if (!cached || cached.version !== v) {
          cached = { version: v, value: factory() };
        }
        return cached.value;
      },
    };
  });

  const value = useSyncExternalStore(
    subscribe,
    () => store.getSnapshot(version),
    () => null,
  );

  const reset = useCallback(() => setVersion((v) => v + 1), []);
  return [value, reset];
}
