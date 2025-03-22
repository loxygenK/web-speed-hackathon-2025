import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import * as batshit from '@yornaath/batshit';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',
  schema: createSchema({
    '/episodes': {
      output: schema.getEpisodesResponse,
      query: schema.getEpisodesRequestQuery,
    },
  }),
  throw: true,
});

const batcher = batshit.create({
  async fetcher(queries: { episodeId: string, excludeSeriesEpisodes: boolean | undefined }[]) {
    const data = await $fetch('/episodes', {
      query: {
        episodeIds: queries.map((q) => q.episodeId).join(','),
        excludeSeriesEpisode: queries[0]?.excludeSeriesEpisodes,
      },
    });
    return data;
  },
  resolver(items, query: { episodeId: string, excludeSeriesEpisodes: boolean | undefined }) {
    const item = items.find((item) => item.id === query.episodeId);
    if (item == null) {
      throw new Error('Episode is not found.');
    }
    return item;
  },
  scheduler: batshit.windowedFiniteBatchScheduler({
    maxBatchSize: 100,
    windowMs: 100,
  }),
});

interface EpisodeService {
  fetchEpisodeById: (query: {
    episodeId: string;
    excludeSeriesEpisodes?: boolean | undefined;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodeByIdResponse>>;
  fetchEpisodes: () => Promise<StandardSchemaV1.InferOutput<typeof schema.getEpisodesResponse>>;
}

export const episodeService: EpisodeService = {
  async fetchEpisodeById({ episodeId, excludeSeriesEpisodes }) {
    const channel = await batcher.fetch({ episodeId, excludeSeriesEpisodes });
    return channel;
  },
  async fetchEpisodes() {
    const data = await $fetch('/episodes', { query: {} });
    return data;
  },
};
