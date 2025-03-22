import { STREAM_DIR, THUMBNAIL_DIR } from "@wsh-2025/server/src/streaming/playlist";
import { glob } from "fs/promises";

import fs from "fs/promises";
import os from "os";
import path from "path";
import { spawnSync } from "child_process";

function ffmpeg(args: string[]) {
  console.log("Running FFmpeg: ", args.join(", "));

  console.log("----------------------");
  const child = spawnSync("ffmpeg", args, {
    stdio: "inherit",
  });
  console.log("----------------------");

  if(child.error != null) {
    throw child.error;
  }

  if(child.status === null || child.status > 0) {
    throw new Error(`FFmpeg failed with exit-code ${child.status}`);
  }
}

export async function generateThumbnail(streamId: string) {
  console.log("= Iterating segment files...")

  const segmentFilePaths = await Array.fromAsync(glob(path.join(STREAM_DIR, streamId) + "/*.ts"));

  const tmpdir = os.tmpdir();
  const allTs = path.join(tmpdir, "all.ts");

  const segmentFile = await Promise.all(segmentFilePaths.map((path) => fs.readFile(path)));
  const allTsPayload = Buffer.concat(segmentFile);
  await fs.writeFile(allTs, allTsPayload);

  const streamThumbnailDir = path.join(THUMBNAIL_DIR, streamId);
  await fs.mkdir(streamThumbnailDir, { recursive: true });

  const fullVideo = path.join(tmpdir, "fullVideo.mp4");
  ffmpeg([
    ['-y'],
    ['-i', allTs],
    ['-c:v', 'copy'],
    ['-map', '0:v:0'],
    ['-f', 'mp4'],
    [fullVideo],
  ].flat());

  // fps=30 とみなして、30 フレームごと（1 秒ごと）にサムネイルを生成
  ffmpeg([
    ['-y'],
    ['-i', fullVideo],
    ['-vf', "fps=1,scale=160:90"],
    ["-f", "image2"],
    [path.join(streamThumbnailDir, "%05d.png")],
  ].flat());
}
