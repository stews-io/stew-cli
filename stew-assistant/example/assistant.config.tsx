import { FunctionComponent } from "stew/deps/preact/mod.ts";

const exampleConfig = assistantConfig([
  {
    viewKey: "fooView",
    viewSections: [
      {
        sectionKey: "aaaSection",
        SectionDisplay: AaaDisplay,
        sectionConfig: {
          aaaThang: 3,
        },
      },
    ],
    getInitialViewState: () => ({
      fooThing: "asdf",
    }),
  },
  {
    viewKey: "bazView",
    viewSections: [
      {
        sectionKey: "bbbSection",
        SectionDisplay: BbbDisplay,
        sectionConfig: {
          bbbThong: 3,
        },
      },
    ],
  },
]);

const verifiedExampleConfig: StrictAssistantConfig<typeof exampleConfig> =
  exampleConfig;

interface FooViewState {
  fooThing: string;
}

interface AaaConfig {
  aaaThang: number;
}

interface AaaDisplayProps
  extends SectionDisplayProps<"aaaSection", AaaConfig, FooViewState> {}

function AaaDisplay(props: AaaDisplayProps) {
  props.sectionKey;
  props.sectionConfig.aaaThang;
  props.viewState.fooThing;
  return null;
}

interface BazViewState {
  bazThingy: number;
}

interface BbbConfig {
  bbbThong: number;
}

interface BbbDisplayProps
  extends SectionDisplayProps<"bbbSection", BbbConfig, BazViewState> {}

function BbbDisplay(props: BbbDisplayProps) {
  return null;
}

///
///
function assistantConfig<
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

type StrictAssistantConfig<ThisAssistantConfig> =
  ThisAssistantConfig extends SourceAssistantConfig<infer ThisAssistantViews>
    ? SourceAssistantConfig<StrictAssistantViews<ThisAssistantViews>>
    : never;

type StrictAssistantViews<
  RemainingViewItems,
  ResultViewItems extends Array<any> = []
> = RemainingViewItems extends [
  infer CurrentViewItem,
  ...infer NextRemainingViewItems
]
  ? StrictAssistantViews<
      NextRemainingViewItems,
      [
        ...ResultViewItems,
        ResultViewItems extends []
          ? StrictInitialViewItem<CurrentViewItem>
          : StrictSecondaryViewItem<CurrentViewItem>
      ]
    >
  : ResultViewItems;

type StrictInitialViewItem<CurrentViewItem> =
  CurrentViewItem extends InitialViewItem<
    infer ThisViewKey,
    infer ThisViewSections,
    infer ThisViewState
  >
    ? FirstDefinedViewState<ThisViewSections> extends infer ThisFirstDefinedViewState
      ? InitialViewItem<
          ThisViewKey,
          StrictViewSections<ThisFirstDefinedViewState, ThisViewSections>,
          ThisFirstDefinedViewState
        >
      : never
    : never;

type StrictSecondaryViewItem<CurrentViewItem> =
  CurrentViewItem extends SecondaryViewItem<
    infer ThisViewKey,
    infer ThisViewSections
  >
    ? SecondaryViewItem<
        ThisViewKey,
        StrictViewSections<
          FirstDefinedViewState<ThisViewSections>,
          ThisViewSections
        >
      >
    : never;

type StrictViewSections<
  ThisFirstDefinedViewState,
  RemainingSectionItems,
  ResultSectionItems extends Array<any> = []
> = RemainingSectionItems extends [
  infer CurrentSectionItem,
  ...infer NextRemainingSectionItems
]
  ? StrictViewSections<
      ThisFirstDefinedViewState,
      NextRemainingSectionItems,
      [
        ...ResultSectionItems,
        CurrentSectionItem extends {
          SectionDisplay: FunctionComponent<infer ThisDefinedSectionProps>;
        }
          ? ThisDefinedSectionProps extends SectionDisplayProps<
              infer ThisDefinedSectionKey,
              infer ThisDefinedSectionConfig,
              infer ThisDefinedViewState
            >
            ? SectionItem<
                ThisDefinedSectionKey,
                ThisDefinedSectionConfig,
                SectionDisplayProps<
                  ThisDefinedSectionKey,
                  ThisDefinedSectionConfig,
                  ThisFirstDefinedViewState
                >
              >
            : never
          : never
      ]
    >
  : ResultSectionItems;

type FirstDefinedViewState<ThisViewSections> = ThisViewSections extends [
  {
    SectionDisplay: FunctionComponent<
      SectionDisplayProps<any, any, infer ThisFirstDefinedViewState>
    >;
  },
  ...Array<any>
]
  ? ThisFirstDefinedViewState
  : never;

interface SourceAssistantConfig<ThisAssistantViews extends [any, ...Array<any>]>
  extends AssistantConfigBase<ThisAssistantViews> {}

interface AssistantConfigBase<ThisAssistantViews> {
  assistantViews: ThisAssistantViews;
}

interface InitialViewItem<ThisViewKey, ThisViewSections, ThisViewState>
  extends ViewItemBase<ThisViewKey, ThisViewSections> {
  getInitialViewState: () => ThisViewState;
}

interface SecondaryViewItem<ThisViewKey, ThisViewSections>
  extends ViewItemBase<ThisViewKey, ThisViewSections> {}

interface ViewItemBase<ThisViewKey, ThisViewSections> {
  viewKey: ThisViewKey;
  viewSections: ThisViewSections;
}

interface SectionItem<
  ThisSectionKey,
  ThisSectionConfig,
  ThisSectionDisplayProps
> extends Pick<
    SectionDisplayProps<ThisSectionKey, ThisSectionConfig, unknown>,
    "sectionKey" | "sectionConfig"
  > {
  SectionDisplay: FunctionComponent<ThisSectionDisplayProps>;
}

interface SectionDisplayProps<
  ThisSectionKey,
  ThisSectionConfig,
  ThisViewState
> {
  sectionKey: ThisSectionKey;
  sectionConfig: ThisSectionConfig;
  viewState: ThisViewState;
}
