import { throwInvalidPathError } from "stew/utilities/throwInvalidPathError.ts";

export function manageTask<TaskResult>(
  someTask: Promise<TaskResult>
): [taskWorker: Promise<TaskResult>, taskController: AbortController] {
  const taskController = new AbortController();
  const taskWorker = new Promise<TaskResult>(
    (resolveTaskWorker, rejectTaskWorker) => {
      taskController.signal.addEventListener("abort", (someAbortTaskEvent) => {
        if (someAbortTaskEvent instanceof DOMException) {
          rejectTaskWorker(someAbortTaskEvent);
        } else {
          throwInvalidPathError("manageTask.onAbort");
        }
      });
      if (taskController.signal.aborted) {
        rejectTaskWorker(
          new DOMException(
            taskController.signal.reason ?? "unknown",
            "AbortError"
          )
        );
      }
      return someTask
        .then((someTaskResult) => {
          resolveTaskWorker(someTaskResult);
        })
        .catch((someTaskWorkerError) => {
          rejectTaskWorker(someTaskWorkerError);
        });
    }
  );
  return [taskWorker, taskController];
}
