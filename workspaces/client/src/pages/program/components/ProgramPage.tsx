import { DateTime } from 'luxon';
import { Suspense, useCallback, useEffect, useRef } from 'react';
import { Flipped } from 'react-flip-toolkit';
import { Link, useNavigate, useParams } from 'react-router';
import { useUpdate } from 'react-use';
import invariant from 'tiny-invariant';

import { Player } from '@wsh-2025/client/src/features/player/components/Player';
import { PlayerType } from '@wsh-2025/client/src/features/player/constants/player_type';
import { useProgramById } from '@wsh-2025/client/src/features/program/hooks/useProgramById';
import { RecommendedSection } from '@wsh-2025/client/src/features/recommended/components/RecommendedSection';
import { useRecommended } from '@wsh-2025/client/src/features/recommended/hooks/useRecommended';
import { SeriesEpisodeList } from '@wsh-2025/client/src/features/series/components/SeriesEpisodeList';
import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { PlayerController } from '@wsh-2025/client/src/pages/program/components/PlayerController';
import { usePlayerRef } from '@wsh-2025/client/src/pages/program/hooks/usePlayerRef';
import { createFetchLogic } from '@wsh-2025/client/src/techdebt/useFetch';
import { useCurrentUnixtimeMs } from '@wsh-2025/client/src/techdebt/useCurrentUnixtimeMs';

const { prefetch, suspenseUntilFetch } = createFetchLogic(
  (store) => store.features,
  (features) => async ({ programId }: { programId: string }) => {
    const now = DateTime.now();
    const since = now.startOf('day').toISO();
    const until = now.endOf('day').toISO();

    const [program, channels, timetable, modules] = await Promise.all([
      features.program.fetchProgramById({ programId }),
      features.channel.fetchChannels(),
      features.timetable.fetchTimetable({ since, until }),
      features.recommended.fetchRecommendedModulesByReferenceId({ referenceId: programId })
    ]);
    return { channels, modules, program, timetable };
  }
)

export { prefetch };

export const ProgramPageImpl = () => {
  const { programId } = useParams();
  invariant(programId);

  suspenseUntilFetch({ programId });

  const program = useProgramById({ programId });
  invariant(program);

  const timetable = useTimetable();
  const nextProgram = timetable[program.channel.id]?.find((p) => {
    return DateTime.fromISO(program.endAt).equals(DateTime.fromISO(p.startAt));
  });

  const modules = useRecommended({ referenceId: programId });

  const playerRef = usePlayerRef();

  const forceUpdate = useUpdate();
  const navigate = useNavigate();
  const isArchivedRef = useRef(DateTime.fromISO(program.endAt) <= DateTime.now());
  const isBroadcastStarted = DateTime.fromISO(program.startAt) <= DateTime.now();

  useCurrentUnixtimeMs("min", useCallback(() => {
    console.log("Update!");

    if (isArchivedRef.current) {
      console.log("This is archived.");
      return;
    }

    if (DateTime.now() < DateTime.fromISO(program.endAt)) {
      console.log("The program is still on the live.");
      return;
    }

    // 放送中に次の番組が始まったら、画面をそのままにしつつ、情報を次の番組にする

    const nextId = nextProgram?.id;
    console.log("Up next:", nextId);
    if (nextId == null) {
      isArchivedRef.current = true;
      forceUpdate();
    }

    void navigate(`/programs/${nextId}`, {
      preventScrollReset: true,
      replace: true,
      state: { loaderAnimation: 'none' },
    });
  }, [isBroadcastStarted, nextProgram?.id]));

  return (
    <>
      <title>{`${program.title} - ${program.episode.series.title} - AremaTV`}</title>

      <div className="px-[24px] py-[48px]">
        <Flipped stagger flipId={`program-${program.id}`}>
          <div className="m-auto mb-[16px] max-w-[1280px] outline outline-[1px] outline-[#212121]">
            {isArchivedRef.current ? (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={program.thumbnailUrl} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">この番組は放送が終了しました</p>
                  <Link
                    className="block flex w-[160px] flex-row items-center justify-center rounded-[4px] bg-[#1c43d1] p-[12px] text-[14px] font-bold text-[#ffffff] disabled:opacity-50"
                    to={`/episodes/${program.episode.id}`}
                  >
                    見逃し視聴する
                  </Link>
                </div>
              </div>
            ) : isBroadcastStarted ? (
              <div className="relative size-full">
                <Player
                  className="size-full"
                  playerRef={playerRef}
                  playerType={PlayerType.VideoJS}
                  playlistUrl={`/streams/channel/${program.channel.id}/playlist.m3u8`}
                />
                <div className="absolute inset-x-0 bottom-0">
                  <PlayerController />
                </div>
              </div>
            ) : (
              <div className="relative size-full">
                <img alt="" className="h-auto w-full" src={program.thumbnailUrl} />

                <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#00000077] p-[24px]">
                  <p className="mb-[32px] text-[24px] font-bold text-[#ffffff]">
                    この番組は {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')} に放送予定です
                  </p>
                </div>
              </div>
            )}
          </div>
        </Flipped>

        <div className="mb-[24px]">
          <div className="text-[16px] text-[#ffffff] line-clamp-1">
            {program.episode.series.title}
          </div>
          <h1 className="mt-[8px] text-[22px] font-bold text-[#ffffff] line-clamp-2">
            {program.title}
          </h1>
          <div className="mt-[8px] text-[16px] text-[#999999]">
            {DateTime.fromISO(program.startAt).toFormat('L月d日 H:mm')}
            {' 〜 '}
            {DateTime.fromISO(program.endAt).toFormat('L月d日 H:mm')}
          </div>
          <div className="mt-[16px] text-[16px] text-[#999999] line-clamp-3">
            {program.description}
          </div>
        </div>

        {modules[0] != null ? (
          <div className="mt-[24px]">
            <RecommendedSection module={modules[0]} />
          </div>
        ) : null}

        <div className="mt-[24px]">
          <h2 className="mb-[12px] text-[22px] font-bold text-[#ffffff]">関連するエピソード</h2>
          <SeriesEpisodeList episodes={program.episode.series.episodes} selectedEpisodeId={program.episode.id} />
        </div>
      </div>
    </>
  );
};

export const ProgramPage = () => {
  return (
    <Suspense fallback={<></>}>
      <ProgramPageImpl />
    </Suspense>
  );
}
