import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { createFetchLogic } from '@wsh-2025/client/src/techdebt/useFetch';

const { prefetch, suspenseUntilFetch } = createFetchLogic(
  (store) => store.features.recommended,
  (recommended) => async () => {
    const modules = await recommended.fetchRecommendedModulesByReferenceId({ limit: 1, referenceId: 'error' });
    return { modules };
  }
);

export { prefetch };

export const NotFoundPage = () => {
  suspenseUntilFetch();

  const modules = useRecommended({ referenceId: 'error' });
  const module = modules.at(0);

  return (
    <>
      <title>見つかりません - AremaTV</title>

      <div className="w-full px-[32px] py-[48px]">
        <section className="mb-[32px] flex w-full flex-col items-center justify-center gap-y-[20px]">
          <h1 className="text-[32px] font-bold text-[#ffffff]">ページが見つかりませんでした</h1>
          <p>あなたが見ようとしたページは、残念ながら見つけられませんでした。</p>
          <img alt="" className="h-auto w-[640px]" src="/public/animations/001.gif" />
        </section>
        <section>{module != null ? <RecommendedSection module={module} /> : null}</section>
      </div>
    </>
  );
};
