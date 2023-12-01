import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";

export interface SourceAssistantConfig<
  ThisViewsConfig extends [
    InitialViewConfig<any, any, () => any>,
    ...Array<SecondaryViewConfig<any, any>>
  ]
> extends AssistantConfigBase<ThisViewsConfig> {}

export interface BuildAssistantConfig
  extends AssistantConfigBase<
    Record<string, SecondaryViewConfig<string, Array<BuildViewSectionConfig>>>
  > {
  initialViewConfig: InitialViewConfig<
    string,
    Array<BuildViewSectionConfig>,
    () => unknown
  >;
}

interface BuildViewSectionConfig
  extends ViewSectionConfig<unknown, ViewSectionDataConfig<string>> {}

interface AssistantConfigBase<AssistantViewsConfig> {
  assistantViews: AssistantViewsConfig;
}

export interface InitialViewConfig<
  ThisViewKey,
  ThisViewSections,
  ThisGetInitialViewState
> extends ViewConfigBase<ThisViewKey, ThisViewSections> {
  getInitialViewState: ThisGetInitialViewState;
}

export interface SecondaryViewConfig<ThisViewKey, ThisViewSections>
  extends ViewConfigBase<ThisViewKey, ThisViewSections> {}

export interface ViewConfigBase<ThisViewKey, ThisViewSections> {
  viewKey: ThisViewKey;
  viewSections: ThisViewSections;
}

export type ViewSectionConfig<ThisViewState, ThisSectionDataConfig> =
  ThisSectionDataConfig & {
    SectionDisplay: FunctionComponent<
      SectionDisplayProps<ThisViewState, ThisSectionDataConfig>
    >;
  };

export interface ViewSectionDataConfig<ThisSectionKey> {
  sectionKey: ThisSectionKey;
}

export interface SectionDisplayProps<ThisViewState, ThisSectionConfig> {
  sectionConfig: ThisSectionConfig;
  viewState: ThisViewState;
  viewApi: ViewApi<ThisViewState>;
}

export interface ViewApi<ThisViewState> {
  setViewState: (
    getNextViewState: (currentViewState: ThisViewState) => ThisViewState
  ) => void;
  replaceView: (api: ReplaceViewApi) => void;
}

interface ReplaceViewApi {
  nextViewKey: string;
  nextViewState: unknown;
}
