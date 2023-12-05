import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";
import {
  InitialViewItem,
  SecondaryViewItem,
  SectionDisplayProps,
  SectionItem,
  SourceAssistantConfig,
} from "./AssistantConfig.ts";

export type StrictAssistantConfig<ThisAssistantConfig> =
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

export type StrictSecondaryViewItem<CurrentViewItem> =
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

export type StrictViewSections<
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

export type FirstDefinedViewState<ThisViewSections> = ThisViewSections extends [
  {
    SectionDisplay: FunctionComponent<
      SectionDisplayProps<any, any, infer ThisFirstDefinedViewState>
    >;
  },
  ...Array<any>
]
  ? ThisFirstDefinedViewState
  : never;

export type UniqueViewKey<CurrentViewItem, ResultViewItems> =
  CurrentViewItem extends {
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

export type UniqueSectionKey<CurrentSectionItem, ResultSectionItems> =
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

export type ExactKeys<ThisDefinedInterface, ThisProvidedInterface> = Exclude<
  keyof ThisProvidedInterface,
  keyof ThisDefinedInterface
> extends never
  ? true
  : false;

export type EmptyTuple<ResultItems> = ResultItems extends [] ? true : false;
