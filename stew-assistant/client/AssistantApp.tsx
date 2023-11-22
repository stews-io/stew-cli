import { useMemo, useState } from "stew/deps/preact/hooks.ts";
import {
  ClientApp,
  ClientAppProps,
  Page,
} from "../../stew-library/components/mod.ts";
import { createElement } from "../../stew-library/deps/preact/mod.ts";
import {
  BuildAssistantConfig,
  ViewApi,
} from "../library/types/AssistantConfig.ts";
// @deno-types="CssModule"

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: BuildAssistantConfig;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { viewStack, viewApi } = useAssistantView({
    assistantConfig,
  });
  const activeStackView = getActiveStackView(viewStack);
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        {activeStackView.viewConfig.viewSections.map((someSectionConfig) =>
          createElement(someSectionConfig.SectionDisplay, {
            key: someSectionConfig.sectionKey,
            sectionConfig: someSectionConfig,
            viewState: activeStackView.viewState,
            viewApi,
          })
        )}
      </Page>
    </ClientApp>
  );
}

interface UseAssistantViewApi
  extends Pick<AssitantAppProps, "assistantConfig"> {}

function useAssistantView(api: UseAssistantViewApi) {
  const { assistantConfig } = api;
  const [viewStack, setViewStack] = useState<ViewStack>([
    {
      viewConfig: assistantConfig.initialViewConfig,
      viewState: assistantConfig.initialViewConfig.getInitialViewState(),
    },
  ]);
  const viewApi = useMemo<InternalViewApi>(
    () => ({
      setViewState: (getNextViewState) => {
        setViewStack((currentViewStack) => {
          const activeStackView = getActiveStackView(currentViewStack);
          return [
            ...currentViewStack.slice(0, -1),
            {
              ...activeStackView,
              viewState: getNextViewState(activeStackView.viewState),
            },
          ];
        });
      },
      replaceView: ({ nextViewKey, nextViewState }) => {
        setViewStack((currentViewStack) => {
          return [
            ...currentViewStack.slice(0, -1),
            {
              viewConfig: assistantConfig.assistantViews[nextViewKey],
              viewState: nextViewState,
            },
          ];
        });
      },
    }),
    []
  );
  return {
    viewStack,
    viewApi,
  };
}

function getActiveStackView(someViewStack: ViewStack) {
  return someViewStack[someViewStack.length - 1];
}

type ViewStack = Array<StackView>;

interface StackView {
  viewConfig: BuildAssistantConfig["assistantViews"][string];
  viewState: unknown;
}

interface InternalViewApi
  extends ViewApi<
    (getNextViewState: (currentViewState: unknown) => unknown) => void,
    (api: { nextViewKey: string; nextViewState: unknown }) => void
  > {}
