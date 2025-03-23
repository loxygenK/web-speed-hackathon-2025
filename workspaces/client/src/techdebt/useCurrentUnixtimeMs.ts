import { useEffect } from 'react';

import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type Purpose = "min" | "sec"

export function useCurrentUnixtimeMs(purpose: Purpose, callback?: () => void): number {
  const state = useStore((s) => s);
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout> | undefined;

    const updateCurrentTime = (initial?: true) => {
      state.pages.timetable.refreshCurrentUnixtimeMs();

      if(!initial) {
        callback?.();
      }

      const date = new Date();

      let nextMs: number;
      switch(purpose) {
        case "min":
          nextMs = (60 - date.getSeconds()) * 1000;
          break;
        case "sec":
          nextMs = (1000 - date.getMilliseconds());
          break;
      }
      nextMs += 100;

      clearTimeout(interval);
      interval = setTimeout(updateCurrentTime, nextMs);
    };

    updateCurrentTime(true);

    return () => {
      clearTimeout(interval);
    };
  }, [callback]);

  return state.pages.timetable.currentUnixtimeMs;
}
