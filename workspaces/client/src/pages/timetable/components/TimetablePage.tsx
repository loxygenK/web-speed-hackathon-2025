import { DateTime } from 'luxon';
import invariant from 'tiny-invariant';

import { useTimetable } from '@wsh-2025/client/src/features/timetable/hooks/useTimetable';
import { ChannelTitle } from '@wsh-2025/client/src/pages/timetable/components/ChannelTitle';
import { NewTimetableFeatureDialog } from '@wsh-2025/client/src/pages/timetable/components/NewTimetableFeatureDialog';
import { ProgramList } from '@wsh-2025/client/src/pages/timetable/components/ProgramList';
import { TimelineYAxis } from '@wsh-2025/client/src/pages/timetable/components/TimelineYAxis';
import { useShownNewFeatureDialog } from '@wsh-2025/client/src/pages/timetable/hooks/useShownNewFeatureDialog';
import { createFetchLogic } from '@wsh-2025/client/src/techdebt/useFetch';

const { prefetch, suspenseUntilFetch } = createFetchLogic(
  (store) => store.features,
  (features) => async () => {
    const now = DateTime.now();
    const since = now.startOf('day').toISO();
    const until = now.endOf('day').toISO();

    const [channels, programs] = await Promise.all([
      features.channel.fetchChannels(),
      features.timetable.fetchTimetable({ since, until }),
    ]);

    return { channels, programs };
  }
);

export { prefetch }

export const TimetablePage = () => {
  suspenseUntilFetch();

  const record = useTimetable();
  const shownNewFeatureDialog = useShownNewFeatureDialog();

  const channelIds = Object.keys(record);
  const programLists = Object.values(record);

  return (
    <>
      <title>番組表 - AremaTV</title>

      <div className="relative grid size-full overflow-x-auto overflow-y-auto [grid-template-areas:'channel_channel''hours_content']">
        <div className="sticky top-0 z-20 flex w-fit flex-row bg-[#000000] pl-[24px] [grid-area:channel]">
          {channelIds.map((channelId) => (
            <div key={channelId} className="shrink-0 grow-0">
              <ChannelTitle channelId={channelId} />
            </div>
          ))}
        </div>

        <div className="sticky inset-y-0 left-0 z-10 shrink-0 grow-0 bg-[#000000] [grid-area:hours]">
          <TimelineYAxis />
        </div>
        <div className="flex flex-row [grid-area:content]">
          {programLists.map((programList, index) => {
            const channelId = channelIds[index];
            invariant(channelId);
            return (
              <div key={channelIds[index]} className="shrink-0 grow-0">
                <ProgramList channelId={channelId} programList={programList} />
              </div>
            );
          })}
        </div>
      </div>

      <NewTimetableFeatureDialog isOpen={shownNewFeatureDialog} />
    </>
  );
};
