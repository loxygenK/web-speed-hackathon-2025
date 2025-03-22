import { createStore } from "@wsh-2025/client/src/app/createStore";
import { useStore } from '@wsh-2025/client/src/app/StoreContext';
import type { ExtractState } from "zustand/vanilla";

import { useOnce } from "./useOnce";
import { use } from "react";
import { Params } from "react-router";

export function createFetchLogic<T, U, R extends Params[]>(
  select: (store: ExtractState<ReturnType<typeof createStore>>) => T,
  fetcher: (store: T) => (...params: R) => Promise<U>,
) {
  let promise: Promise<U> | undefined;
  let promiseKey: (string | undefined)[] | undefined;

  const useFetch = (...params: R) => {
    const store = useStore((s) => select(s));
    useOnce(() => {
      console.log("useFetch");
      void fetcher(store)(...params);
    })
  };
  const suspenseUntilFetch = (...params: R) => {
    const store = useStore((s) => select(s));
    const deps = params.flatMap((s) => Object.entries(s).flatMap((s) => s));

    if(promise === undefined || !(promiseKey?.every((key, i) => key === deps[i]))) {
      promise = fetcher(store)(...params);
      promiseKey = deps;
    }
    use(promise);
  };
  const prefetch = async (store: ReturnType<typeof createStore>, ...params: R) => {
    // Prefetching doesn't help for now
    // const modules = await fetcher(select(store.getState()))(...params);
    // return { modules };
  };

  return { useFetch, suspenseUntilFetch, prefetch };
}
