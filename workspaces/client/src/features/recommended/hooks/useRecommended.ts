import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  referenceId: string;
}

export function useRecommended({ referenceId }: Params) {
  const references = useStore((s) => s.features.recommended.references);
  const modulesState = useStore((s) => s.features.recommended.recommendedModules);

  const moduleIds = references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => modulesState[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return modules;
}
