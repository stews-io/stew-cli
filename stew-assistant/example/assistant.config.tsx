import {
  InitialViewConfig,
  SecondaryViewConfig,
  SectionDisplayProps,
  SourceAssistantConfig,
  ViewSectionConfig,
  ViewSectionDataConfig,
} from "../library/types/AssistantConfig.ts";
// @deno-types="CssModule"

const exampleConfig = assistantConfig([
  {
    viewKey: "fooView",
    viewSections: [
      sectionConfig({
        sectionKey: "bazSection",
        SectionDisplay: BazDisplay,
        foo: 2,
      }),
      sectionConfig({
        sectionKey: "fazSection",
        SectionDisplay: FazDisplay,
        fazThing: 3,
      }),
    ],
    getInitialViewState: () => ({
      fooThing: 2,
    }),
  },
  {
    viewKey: "bazView",
    viewSections: [
      sectionConfig({
        sectionKey: "bazSection",
        SectionDisplay: BazDisplay,
        foo: 2,
      }),
    ],
  },
]);

const verifiedExampleConfig = exampleConfig satisfies VerifiedAssistantConfig<
  typeof exampleConfig
>;

export default verifiedExampleConfig;

interface FooViewState {
  fooThing: number;
}

interface BazSectionConfig extends ViewSectionDataConfig<"bazSection"> {
  foo: number;
}

interface BazDisplayProps
  extends SectionDisplayProps<FooViewState, BazSectionConfig> {}

function BazDisplay(props: BazDisplayProps) {
  const { sectionConfig, viewApi } = props;
  return <div>{sectionConfig.foo}</div>;
}

interface FazSectionConfig extends ViewSectionDataConfig<"fazSection"> {
  fazThing: number;
}

interface FazDisplayProps
  extends SectionDisplayProps<FooViewState, FazSectionConfig> {}

function FazDisplay(props: FazDisplayProps) {
  return <div>faz</div>;
}

function assistantConfig<
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

function sectionConfig<ThisViewState, ThisSectionDataConfig>(
  thisSectionConfig: ViewSectionConfig<ThisViewState, ThisSectionDataConfig>
) {
  return thisSectionConfig;
}

type VerifiedAssistantConfig<
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
