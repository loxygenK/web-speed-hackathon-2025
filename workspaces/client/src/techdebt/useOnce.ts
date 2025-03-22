import { useEffect, useRef } from "react";

// I know this is a monstrous atrocity and I apologize but I wanted to make it work anyway
export function useOnce(callback: () => void) {
  const ran = useRef(false);

  useEffect(() => {
    if(ran.current) {
      return;
    }

    ran.current = true;
    callback();
  }, [])
}
