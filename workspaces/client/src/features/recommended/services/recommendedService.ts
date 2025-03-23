import { createFetch, createSchema } from '@better-fetch/fetch';
import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';

const $fetch = createFetch({
  baseURL: process.env['API_BASE_URL'] ?? '/api',

  schema: createSchema({
    '/recommended/:referenceId': {
      query: schema.getRecommendedModulesRequestQuery,
      output: schema.getRecommendedModulesResponse,
    },
  }),
  throw: true,
});

interface RecommendedService {
  fetchRecommendedModulesByReferenceId: (params: {
    limit?: number | undefined;
    offset?: number | undefined;
    referenceId: string;
  }) => Promise<StandardSchemaV1.InferOutput<typeof schema.getRecommendedModulesResponse>>;
}

export const recommendedService: RecommendedService = {
  async fetchRecommendedModulesByReferenceId({ limit, offset, referenceId }) {
    const data = await $fetch('/recommended/:referenceId', {
      params: { referenceId },
      query: { limit, offset }
    });
    return data;
  },
};
