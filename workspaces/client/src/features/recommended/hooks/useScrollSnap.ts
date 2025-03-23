import { useEffect, useRef } from 'react';

export function useScrollSnap({ scrollPadding }: { scrollPadding: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSnapping = useRef(false);

  useEffect(() => {
    if (containerRef.current == null) {
      return;
    }

    const handleScrollend = () => {
      if (containerRef.current == null) {
        return;
      }

      if (isSnapping.current) {
        return;
      }

      const childElements = Array.from(containerRef.current.children) as HTMLElement[];
      const childScrollPositions = childElements.map((element) => element.offsetLeft);
      const scrollPosition = containerRef.current.scrollLeft;
      const childIndex = childScrollPositions.reduce((prev, curr, index) => {
        return Math.abs(curr - scrollPosition) < Math.abs((childScrollPositions[prev] ?? 0) - scrollPosition)
          ? index
          : prev;
      }, 0);

      isSnapping.current = true;
      containerRef.current.scrollTo({
        behavior: 'smooth',
        left: (childScrollPositions[childIndex] ?? 0) - scrollPadding,
      });

      setTimeout(() => {
        isSnapping.current = false;
      }, 1000);
    };

    containerRef.current.addEventListener('scrollend', handleScrollend);

    return () => {
      containerRef.current?.removeEventListener('scrollend', handleScrollend);
    };
  }, [scrollPadding]);

  return containerRef;
}
