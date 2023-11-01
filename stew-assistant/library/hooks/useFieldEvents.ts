import { useEffect } from "../../../stew-library/deps/preact/hooks.ts";

export interface UseFieldEventsApi {
  someFieldConfig: any;
  formState: any;
  formApi: any;
}

export function useFieldEvents(api: UseFieldEventsApi) {
  const { someFieldConfig, formState, formApi } = api;
  useEffect(() => {
    if (someFieldConfig.fieldOnChange) {
      someFieldConfig.fieldOnChange({
        formState,
        formApi,
      });
    }
  }, [formState.fieldValues[someFieldConfig.fieldKey]]);
}
