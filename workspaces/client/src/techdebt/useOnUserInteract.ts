import { useEffect } from "react";

export function useOnUserInteract(callback: () => void) {
  useEffect(() => {
    const onInteract = () => {
      callback();
      unregister();
    };

    const unregister = () => {
      window.removeEventListener("scroll", onInteract);
      window.removeEventListener("mousemove", onInteract);
      window.removeEventListener("keydown", onInteract);
    };

    window.addEventListener("scroll", onInteract);
    window.addEventListener("mousemove", onInteract);
    window.addEventListener("keydown", onInteract);

    return () => { unregister() };
  }, [])
}
