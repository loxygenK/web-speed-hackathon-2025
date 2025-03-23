import { Flipped } from 'react-flip-toolkit';
import { NavLink } from 'react-router';

import { Hoverable } from '@wsh-2025/client/src/features/layout/components/Hoverable';

interface Props {
  series: {
    id: string;
    thumbnailUrl: string;
    title: string;
  };
}

export const SeriesItem = ({ series }: Props) => {
  return (
    <Hoverable classNames={{ hovered: 'opacity-75' }}>
      <NavLink viewTransition className="block w-full overflow-hidden" to={`/series/${series.id}`}>
        {({ isTransitioning }) => {
          return (
            <>
              <div className="relative overflow-hidden rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F]">
                <Flipped stagger flipId={isTransitioning ? `series-${series.id}` : 0}>
                  <img
                    alt=""
                    className="aspect-video"
                    src={series.thumbnailUrl.replace(/\?.+/, "") + "-400px.webp"}
                    width="100%"
                  />
                </Flipped>
              </div>
              <div className="p-[8px]">
                <div className="text-[14px] font-bold text-[#ffffff] line-clamp-2">
                  {series.title}
                </div>
              </div>
            </>
          );
        }}
      </NavLink>
    </Hoverable>
  );
};
