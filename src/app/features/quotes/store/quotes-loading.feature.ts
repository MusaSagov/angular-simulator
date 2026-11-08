import { patchState, signalStoreFeature,  withMethods,  withState,} from '@ngrx/signals';

interface ILoadingState {
  loading: boolean;
  error: string | null;
}

export function withLoading() {
  return signalStoreFeature(
    withState<ILoadingState>({
      loading: false,
      error: null,
    }),
    withMethods((store) => ({
      startLoading: () => {
        patchState(store, {
          loading: true,
          error: null,
        });
      },
      finishLoading: () => {
        patchState(store, {
          loading: false,
        });
      },
      setLoadingError: (message: string) => {
        patchState(store, {
          loading: false,
          error: message,
        });
      },
    })),
  );
}