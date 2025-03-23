import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useRef } from 'react';

interface Params {
  referenceId: string;
}

export function useStreamingRecommended({ referenceId }: Params) {
  const cursor = useRef(5);
  const recommended = useStore((s) => s.features.recommended);

  const fetchNext = async () => {
    console.log("Fetching more, cursor at" + cursor.current);
    await recommended.fetchRecommendedModulesByReferenceId({
      referenceId: "entrance",
      limit: 8,
      offset: cursor.current,
    });
    cursor.current += 8;

  };

  const moduleIds = recommended.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return { fetchNext, modules };
}
