import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useEffect } from 'react';

export function useLoading(loading: boolean) {
  const store = useStore((store) => store.features.layout.setLoading)

  useEffect(() => {
    store(loading);
  }, [loading]);
}
