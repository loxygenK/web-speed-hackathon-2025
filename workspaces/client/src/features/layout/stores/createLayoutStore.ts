import { lens } from '@dhmk/zustand-lens';

interface LayoutState {
  pointer: { x: number; y: number };
  loading: boolean;
}

interface LayoutActions {
  updatePointer: (pointer: { x: number; y: number }) => void;
  setLoading: (loading: boolean) => void;
}

export const createLayoutStoreSlice = () => {
  return lens<LayoutState & LayoutActions>((set) => ({
    pointer: { x: 0, y: 0 },
    loading: false,
    updatePointer: (pointer) => {
      set(() => ({ pointer }));
    },
    setLoading: (loading) => {
      set(() => ({ loading }));
    },
  }));
};
