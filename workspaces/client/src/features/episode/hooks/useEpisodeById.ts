import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  episodeId: string;
}

export function useEpisodeById({ episodeId }: Params) {
  const episodes = useStore((s) => s.features.episode.episodes);
  return episodes[episodeId];
}
