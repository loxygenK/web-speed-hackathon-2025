import '@wsh-2025/server/src/setups/luxon';
import { STREAM_DIR } from '@wsh-2025/server/src/streaming/playlist';

import { generateThumbnail } from '@wsh-2025/server/src/streaming/thumbnail';
import { glob } from 'fs/promises';

async function main() {
  const dirs = await Array.fromAsync(glob(STREAM_DIR + "/*"));
  const streamingIds = dirs.map((dir) => {
    const lastSegment = dir.split("/").at(-1);

    if(lastSegment === undefined) {
      throw new Error("Last segment not found?");
    }

    return lastSegment
  });

  for (const streamingId of streamingIds) {
    await generateThumbnail(streamingId);
  }
}

void main();
