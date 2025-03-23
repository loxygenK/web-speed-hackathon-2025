import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { useStreamingRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useStreamingRecommendation';
import { createFetchLogic } from '@wsh-2025/client/src/techdebt/useFetch';
import { useEffect, useRef } from 'react';

import InfiniteScroll from "react-infinite-scroll-component";

const { prefetch, suspenseUntilFetch } = createFetchLogic(
  (store) => store.features.recommended,
  (store) => () => {
    return store.fetchRecommendedModulesByReferenceId({ referenceId: "entrance", limit: 3 });
  },
  { prefetch: true }
)

export { prefetch };

export const HomePage = () => {
  const contentEnd = useRef<HTMLDivElement>(null);

  const { fetchNext, modules } = useStreamingRecommended({ referenceId: 'entrance' });

  useEffect(() => {
    if(contentEnd.current === null) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if(entry === undefined) {
        throw new Error("Expected intersection observer to be available");
      }

      console.log("Intersection Observer", entry);

      if(entry.isIntersecting) {
        fetchNext();
      }
    }, { rootMargin: "800px" });

    observer.observe(contentEnd.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
        <div ref={contentEnd} />
      </div>
    </>
  );
};
