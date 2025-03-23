import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useSubscribeLoading() {
  return useStore((store) => store.features.layout.loading);
}
