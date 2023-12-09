import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";

export function assistantConfig<
  SomeViewKey extends string,
  SomeSectionKey extends string,
  SomeSectionConfig extends { sectionKey: SomeSectionKey },
  SomeViewSectionsConfig extends [
    SomeSectionConfig,
    ...Array<SomeSectionConfig>
  ],
  ThisAssistantViewsConfig extends [
    InitialViewConfig<SomeViewKey, SomeViewSectionsConfig, any>,
    ...Array<ViewConfig<SomeViewKey, SomeViewSectionsConfig>>
  ]
>(
  thisAssistantViews: ThisAssistantViewsConfig
): SourceAssistantConfig<ThisAssistantViewsConfig> {
  return {
    assistantViews: thisAssistantViews,
  };
}

export interface SourceAssistantConfig<
  ThisAssistantViewsConfig extends [any, ...Array<any>]
> extends AssistantConfigBase<ThisAssistantViewsConfig> {}

export interface BuildAssistantConfig
  extends AssistantConfigBase<
    Record<
      string,
      | InitialViewConfig<string, BuildViewSectionConfigList, unknown>
      | ViewConfig<string, BuildViewSectionConfigList>
    >
  > {
  initialAssistantView: InitialViewConfig<
    string,
    BuildViewSectionConfigList,
    unknown
  >;
}

type BuildViewSectionConfigList = Array<
  SectionConfig<SectionDisplayProps<string, unknown, unknown>>
>;

interface AssistantConfigBase<ThisAssistantViews> {
  assistantViews: ThisAssistantViews;
}

export interface InitialViewConfig<
  ThisViewKey,
  ThisViewSectionsConfig,
  ThisViewState
> extends ViewConfig<ThisViewKey, ThisViewSectionsConfig> {
  getInitialViewState: () => ThisViewState;
}
export interface ViewConfig<ThisViewKey, ThisViewSectionsConfig> {
  viewKey: ThisViewKey;
  viewSections: ThisViewSectionsConfig;
}

export interface SectionConfig<
  ThisSectionDisplayProps extends SectionDisplayProps<any, any, any>
> extends Pick<ThisSectionDisplayProps, "sectionKey" | "sectionData"> {
  SectionDisplay: FunctionComponent<ThisSectionDisplayProps>;
}

export interface SectionDisplayProps<
  ThisSectionKey,
  ThisSectionData,
  ThisViewState
> {
  sectionKey: ThisSectionKey;
  sectionData: ThisSectionData;
  viewState: ThisViewState;
  viewApi: ViewApi<this["viewState"]>;
}

export interface ViewApi<ThisViewState> {
  setViewState: (_: (currentViewState: ThisViewState) => ThisViewState) => void;
  replaceView: (api: ReplaceViewApi) => void;
}

interface ReplaceViewApi {
  nextViewKey: string;
  nextViewState: unknown;
}
