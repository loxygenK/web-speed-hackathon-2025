/* eslint-disable sort/object-properties */
import 'zod-openapi/extend';

import { z } from 'zod';

export const channel = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  logoUrl: z.string().openapi({ example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png' }),
  name: z.string().openapi({ example: 'AREMA NEWS' }),
});

export const episode = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  title: z.string().openapi({ example: '第1話 吾輩は猫である' }),
  description: z.string().openapi({
    example:
      '『吾輩は猫である』（わがはいはねこである）は、夏目漱石の長編小説であり、処女小説である。1905年（明治38年）1月、『ホトトギス』にて発表されたのだが、好評を博したため、翌1906年（明治39年）8月まで継続した。上、1906年10月刊、中、1906年11月刊、下、1907年5月刊。この文章は、クリエイティブ・コモンズ 表示-継承 4.0 国際 パブリック・ライセンスのもとで公表されたウィキペディアの項目「吾輩は猫である」（https://ja.wikipedia.org/wiki/吾輩は猫である）を素材として二次利用しています。',
  }),
  order: z.number().openapi({ example: 1 }),
  seriesId: z.string().openapi({ format: 'uuid' }),
  streamId: z.string().openapi({ format: 'uuid' }),
  thumbnailUrl: z.string().openapi({
    example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png',
  }),
  premium: z.boolean().openapi({ example: false }),
});

export const series = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  title: z.string().openapi({ example: '吾輩は猫である' }),
  description: z.string().openapi({
    example:
      '『吾輩は猫である』（わがはいはねこである）は、夏目漱石の長編小説であり、処女小説である。1905年（明治38年）1月、『ホトトギス』にて発表されたのだが、好評を博したため、翌1906年（明治39年）8月まで継続した。上、1906年10月刊、中、1906年11月刊、下、1907年5月刊。この文章は、クリエイティブ・コモンズ 表示-継承 4.0 国際 パブリック・ライセンスのもとで公表されたウィキペディアの項目「吾輩は猫である」（https://ja.wikipedia.org/wiki/吾輩は猫である）を素材として二次利用しています。',
  }),
  thumbnailUrl: z.string().openapi({
    example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png',
  }),
});

export const program = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  title: z.string().openapi({ example: '吾輩は猫である' }),
  description: z.string().openapi({
    example:
      '『吾輩は猫である』（わがはいはねこである）は、夏目漱石の長編小説であり、処女小説である。1905年（明治38年）1月、『ホトトギス』にて発表されたのだが、好評を博したため、翌1906年（明治39年）8月まで継続した。上、1906年10月刊、中、1906年11月刊、下、1907年5月刊。この文章は、クリエイティブ・コモンズ 表示-継承 4.0 国際 パブリック・ライセンスのもとで公表されたウィキペディアの項目「吾輩は猫である」（https://ja.wikipedia.org/wiki/吾輩は猫である）を素材として二次利用しています。',
  }),
  startAt: z.string().openapi({ format: 'date-time' }),
  endAt: z.string().openapi({ format: 'date-time' }),
  thumbnailUrl: z.string().openapi({
    example: 'https://image.example.com/assets/d13d2e22-a7ff-44ba-94a3-5f025f2b63cd.png',
  }),
  channelId: z.string().openapi({ format: 'uuid' }),
  episodeId: z.string().openapi({ format: 'uuid' }),
});

export const recommendedItem = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  order: z.number().openapi({ example: 1 }),
  seriesId: z.string().nullable().openapi({ format: 'uuid' }),
  episodeId: z.string().nullable().openapi({ format: 'uuid' }),
  moduleId: z.string().openapi({ format: 'uuid' }),
});

export const tinySeries = series
  .pick({ id: true, thumbnailUrl: true, title: true })

export const tinyCarouselEpisode = episode
  .pick({ id: true, premium: true, thumbnailUrl: true, title: true })

export const carouselModule = z.object({
  type: z.literal("carousel"),
  items: z.array(
    recommendedItem.extend({
      series: tinySeries
        .extend({
          episodes: z.array(tinyCarouselEpisode),
        })
        .nullable(),
      episode: tinyCarouselEpisode
        .extend({
          series: tinySeries.extend({
            episodes: z.array(tinyCarouselEpisode),
          }),
        })
        .nullable(),
    }),
  ),
});

export const tinyJumobtronEpisode = episode
  .pick({ id: true, description: true, title: true })

export const jumbotronModule = z.object({
  type: z.literal("jumbotron"),
  items: z.tuple([z.object({
    episode: tinyJumobtronEpisode.strip(),
  })]),
});

export const recommendedModule = z.object({
  id: z.string().openapi({ format: 'uuid' }),
  order: z.number().openapi({ example: 1 }),
  title: z.string().openapi({ example: '『チャンスの時間』を見ていたあなたにオススメ' }),
  referenceId: z.string().openapi({ format: 'uuid' }),
  type: z.enum(["carousel", "jumbotron"]),
})

export const user = z.object({
  id: z.number().openapi({ format: '0' }),
  email: z.string().openapi({ example: 'user123' }),
  password: z.string().openapi({ example: 'password123' }),
});

// GET /channels
export const getChannelsRequestQuery = z.object({
  channelIds: z.string().optional(),
});
export const getChannelsResponse = z.array(channel.extend({}));

// GET /channels/:channelId
export const getChannelByIdRequestParams = z.object({
  channelId: z.string(),
});
export const getChannelByIdResponse = channel.extend({});

// GET /episodes
export const getEpisodesRequestQuery = z.object({
  episodeIds: z.string().optional(),
  excludeSeriesEpisode: z.coerce.boolean().optional(),
});
export const getEpisodesResponse = z.array(
  episode.extend({
    series: series.extend({
      episodes: z.array(episode.extend({})).optional().default([]),
    }),
  }),
);

// GET /episodes/:episodeId
export const getEpisodeByIdRequestParams = z.object({
  episodeId: z.string(),
});
export const getEpisodeByIdResponse = episode.extend({
  series: series.extend({
    episodes: z.array(episode.extend({})),
  }),
});

// GET /series
export const getSeriesRequestQuery = z.object({
  seriesIds: z.string().optional(),
});
export const getSeriesResponse = z.array(
  series.extend({
    episodes: z.array(episode.extend({})),
  }),
);

// GET /series/:seriesId
export const getSeriesByIdRequestParams = z.object({
  seriesId: z.string(),
});
export const getSeriesByIdResponse = series.extend({
  episodes: z.array(episode.extend({})),
});

// GET /timetable
export const getTimetableRequestQuery = z.object({
  since: z.coerce.string().openapi({ format: 'date-time' }),
  until: z.coerce.string().openapi({ format: 'date-time' }),
});
export const getTimetableResponse = z.array(program.extend({}));

// GET /programs
export const getProgramsRequestQuery = z.object({
  programIds: z.string().optional(),
});
export const getProgramsResponse = z.array(
  program.extend({
    channel: channel.extend({}),
    episode: episode.extend({
      series: series.extend({
        episodes: z.array(episode.extend({})),
      }),
    }),
  }),
);

// GET /programs/:programId
export const getProgramByIdRequestParams = z.object({
  programId: z.string(),
});
export const getProgramByIdResponse = program.extend({
  channel: channel.extend({}),
  episode: episode.extend({
    series: series.extend({
      episodes: z.array(episode.extend({})),
    }),
  }),
});

// GET /recommended/:referenceId
export const getRecommendedModulesRequestQuery = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});
export const getRecommendedModulesRequestParams = z.object({
  referenceId: z.string(),
});
export const getRecommendedModulesResponse = z.array(
  recommendedModule
  .strip()
  .omit({ type: true })
  .and(
    z.discriminatedUnion("type", [carouselModule.strip(), jumbotronModule.strip()])
  ),
);

// POST /signIn
export const signInRequestBody = z.object({
  email: z.string(),
  password: z.string(),
});
export const signInResponse = z.object({
  id: z.number(),
  email: z.string(),
});

// POST /signUp
export const signUpRequestBody = z.object({
  email: z.string(),
  password: z.string(),
});
export const signUpResponse = z.object({
  id: z.number(),
  email: z.string(),
});

// GET /users/me
export const getUserResponse = z.object({
  id: z.number(),
  email: z.string(),
});
