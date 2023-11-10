import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../../stew-library/deps/preact/hooks.ts";
import { manageTask } from "../utilities/manageTask.ts";

export interface UseTaskApi<TaskDescriptionApi, TaskResult> {
  taskDescriptionApi: TaskDescriptionApi;
  taskDescription: (api: TaskDescriptionApi) => Promise<TaskResult>;
}

export function useTask<TaskWorkerApi, TaskResult>(
  api: UseTaskApi<TaskWorkerApi, TaskResult>
): [taskState: TaskState<TaskResult>, taskApi: TaskApi] {
  const { taskDescription, taskDescriptionApi } = api;
  const [taskState, setTaskState] = useState<TaskState<TaskResult>>({
    taskStatus: "initial",
  });
  const taskApiDependenciesRef = useRef({
    taskDescription,
    taskDescriptionApi,
    taskState,
  });
  useEffect(() => {
    taskApiDependenciesRef.current = {
      taskDescription,
      taskDescriptionApi,
      taskState,
    };
  }, [taskDescription, taskDescriptionApi, taskState]);
  const taskApi = useMemo<TaskApi>(
    () => ({
      runTask: () => {
        setTaskState((currentTaskState) => {
          if (currentTaskState.taskStatus === "fetching") {
            currentTaskState.taskController.abort("refetching");
          }
          const currentTaskDescription =
            taskApiDependenciesRef.current.taskDescription;
          const currentTaskDescriptionApi =
            taskApiDependenciesRef.current.taskDescriptionApi;
          const taskTimestampId = Date.now();
          const [taskDescriptionWorker, taskController] = manageTask(
            currentTaskDescription(currentTaskDescriptionApi)
          );
          return {
            taskStatus: "fetching",
            taskTimestampId,
            taskController,
            taskWorker: taskDescriptionWorker
              .then((taskResult) => {
                setTaskState((currentTaskState) =>
                  currentTaskState.taskStatus === "fetching" &&
                  currentTaskState.taskTimestampId === taskTimestampId
                    ? {
                        taskStatus: "success",
                        taskTimestampId,
                        taskResult,
                      }
                    : currentTaskState
                );
              })
              .catch((someTaskError) => {
                if (
                  someTaskError instanceof DOMException &&
                  someTaskError.name === "AbortError" &&
                  someTaskError.message === "refetching"
                ) {
                  // no-op
                } else if (
                  someTaskError instanceof DOMException &&
                  someTaskError.name === "AbortError"
                ) {
                  setTaskState((currentTaskState) =>
                    currentTaskState.taskStatus === "fetching" &&
                    currentTaskState.taskTimestampId === taskTimestampId
                      ? {
                          taskStatus: "canceled",
                          taskTimestampId,
                          taskCancelReason: someTaskError.message,
                        }
                      : currentTaskState
                  );
                } else {
                  setTaskState((currentTaskState) => {
                    return currentTaskState.taskStatus === "fetching" &&
                      currentTaskState.taskTimestampId === taskTimestampId
                      ? {
                          taskStatus: "error",
                          taskTimestampId,
                          taskError: someTaskError,
                        }
                      : currentTaskState;
                  });
                }
              }),
          };
        });
      },
      cancelTask: (taskCancelReason) => {
        const currentTaskState = taskApiDependenciesRef.current.taskState;
        if (currentTaskState.taskStatus === "fetching") {
          currentTaskState.taskController.abort(taskCancelReason);
        }
      },
    }),
    []
  );
  return [taskState, taskApi];
}

export type TaskState<TaskResult> =
  | SuccessTaskState<TaskResult>
  | ErrorTaskState
  | CanceledTaskState
  | FetchingTaskState
  | InitialTaskState;

interface SuccessTaskState<TaskResult>
  extends InitializedTaskStateBase<"success"> {
  taskResult: TaskResult;
}

interface ErrorTaskState extends InitializedTaskStateBase<"error"> {
  taskError: unknown;
}

interface CanceledTaskState extends InitializedTaskStateBase<"canceled"> {
  taskCancelReason: string;
}

interface FetchingTaskState extends InitializedTaskStateBase<"fetching"> {
  taskController: AbortController;
  taskWorker: Promise<void>;
}

interface InitializedTaskStateBase<TaskStatus extends string>
  extends TaskStateBase<TaskStatus> {
  taskTimestampId: number;
}

interface InitialTaskState extends TaskStateBase<"initial"> {}

interface TaskStateBase<TaskStatus extends string> {
  taskStatus: TaskStatus;
}

export interface TaskApi {
  runTask: () => void;
  cancelTask: (taskCancelReason: string) => void;
}
