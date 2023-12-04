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
    // thang: 3
  },
  {
    viewKey: "bazView",
    viewSections: [
      {
        sectionKey: "bbbSection",
        SectionDisplay: BbbDisplay,
        sectionConfig: {
          bbbThong: 3,
          // thang: 3
        },
        // thang: 3
      },
    ],
  },
]);

const strictExampleConfig: StrictAssistantConfig<typeof exampleConfig> =
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
  ? UniqueViewKey<CurrentViewItem, ResultViewItems> extends true
    ? EmptyTuple<ResultViewItems> extends true
      ? MoarStrictAssistantViews<
          InitialViewItem<unknown, unknown, unknown>,
          NextRemainingViewItems,
          ResultViewItems,
          CurrentViewItem,
          StrictInitialViewItem<CurrentViewItem>
        >
      : MoarStrictAssistantViews<
          SecondaryViewItem<unknown, unknown>,
          NextRemainingViewItems,
          ResultViewItems,
          CurrentViewItem,
          StrictSecondaryViewItem<CurrentViewItem>
        >
    : never
  : ResultViewItems;

type MoarStrictAssistantViews<
  DefinedViewItem,
  NextRemainingViewItems,
  ResultViewItems extends Array<any>,
  ProvidedViewItem,
  StrictProvidedViewItem
> = ExactKeys<DefinedViewItem, ProvidedViewItem> extends true
  ? StrictAssistantViews<
      NextRemainingViewItems,
      [...ResultViewItems, StrictProvidedViewItem]
    >
  : [never];

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
  ? UniqueSectionKey<CurrentSectionItem, ResultSectionItems> extends true
    ? ExactKeys<
        SectionItem<unknown, unknown, unknown>,
        CurrentSectionItem
      > extends true
      ? CurrentSectionItem extends {
          SectionDisplay: FunctionComponent<infer ThisDefinedSectionProps>;
          sectionConfig: infer ThisProvidedSectionConfig;
        }
        ? ThisDefinedSectionProps extends SectionDisplayProps<
            infer ThisDefinedSectionKey,
            infer ThisDefinedSectionConfig,
            infer ThisDefinedViewState
          >
          ? ExactKeys<
              ThisDefinedSectionConfig,
              ThisProvidedSectionConfig
            > extends true
            ? StrictViewSections<
                ThisFirstDefinedViewState,
                NextRemainingSectionItems,
                [
                  ...ResultSectionItems,
                  SectionItem<
                    ThisDefinedSectionKey,
                    ThisDefinedSectionConfig,
                    SectionDisplayProps<
                      ThisDefinedSectionKey,
                      ThisDefinedSectionConfig,
                      ThisFirstDefinedViewState
                    >
                  >
                ]
              >
            : never
          : never
        : never
      : never
    : never
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

type UniqueViewKey<CurrentViewItem, ResultViewItems> = CurrentViewItem extends {
  viewKey: infer CurrentViewKey;
}
  ? EmptyTuple<ResultViewItems> extends true
    ? true
    : ResultViewItems extends Array<{ viewKey: infer SomeResultViewKey }>
    ? CurrentViewKey extends SomeResultViewKey
      ? false
      : true
    : never
  : never;

type UniqueSectionKey<CurrentSectionItem, ResultSectionItems> =
  CurrentSectionItem extends {
    sectionKey: infer CurrentSectionKey;
  }
    ? EmptyTuple<ResultSectionItems> extends true
      ? true
      : ResultSectionItems extends Array<{
          sectionKey: infer SomeResultSectionKey;
        }>
      ? CurrentSectionKey extends SomeResultSectionKey
        ? false
        : true
      : never
    : never;

type ExactKeys<ThisDefinedInterface, ThisProvidedInterface> = Exclude<
  keyof ThisProvidedInterface,
  keyof ThisDefinedInterface
> extends never
  ? true
  : false;

type EmptyTuple<ResultItems> = ResultItems extends [] ? true : false;

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
