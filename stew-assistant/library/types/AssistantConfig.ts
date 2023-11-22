import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";

export interface SourceAssistantConfig<
  SomeViewKey,
  SomeSectionDataConfig,
  SomeViewSections extends Array<
    ViewSectionConfig<SomeSectionDataConfig, unknown, unknown, unknown>
  >
> extends AssistantConfigBase<
    [
      InitialViewConfig<SomeViewKey, SomeViewSections, () => unknown>,
      ...Array<SecondaryViewConfig<SomeViewKey, SomeViewSections>>
    ]
  > {}

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
  extends ViewSectionConfig<
    ViewSectionDataConfig<string>,
    unknown,
    unknown,
    unknown
  > {}

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

interface ViewConfigBase<ThisViewKey, ThisViewSections> {
  viewKey: ThisViewKey;
  viewSections: ThisViewSections;
}

export type ViewSectionConfig<
  ThisSectionConfig,
  ThisViewState,
  SomeViewKey,
  SomeViewState
> = ThisSectionConfig & {
  SectionDisplay: FunctionComponent<
    SectionDisplayProps<
      ThisSectionConfig,
      ThisViewState,
      SomeViewKey,
      SomeViewState
    >
  >;
};

export interface ViewSectionDataConfig<ThisSectionKey> {
  sectionKey: ThisSectionKey;
}

export interface SectionDisplayProps<
  ThisSectionConfig,
  ThisViewState,
  SomeViewKey,
  SomeViewState
> {
  sectionConfig: ThisSectionConfig;
  viewState: ThisViewState;
  viewApi: ViewApi<ThisViewState, SomeViewKey, SomeViewState>;
}

export interface ViewApi<ThisViewState, SomeViewKey, SomeViewState> {
  setViewState: (
    getNextViewState: (currentViewState: ThisViewState) => ThisViewState
  ) => void;
  replaceView: (api: ReplaceViewApi<SomeViewKey, SomeViewState>) => void;
}

interface ReplaceViewApi<SomeViewKey, SomeViewState> {
  nextViewKey: SomeViewKey;
  nextViewState: SomeViewState;
}
