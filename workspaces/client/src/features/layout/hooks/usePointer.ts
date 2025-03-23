import { useEffect, useState } from 'react';

export function usePointer(): { x: number; y: number } {
  const [pos, setPos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const abortController = new AbortController();

    const handlePointerMove = (ev: MouseEvent) => {
      setPos([ev.clientX, ev.clientY]);
    };
    window.addEventListener('pointermove', handlePointerMove, { signal: abortController.signal });

    return () => {
      abortController.abort();
    };
  }, []);

  return { x: pos[0], y: pos[1] };
}
