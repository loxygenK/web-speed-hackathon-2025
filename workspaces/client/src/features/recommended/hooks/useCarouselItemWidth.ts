import { useCallback, useLayoutEffect, useRef, useState } from 'react';

const MIN_WIDTH = 276;
const GAP = 12;

// repeat(auto-fill, minmax(276px, 1fr)) を計算で求める
export function useCarouselItemWidth() {
  const [width, setWidth] = useState(MIN_WIDTH);
  const containerRef = useRef<HTMLDivElement>(null);

  const onResize = useCallback(() => {
    if (containerRef.current == null) {
      return;
    }

    const styles = window.getComputedStyle(containerRef.current);
    const innerWidth = containerRef.current.clientWidth - parseInt(styles.paddingLeft) - parseInt(styles.paddingRight);
    const itemCount = Math.max(0, Math.floor((innerWidth + GAP) / (MIN_WIDTH + GAP)));
    const itemWidth = Math.floor((innerWidth + GAP) / itemCount - GAP);

    setWidth(itemWidth);
  }, []);

  const resizeObserver = useRef(new ResizeObserver(entries => {
    const entry = entries[0];
    if(entry === undefined) {
      throw new Error("Unexpected observe result");
    }

    onResize();
  }));

  useLayoutEffect(() => {
    if(containerRef.current) {
      resizeObserver.current.observe(containerRef.current);
    }
  }, [containerRef.current]);

  return { ref: containerRef, width };
}
