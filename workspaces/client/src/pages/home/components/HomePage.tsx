import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { createFetchLogic } from '@wsh-2025/client/src/techdebt/useFetch';

const { prefetch, useFetch } = createFetchLogic(
  (store) => store.features.recommended,
  (store) => () => {
    return store.fetchRecommendedModulesByReferenceId({ referenceId: "entrance" });
  }
)

export { prefetch };

export const HomePage = () => {
  const modules = useRecommended({ referenceId: 'entrance' });
  useFetch();

  return (
    <>
      <title>Home - AremaTV</title>
      <div className="w-full py-[48px]">
        {modules.map((module) => {
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
