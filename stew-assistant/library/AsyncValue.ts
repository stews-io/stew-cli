export type AsyncValue<T> =
  | SuccessAsyncValue<T>
  | LoadingAsyncValue
  | ErrorAsyncValue
  | NoneAsyncValue;

interface SuccessAsyncValue<T> extends AsyncValueBase<"success"> {
  value: T;
}

interface ErrorAsyncValue extends AsyncValueBase<"error"> {}

interface LoadingAsyncValue extends AsyncValueBase<"loading"> {
  valueWorker: Promise<void>;
}

interface NoneAsyncValue extends AsyncValueBase<"none"> {}

interface AsyncValueBase<ValueStatus extends string> {
  valueStatus: ValueStatus;
}
