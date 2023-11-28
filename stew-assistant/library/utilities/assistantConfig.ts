import {
  InitialViewConfig,
  SecondaryViewConfig,
  SourceAssistantConfig,
  ViewSectionConfig,
} from "../types/AssistantConfig.ts";

export function assistantConfig<
  SomeViewKey extends string,
  ThisViewsConfig extends [
    InitialViewConfig<
      SomeViewKey,
      [ViewSectionConfig<any, any>, ...Array<ViewSectionConfig<any, any>>],
      any
    >,
    ...Array<
      SecondaryViewConfig<
        SomeViewKey,
        [ViewSectionConfig<any, any>, ...Array<ViewSectionConfig<any, any>>]
      >
    >
  ]
>(thisViewsConfig: ThisViewsConfig): SourceAssistantConfig<ThisViewsConfig> {
  return {
    assistantViews: thisViewsConfig,
  };
}

export function sectionConfig<ThisViewState, ThisSectionDataConfig>(
  thisSectionConfig: ViewSectionConfig<ThisViewState, ThisSectionDataConfig>
) {
  return thisSectionConfig;
}
