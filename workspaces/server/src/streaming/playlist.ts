import type { WSB2025DB } from "@wsh-2025/server/src/drizzle/database";
import dedent from "dedent";
import path from "path";
import { fileURLToPath } from "url";

export const STREAM_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../streams');
export const THUMBNAIL_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../thumbnail');

// There's no video manipulation, so it (should)
const playlistCache: Map<string, string> = new Map();

export async function getEpisodePlaylist(database: WSB2025DB, episodeId: string) {
  const cached = playlistCache.get(episodeId);
  if(cached !== undefined) {
    return cached;
  }

  const episode = await database.query.episode.findFirst({
    where(episode, { eq }) {
      return eq(episode.id, episodeId);
    },
    with: {
      stream: true,
    },
  });

  if (episode == null) {
    throw new Error('The episode is not found.');
  }

  const stream = episode.stream;

  const playlist = dedent`
    #EXTM3U
    #EXT-X-TARGETDURATION:3
    #EXT-X-VERSION:3
    #EXT-X-MEDIA-SEQUENCE:1
    ${Array.from({ length: stream.numberOfChunks }, (_, idx) => {
      return dedent`
        #EXTINF:2.000000,
        /streams/${stream.id}/${String(idx).padStart(3, '0')}.ts
      `;
    }).join('\n')}
    #EXT-X-ENDLIST
  `;

  playlistCache.set(episodeId, playlist);

  return playlist;
}
