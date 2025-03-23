import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useStreamingRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useStreamingRecommendation';
import { createFetchLogic } from '@wsh-2025/client/src/techdebt/useFetch';
import { useOnUserInteract } from '@wsh-2025/client/src/techdebt/useOnUserInteract';
import { useEffect } from 'react';

const { prefetch } = createFetchLogic(
  (store) => store.features.recommended,
  (store) => () => {
    return store.fetchRecommendedModulesByReferenceId({ referenceId: "entrance", limit: 5 });
  },
  { prefetch: true }
)

export { prefetch };

export const HomePage = () => {
  const { fetchNext, modules } = useStreamingRecommended({ referenceId: 'entrance' });

  useEffect(() => {
    if(modules.length === 0) {
      fetchNext();
    };
  }, []);

  useOnUserInteract(() => {
    setTimeout(async () => {
      await fetchNext();
      await fetchNext();
    }, 50);
  });

  return (
    <>
      <title>Home - AremaTV</title>
      <div className="w-full py-[48px]">
        {modules.toSorted((a, b) => a.order - b.order).map((module) => {
          return (
            <div key={module.id} className="mb-[24px] px-[24px]">
              <RecommendedSection module={module} />
            </div>
          );
        })}
      </div>
    </>
  );
};
