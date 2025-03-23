import { useStore } from '@wsh-2025/client/src/app/StoreContext';

interface Params {
  programId: string;
}

export function useProgramById({ programId }: Params) {
  const programs = useStore((s) => s.features.program.programs);
  return programs[programId];
}
