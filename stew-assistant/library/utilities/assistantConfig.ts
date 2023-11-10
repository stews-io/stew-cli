import {
  InitialRequiredAssistantViewConfig,
  RequiredAssistantViewConfig,
  RequiredViewSectionConfig,
  SourceAssistantConfig,
} from "../types/AssistantConfig.ts";

export function assistantConfig<
  ViewKey extends string,
  SectionKey extends string,
  SomeAssistantViewsConfig extends [
    InitialRequiredAssistantViewConfig<
      ViewKey,
      Array<RequiredViewSectionConfig<SectionKey>>
    >,
    ...Array<
      RequiredAssistantViewConfig<
        ViewKey,
        Array<RequiredViewSectionConfig<SectionKey>>
      >
    >
  ]
>(
  someAssistantViewsConfig: SomeAssistantViewsConfig
): SourceAssistantConfig<SomeAssistantViewsConfig> {
  return {
    configType: "source",
    assistantViews: someAssistantViewsConfig,
  };
}
