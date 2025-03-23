import { useStore } from '@wsh-2025/client/src/app/StoreContext';

export function useAuthDialogType() {
  const auth = useStore((s) => s.features.auth);
  return auth.dialog;
}
