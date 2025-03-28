import { StandardSchemaV1 } from '@standard-schema/spec';
import * as schema from '@wsh-2025/schema/src/api/schema';
import { DateTime } from 'luxon';
import { ReactElement, useCallback, useRef, useState } from 'react';
import { ArrayValues } from 'type-fest';

import { ProgramDetailDialog } from '@wsh-2025/client/src/pages/timetable/components/ProgramDetailDialog';
import { useColumnWidth } from '@wsh-2025/client/src/pages/timetable/hooks/useColumnWidth';
import { useSelectedProgramId } from '@wsh-2025/client/src/pages/timetable/hooks/useSelectedProgramId';
import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import { useResizeHandle } from '@wsh-2025/client/src/techdebt/useResizeHandle';
import classNames from 'classnames';

interface Props {
  height: number;
  program: ArrayValues<StandardSchemaV1.InferOutput<typeof schema.getTimetableResponse>>;
}

export const Program = ({ height, program }: Props): ReactElement => {
  const width = useColumnWidth(program.channelId);

  const [selectedProgramId, setProgram] = useSelectedProgramId();
  const shouldProgramDetailDialogOpen = program.id === selectedProgramId;
  const onClick = () => {
    setProgram(program);
  };

  const currentUnixtimeMs = useStore((s) => s.pages.timetable.currentUnixtimeMs);
  const isBroadcasting =
    DateTime.fromISO(program.startAt).toMillis() <= DateTime.fromMillis(currentUnixtimeMs).toMillis() &&
    DateTime.fromMillis(currentUnixtimeMs).toMillis() < DateTime.fromISO(program.endAt).toMillis();
  const isArchived = DateTime.fromISO(program.endAt).toMillis() <= DateTime.fromMillis(currentUnixtimeMs).toMillis();

  const titleRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // This is not needed...?
  const [shouldImageBeVisible, setShouldImageBeVisible] = useState<boolean>(true);
  useResizeHandle(titleRef.current, useCallback(() => {
    if(imageRef.current == null || titleRef.current == null) {
      return;
    }

    const imageHeight = imageRef.current.clientHeight;
    const titleHeight = titleRef.current.clientHeight;
    setShouldImageBeVisible(imageHeight <= (height - titleHeight - 24));

  }, [imageRef.current, titleRef.current, height]));

  const [imageSizeSuffix, setImageSizeSuffix] = useState("-400px.webp");
  useResizeHandle(imageRef.current, useCallback(() => {
    const width = imageRef.current?.clientWidth ?? 0;

    let suffix = "";
    if(width < 500) {
      suffix = "-400px.webp"
    } else if (width < 1400) {
      suffix = "-1280px.webp"
    } else {
      suffix = "";
    }

    if(imageSizeSuffix !== suffix) {
      setImageSizeSuffix(suffix);
    }
  }, []));

  return (
    <>
        <button
          className={classNames(
            "w-auto border-[1px] border-solid border-[#000000] px-[12px] py-[8px] text-left",
            isArchived ? "hover:brightness-200" : "hover:brightness-125"
          )}
          style={{
            width,
            height,
            backgroundColor: isBroadcasting ? '#FCF6E5' : '#212121',
            opacity: `${isArchived ? 50 : 100}%`,
          }}
          type="button"
          onClick={onClick}
        >
          <div className="flex size-full flex-col overflow-hidden">
            <div ref={titleRef} className="mb-[8px] flex flex-row items-start justify-start">
              <span
                className="mr-[8px] shrink-0 grow-0 text-[14px] font-bold"
                style={{
                  color: isBroadcasting ? '#767676' : '#999999'
                }}
              >
                {DateTime.fromISO(program.startAt).toFormat('mm')}
              </span>
              <div
                className="grow-1 shrink-1 overflow-hidden text-[14px] font-bold line-clamp-3"
                style={{
                  color: isBroadcasting ? '#212121' : '#ffffff'
                }}
              >
                {program.title}
              </div>
            </div>
            <div className="w-full">
              <div ref={imageRef} className="w-full aspect-video">
                {
                  shouldImageBeVisible && (
                    <img
                      alt=""
                      className="!block aspect-video pointer-events-none w-full rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]"
                      src={program.thumbnailUrl.replace("?", `${imageSizeSuffix}?`)}
                      loading="lazy"
                    />
                  )
                }
              </div>
            </div>
          </div>
        </button>
      <ProgramDetailDialog isOpen={shouldProgramDetailDialogOpen} program={program} />
    </>
  );
};
