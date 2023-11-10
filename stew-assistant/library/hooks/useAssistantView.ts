import { useMemo, useState } from "../../../stew-library/deps/preact/hooks.ts";
import {
  BuildAssistantConfig,
  RequiredAssistantViewConfig,
  RequiredViewSectionConfig,
  ViewApi,
  ViewState,
} from "../types/AssistantConfig.ts";

export interface UseAssistantViewApi {
  assistantConfig: BuildAssistantConfig<
    string,
    string,
    Record<
      string,
      RequiredAssistantViewConfig<
        string,
        Array<RequiredViewSectionConfig<string>>
      >
    >
  >;
}

export function useAssistantView(api: UseAssistantViewApi) {
  const { assistantConfig } = api;
  const [viewStack, setViewStack] = useState<Array<ViewState>>([
    {
      viewConfig: assistantConfig.initialViewConfig,
      viewSectionStates:
        assistantConfig.initialViewConfig.getInitialViewSectionsState(),
    },
  ]);
  const viewApi = useMemo<ViewApi>(
    () => ({
      setSectionState: () => {},
      replaceView: () => {},
      launchView: () => {},
      resolveView: () => {},
      cancelView: () => {},
    }),
    []
  );
  return {
    viewApi,
    viewState: viewStack[viewStack.length - 1],
  };
}
