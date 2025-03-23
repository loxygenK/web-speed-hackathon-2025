import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useRef } from 'react';

interface Params {
  referenceId: string;
}

export function useStreamingRecommended({ referenceId }: Params) {
  const recommended = useStore((s) => s.features.recommended);
  const cursor = useRef(recommended.references[referenceId]?.length ?? 0);

  const fetchNext = async () => {
    const fetching = cursor.current;
    cursor.current += 8;
    await recommended.fetchRecommendedModulesByReferenceId({
      referenceId: "entrance",
      limit: 8,
      offset: fetching,
    });
  };

  const moduleIds = recommended.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return { fetchNext, modules };
}
