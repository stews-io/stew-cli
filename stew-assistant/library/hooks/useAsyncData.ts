import { resolve } from "https://deno.land/std@0.201.0/path/resolve.ts";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../../stew-library/deps/preact/hooks.ts";
import { throwInvalidPathError } from "../../../stew-library/utilities/throwInvalidPathError.ts";

export interface UseAsyncData<
  AsyncData,
  FetchAsyncDataApi extends Record<string, any>
> {
  fetchAsyncData: (api: FetchAsyncDataApi) => Promise<AsyncData>;
  fetchAsyncDataApi: FetchAsyncDataApi;
}

export function useAsyncData<
  AsyncData,
  CustomFetchAsyncDataApi extends Record<string, any>
>(
  api: UseAsyncData<AsyncData, CustomFetchAsyncDataApi>
): [asyncDataState: AsyncDataState<AsyncData>, asyncDataApi: AsyncDataApi] {
  const { fetchAsyncData, fetchAsyncDataApi } = api;
  const [asyncDataState, setAsyncDataState] = useState<
    AsyncDataState<AsyncData>
  >({
    asyncStatus: "initial",
  });
  const apiDependenciesRef = useRef({
    fetchAsyncData,
    fetchAsyncDataApi,
    asyncDataState,
  });
  useEffect(() => {
    apiDependenciesRef.current = {
      fetchAsyncData,
      fetchAsyncDataApi,
      asyncDataState,
    };
  }, [fetchAsyncData, fetchAsyncDataApi, asyncDataState]);
  const asyncDataApi = useMemo<AsyncDataApi>(() => {
    return {
      runWorker: () => {
        setAsyncDataState((currentAsyncDataState) => {
          if (currentAsyncDataState.asyncStatus === "fetching") {
            asyncDataApi.cancelWorker("refetching");
          }
          const nextAsyncTimestamp = Date.now();
          return {
            asyncStatus: "fetching",
            asyncTimestamp: nextAsyncTimestamp,
            asyncWorker: runAsyncWorker({
              fetchAsyncData: apiDependenciesRef.current.fetchAsyncData,
              fetchAsyncDataApi: apiDependenciesRef.current.fetchAsyncDataApi,
              asyncTimestamp: nextAsyncTimestamp,
            })
              .then((someAsyncData) => {
                setAsyncDataState((currentAsyncDataState) =>
                  currentAsyncDataState.asyncStatus === "fetching" &&
                  currentAsyncDataState.asyncTimestamp === nextAsyncTimestamp
                    ? {
                        asyncStatus: "success",
                        asyncTimestamp: nextAsyncTimestamp,
                        asyncData: someAsyncData,
                      }
                    : currentAsyncDataState
                );
              })
              .catch((someWorkerError) => {
                console.log("bbb");
                if (
                  someWorkerError instanceof DOMException &&
                  someWorkerError.name === "AbortError"
                ) {
                  setAsyncDataState((currentAsyncDataState) =>
                    currentAsyncDataState.asyncStatus === "fetching" &&
                    currentAsyncDataState.asyncTimestamp === nextAsyncTimestamp
                      ? {
                          asyncStatus: "canceled",
                          asyncTimestamp: nextAsyncTimestamp,
                          cancelReason: someWorkerError.message,
                        }
                      : currentAsyncDataState
                  );
                } else {
                  setAsyncDataState((currentAsyncDataState) =>
                    currentAsyncDataState.asyncStatus === "fetching" &&
                    currentAsyncDataState.asyncTimestamp === nextAsyncTimestamp
                      ? {
                          asyncStatus: "error",
                          asyncTimestamp: nextAsyncTimestamp,
                          asyncError: someWorkerError,
                        }
                      : currentAsyncDataState
                  );
                }
              }),
          };
        });
      },
      cancelWorker: (cancelReason: string) => {
        if (
          apiDependenciesRef.current.asyncDataState.asyncStatus === "fetching"
        ) {
          const cancelWorkerEvent = new CustomEvent(
            getCancelWorkerEventId({
              someAsyncTimestamp:
                apiDependenciesRef.current.asyncDataState.asyncTimestamp,
            }),
            {
              detail: {
                cancelReason,
              },
            }
          );
          globalThis.dispatchEvent(cancelWorkerEvent);
        }
      },
    };
  }, []);
  return [asyncDataState, asyncDataApi];
}

interface RunAsyncWorkerApi<
  AsyncData,
  FetchAsyncDataApi extends Record<string, any>
> extends Pick<
    UseAsyncData<AsyncData, FetchAsyncDataApi>,
    "fetchAsyncData" | "fetchAsyncDataApi"
  > {
  asyncTimestamp: number;
}

function runAsyncWorker<
  AsyncData,
  FetchAsyncDataApi extends Record<string, any>
>(api: RunAsyncWorkerApi<AsyncData, FetchAsyncDataApi>): Promise<AsyncData> {
  const { asyncTimestamp, fetchAsyncData, fetchAsyncDataApi } = api;
  return new Promise((resolveAsyncWorker, rejectAsyncWorker) => {
    const cancelWorkerEventId = getCancelWorkerEventId({
      someAsyncTimestamp: asyncTimestamp,
    });
    const cancelWorkerEventHandler = (someCancelWorkerEvent: Event) => {
      if (
        someCancelWorkerEvent instanceof CustomEvent &&
        someCancelWorkerEvent.detail.cancelReason
      ) {
        rejectAsyncWorker(
          new DOMException(
            someCancelWorkerEvent.detail.cancelReason,
            "AbortError"
          )
        );
      } else {
        throwInvalidPathError("runAsyncWorker.cancelWorkerEventHandler");
      }
    };
    globalThis.addEventListener(cancelWorkerEventId, cancelWorkerEventHandler);
    fetchAsyncData(fetchAsyncDataApi)
      .then((fetchAsyncDataResult) => {
        resolveAsyncWorker(fetchAsyncDataResult);
      })
      .finally(() => {
        globalThis.removeEventListener(
          cancelWorkerEventId,
          cancelWorkerEventHandler
        );
      });
  });
}

interface GetCancelWorkerEventIdApi {
  someAsyncTimestamp: number;
}

function getCancelWorkerEventId(api: GetCancelWorkerEventIdApi) {
  const { someAsyncTimestamp } = api;
  return `cancel_${someAsyncTimestamp}`;
}

type AsyncDataState<AsyncData> =
  | SuccessAsyncDataState<AsyncData>
  | ErrorAsyncDataState
  | CanceledAsyncDataState
  | FetchingAsyncDataState
  | InitialAsyncDataState;

interface SuccessAsyncDataState<AsyncData>
  extends ResultAsyncDataState<"success"> {
  asyncData: AsyncData;
}

interface ErrorAsyncDataState extends ResultAsyncDataState<"error"> {
  asyncError: unknown;
}

interface CanceledAsyncDataState extends ResultAsyncDataState<"canceled"> {
  cancelReason: string;
}

interface FetchingAsyncDataState extends ResultAsyncDataState<"fetching"> {
  asyncWorker: Promise<void>;
}

interface InitialAsyncDataState extends AsyncDataStateBase<"initial"> {}

interface ResultAsyncDataState<AsyncStatus>
  extends AsyncDataStateBase<AsyncStatus> {
  asyncTimestamp: number;
}

interface AsyncDataStateBase<AsyncStatus> {
  asyncStatus: AsyncStatus;
}

interface AsyncDataApi {
  runWorker: () => void;
  cancelWorker: (cancelReason: string) => void;
}
