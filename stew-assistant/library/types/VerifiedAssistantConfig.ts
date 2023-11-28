import {
  InitialViewConfig,
  SecondaryViewConfig,
  SourceAssistantConfig,
  ViewSectionConfig,
} from "./AssistantConfig.ts";

export type VerifiedAssistantConfig<
  ThisAssistantConfig extends SourceAssistantConfig<
    [
      InitialViewConfig<string, Array<ViewSectionConfig<any, any>>, () => any>,
      ...Array<SecondaryViewConfig<string, Array<ViewSectionConfig<any, any>>>>
    ]
  >
> = {
  assistantViews: VerifiedViewConfigList<ThisAssistantConfig["assistantViews"]>;
};

type VerifiedViewConfigList<
  RemainingViewConfigList extends Array<any>,
  ResultViewConfigList extends Array<any> = []
> = RemainingViewConfigList extends [
  infer CurrentViewConfig,
  ...infer NextRemainingViewConfigList
]
  ? VerifiedViewConfigList<
      NextRemainingViewConfigList,
      [
        ...ResultViewConfigList,
        ResultViewConfigList extends []
          ? CurrentViewConfig extends InitialViewConfig<
              infer TheInitialViewKey,
              infer TheInitialViewSectionConfigList,
              infer TheInitialViewStateInitializer
            >
            ? TheInitialViewStateInitializer extends () => infer TheInitialViewState
              ? TheInitialViewSectionConfigList extends Array<any>
                ? InitialViewConfig<
                    TheInitialViewKey,
                    VerifiedInitialViewSectionConfigList<
                      TheInitialViewState,
                      TheInitialViewSectionConfigList
                    >,
                    () => TheInitialViewState
                  >
                : never
              : never
            : never
          : CurrentViewConfig extends SecondaryViewConfig<
              infer SomeSecondaryViewKey,
              infer SomeSecondaryViewSectionConfigList
            >
          ? SomeSecondaryViewSectionConfigList extends Array<any>
            ? SecondaryViewConfig<
                SomeSecondaryViewKey,
                VerifiedSecondaryViewSectionConfigList<SomeSecondaryViewSectionConfigList>
              >
            : never
          : never
      ]
    >
  : ResultViewConfigList;

type VerifiedInitialViewSectionConfigList<
  TheInitialViewState,
  RemainingSectionConfigList extends Array<ViewSectionConfig<any, any>>,
  ResultSectionConfigList extends Array<ViewSectionConfig<any, any>> = []
> = RemainingSectionConfigList extends [
  infer CurrentViewSection,
  ...infer NextRemainingSectionConfigList
]
  ? VerifiedSecondaryViewSectionConfigList<
      NextRemainingSectionConfigList,
      [
        ...ResultSectionConfigList,
        ViewSectionConfig<
          TheInitialViewState,
          CurrentViewSection extends ViewSectionConfig<
            infer ___,
            infer ThisSectionData
          >
            ? ThisSectionData
            : never
        >
      ]
    >
  : ResultSectionConfigList;

type VerifiedSecondaryViewSectionConfigList<
  RemainingSectionConfigList extends Array<ViewSectionConfig<any, any>>,
  ResultSectionConfigList extends Array<ViewSectionConfig<any, any>> = []
> = RemainingSectionConfigList extends [
  infer CurrentViewSection,
  ...infer NextRemainingSectionConfigList
]
  ? VerifiedSecondaryViewSectionConfigList<
      NextRemainingSectionConfigList,
      [
        ...ResultSectionConfigList,
        ViewSectionConfig<
          ResultSectionConfigList[0] extends ViewSectionConfig<
            infer ThisViewState,
            infer ___
          >
            ? ThisViewState
            : CurrentViewSection extends ViewSectionConfig<
                infer ThisViewState,
                infer ___
              >
            ? ThisViewState
            : never,
          CurrentViewSection extends ViewSectionConfig<
            infer ___,
            infer ThisSectionData
          >
            ? ThisSectionData
            : never
        >
      ]
    >
  : ResultSectionConfigList;
