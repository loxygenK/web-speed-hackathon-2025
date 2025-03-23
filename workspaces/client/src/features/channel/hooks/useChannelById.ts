import { useStore } from '@wsh-2025/client/src/app/StoreContext';

type ChannelId = string;

export function useChannelById(params: { channelId: ChannelId }) {
  const state = useStore((s) => s.features.channel);

  const channel = state.channels[params.channelId];

  return channel;
}
