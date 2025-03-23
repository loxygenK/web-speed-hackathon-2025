import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useRef } from 'react';

interface Params {
  referenceId: string;
}

export function useStreamingRecommended({ referenceId }: Params) {
  const cursor = useRef(3);
  const recommended = useStore((s) => s.features.recommended);

  const fetchNext = () => {
    recommended.fetchRecommendedModulesByReferenceId({
      referenceId: "entrance",
      limit: 5,
      offset: cursor.current,
    });
    cursor.current += 5;

    console.log("Fetching more, cursor at" + cursor.current);
  };

  const moduleIds = recommended.references[referenceId];

  const modules = (moduleIds ?? [])
    .map((moduleId) => recommended.recommendedModules[moduleId])
    .filter(<T>(m: T): m is NonNullable<T> => m != null);

  return { fetchNext, modules };
}
