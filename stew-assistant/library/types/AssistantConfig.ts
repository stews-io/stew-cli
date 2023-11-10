import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";

export interface SourceAssistantConfig<
  SourceAssistantViewsConfig extends [
    InitialRequiredAssistantViewConfig<
      string,
      Array<RequiredViewSectionConfig<string>>
    >,
    ...Array<
      RequiredAssistantViewConfig<
        string,
        Array<RequiredViewSectionConfig<string>>
      >
    >
  ]
> extends AssistantConfigBase<"source", SourceAssistantViewsConfig> {}

export interface BuildAssistantConfig<
  ViewKey extends string,
  SectionKey extends string,
  BuildAssistantViewsConfig extends Record<
    ViewKey,
    RequiredAssistantViewConfig<
      ViewKey,
      Array<RequiredViewSectionConfig<SectionKey>>
    >
  >
> extends AssistantConfigBase<"build", BuildAssistantViewsConfig> {
  initialViewConfig: InitialRequiredAssistantViewConfig<
    string,
    Array<RequiredViewSectionConfig<string>>
  >;
}

interface AssistantConfigBase<ConfigType extends string, AssistantViewsConfig> {
  configType: ConfigType;
  assistantViews: AssistantViewsConfig;
}

export interface InitialRequiredAssistantViewConfig<
  ViewKey extends string,
  ViewSectionsConfig extends Array<RequiredViewSectionConfig<string>>
> extends RequiredAssistantViewConfig<ViewKey, ViewSectionsConfig> {
  getInitialViewSectionsState: () => ViewSectionStates;
}

export interface RequiredAssistantViewConfig<
  ViewKey extends string,
  ViewSectionsConfig extends Array<RequiredViewSectionConfig<string>>
> {
  viewKey: ViewKey;
  viewSections: ViewSectionsConfig;
}

export interface RequiredViewSectionConfig<SectionKey extends string> {
  sectionKey: SectionKey;
  SectionDisplay: FunctionComponent<SectionDisplayProps>;
}

export interface SectionDisplayProps {
  viewState: ViewState;
  viewApi: ViewApi;
}

export interface ViewState {
  viewConfig: RequiredAssistantViewConfig<
    string,
    Array<RequiredViewSectionConfig<string>>
  >;
  viewSectionStates: ViewSectionStates;
}

export interface ViewApi {
  setSectionState: (
    someSectionKey: string,
    nextSectionState: SectionState
  ) => void;
  replaceView: (
    someViewKey: string,
    nextViewSectionStates: ViewSectionStates
  ) => void;
  launchView: (
    someViewKey: string,
    newViewSectionStates: ViewSectionStates
  ) => void;
  resolveView: (someViewResult: unknown) => void;
  cancelView: () => void;
}

interface ViewSectionStates extends Record<string, SectionState> {}

interface SectionState extends Record<string, unknown> {}
