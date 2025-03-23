import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthUser() {
  const auth = useStore((s) => s.features.auth);
  return auth.user;
}
