import { useEffect } from "react";
import invariant from "tiny-invariant";

export function useResizeHandle(element: HTMLElement | null, callback: (element: Element) => void) {
  useEffect(() => {
    if(!element) {
      return;
    }

    const resizeObserver = new ResizeObserver((res) => {
      invariant(res[0]);
      callback(res[0]?.target);
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, [element, callback]);
}
