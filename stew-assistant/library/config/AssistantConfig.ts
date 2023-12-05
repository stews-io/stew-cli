import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";

export function assistantConfig<
  SomeViewKey extends string,
  SomeSectionKey extends string,
  SomeViewSections extends [
    SectionItem<SomeSectionKey, any, any>,
    ...Array<SectionItem<SomeSectionKey, any, any>>
  ],
  ThisAssistantViews extends [
    InitialViewItem<SomeViewKey, SomeViewSections, any>,
    ...Array<SecondaryViewItem<SomeViewKey, SomeViewSections>>
  ]
>(
  thisAssistantViews: ThisAssistantViews
): SourceAssistantConfig<ThisAssistantViews> {
  return {
    assistantViews: thisAssistantViews,
  };
}

export interface SourceAssistantConfig<
  ThisAssistantViews extends [any, ...Array<any>]
> extends AssistantConfigBase<ThisAssistantViews> {}

export interface BuildAssistantConfig
  extends AssistantConfigBase<
    Record<
      string,
      | InitialViewItem<string, BuildViewSectionConfigList, unknown>
      | SecondaryViewItem<string, BuildViewSectionConfigList>
    >
  > {
  initialAssistantView: InitialViewItem<
    string,
    BuildViewSectionConfigList,
    unknown
  >;
}

type BuildViewSectionConfigList = Array<
  SectionItem<string, unknown, SectionDisplayProps<string, unknown, unknown>>
>;

interface AssistantConfigBase<ThisAssistantViews> {
  assistantViews: ThisAssistantViews;
}

export interface InitialViewItem<ThisViewKey, ThisViewSections, ThisViewState>
  extends ViewItemBase<ThisViewKey, ThisViewSections> {
  getInitialViewState: () => ThisViewState;
}

export interface SecondaryViewItem<ThisViewKey, ThisViewSections>
  extends ViewItemBase<ThisViewKey, ThisViewSections> {}

export interface ViewItemBase<ThisViewKey, ThisViewSections> {
  viewKey: ThisViewKey;
  viewSections: ThisViewSections;
}

export interface SectionItem<
  ThisSectionKey,
  ThisSectionConfig,
  ThisSectionDisplayProps
> extends Pick<
    SectionDisplayProps<ThisSectionKey, ThisSectionConfig, unknown>,
    "sectionKey" | "sectionConfig"
  > {
  SectionDisplay: FunctionComponent<ThisSectionDisplayProps>;
}

export interface SectionDisplayProps<
  ThisSectionKey,
  ThisSectionConfig,
  ThisViewState
> {
  sectionKey: ThisSectionKey;
  sectionConfig: ThisSectionConfig;
  viewState: ThisViewState;
  viewApi: ViewApi<ThisViewState>;
}

export interface ViewApi<ThisViewState> {
  setViewState: (_: (currentViewState: ThisViewState) => ThisViewState) => void;
  replaceView: (api: ReplaceViewApi) => void;
}

interface ReplaceViewApi {
  nextViewKey: string;
  nextViewState: unknown;
}
