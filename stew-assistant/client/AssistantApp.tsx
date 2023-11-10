import {
  ClientApp,
  ClientAppProps,
  Page,
} from "../../stew-library/components/mod.ts";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "stew/deps/preact/hooks.ts";
import { createElement } from "../../stew-library/deps/preact/mod.ts";
// @deno-types="CssModule"
import cssModule from "./AssistantApp.module.scss";

export interface AssitantAppProps extends Pick<ClientAppProps, "appCss"> {
  assistantConfig: any;
}

export function AssistantApp(props: AssitantAppProps) {
  const { appCss, assistantConfig } = props;
  const { viewStack, viewState, viewApi } = useAssistantView({
    assistantConfig,
  });
  return (
    <ClientApp appCss={appCss}>
      <Page pageAriaHeader={"stew assistant"}>
        {viewStack[0].viewConfig.viewSections.map((someSectionConfig: any) =>
          createElement(someSectionConfig.SectionDisplay, {
            viewState,
            viewApi,
            someSectionConfig,
            key: someSectionConfig.sectionKey,
          })
        )}
      </Page>
    </ClientApp>
  );
}

interface UseAssistantViewApi {
  assistantConfig: any;
}

function useAssistantView(api: UseAssistantViewApi) {
  const { assistantConfig } = api;
  const [viewStack, setViewStack] = useState([
    {
      viewConfig: assistantConfig.initialViewConfig,
      viewSectionStates:
        assistantConfig.initialViewConfig.getInitialViewSectionStates(),
    },
  ]);
  // const viewApiDependenciesRef = useRef({
  //   viewStack,
  //   setViewStack,
  // });
  // useEffect(() => {
  //   viewApiDependenciesRef.current = {
  //     viewStack,
  //     setViewStack,
  //   };
  // }, [viewStack, setViewStack]);
  const viewApi = useMemo(
    () => ({
      setSectionState: (someSectionKey: string, getNextSectionState: any) => {
        setViewStack((currentViewStack) => {
          const activeViewState = topViewState(currentViewStack);
          return [
            ...currentViewStack.slice(0, -1),
            {
              ...activeViewState,
              viewSectionStates: {
                ...activeViewState.viewSectionStates,
                [someSectionKey]: getNextSectionState(
                  activeViewState.viewSectionStates[someSectionKey]
                ),
              },
            },
          ];
        });
      },
      replaceView: (nextViewKey: string, nextViewSectionStates: any) => {
        setViewStack((currentViewStack) => {
          return [
            ...currentViewStack.slice(0, -1),
            {
              viewConfig: assistantConfig.assistantViews[nextViewKey],
              viewSectionStates: nextViewSectionStates,
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
    viewState: topViewState(viewStack),
  };
}

function topViewState(someViewStack: any) {
  return someViewStack[someViewStack.length - 1];
}
