import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";
import {
  AssertExactKeys,
  AssertUniqueKey,
  IsEmptyTuple,
  irrelevantAny,
  irrelevantNever,
  irrelevantUnknown,
} from "../utilities/types.ts";
import {
  InitialViewConfig,
  SectionDisplayProps,
  SectionConfig,
  SourceAssistantConfig,
  ViewConfig,
} from "./AssistantConfig.ts";

export type VerifiedAssistantConfig<ReturnedAssistantConfig> =
  ReturnedAssistantConfig extends SourceAssistantConfig<
    infer ReturnedAssistantViews
  >
    ? SourceAssistantConfig<VerifiedViewsConfig<ReturnedAssistantViews>>
    : never;

export type VerifiedViewsConfig<
  RemainingViewsConfig,
  ResultViewsConfig extends Array<any> = []
> = RemainingViewsConfig extends [
  infer CurrentViewConfig,
  ...infer NextRemainingViewsConfig
]
  ? AssertUniqueKey<
      "viewKey",
      CurrentViewConfig,
      ResultViewsConfig
    > extends true
    ? IsEmptyTuple<ResultViewsConfig> extends true
      ? GetVerifiedViewsConfig<
          InitialViewConfig<irrelevantNever, irrelevantNever, irrelevantNever>,
          CurrentViewConfig,
          VerifiedInitialViewConfig<CurrentViewConfig>,
          NextRemainingViewsConfig,
          ResultViewsConfig
        >
      : GetVerifiedViewsConfig<
          ViewConfig<irrelevantNever, irrelevantNever>,
          CurrentViewConfig,
          VerifiedViewConfig<CurrentViewConfig>,
          NextRemainingViewsConfig,
          ResultViewsConfig
        >
    : never
  : ResultViewsConfig;

type GetVerifiedViewsConfig<
  DefinedViewConfigShape,
  CurrentViewConfig,
  VerifiedCurrentViewConfig,
  NextRemainingViewsConfig,
  ResultViewsConfig extends Array<any>
> = AssertExactKeys<DefinedViewConfigShape, CurrentViewConfig> extends true
  ? VerifiedViewsConfig<
      NextRemainingViewsConfig,
      [...ResultViewsConfig, VerifiedCurrentViewConfig]
    >
  : [never];

type VerifiedInitialViewConfig<CurrentViewConfig> =
  CurrentViewConfig extends InitialViewConfig<
    infer CurrentViewKey,
    infer CurrentViewSectionsConfig,
    irrelevantUnknown
  >
    ? GetFirstDefinedViewState<CurrentViewSectionsConfig> extends infer FirstDefinedViewState
      ? InitialViewConfig<
          CurrentViewKey,
          GetVerifiedViewSectionsConfig<
            FirstDefinedViewState,
            CurrentViewSectionsConfig
          >,
          FirstDefinedViewState
        >
      : never
    : never;

export type VerifiedViewConfig<CurrentViewConfig> =
  CurrentViewConfig extends ViewConfig<
    infer CurrentViewKey,
    infer CurrentViewSectionsConfig
  >
    ? ViewConfig<
        CurrentViewKey,
        GetVerifiedViewSectionsConfig<
          GetFirstDefinedViewState<CurrentViewSectionsConfig>,
          CurrentViewSectionsConfig
        >
      >
    : never;

export type GetVerifiedViewSectionsConfig<
  FirstDefinedViewState,
  RemainingSectionsConfig,
  ResultSectionsConfig extends Array<any> = []
> = RemainingSectionsConfig extends [
  infer CurrentSectionConfig,
  ...infer NextRemainingSectionsConfig
]
  ? AssertUniqueKey<
      "sectionKey",
      CurrentSectionConfig,
      ResultSectionsConfig
    > extends true
    ? AssertExactKeys<
        SectionConfig<
          SectionDisplayProps<
            irrelevantUnknown,
            irrelevantUnknown,
            irrelevantUnknown
          >
        >,
        CurrentSectionConfig
      > extends true
      ? CurrentSectionConfig extends {
          SectionDisplay: FunctionComponent<infer DefinedSectionDisplayProps>;
          sectionData: infer ProvidedSectionData;
        }
        ? DefinedSectionDisplayProps extends SectionDisplayProps<
            infer DefinedSectionKey,
            infer DefinedSectionData,
            infer DefinedViewState
          >
          ? AssertExactKeys<
              DefinedSectionData,
              ProvidedSectionData
            > extends true
            ? GetVerifiedViewSectionsConfig<
                FirstDefinedViewState,
                NextRemainingSectionsConfig,
                [
                  ...ResultSectionsConfig,
                  SectionConfig<
                    SectionDisplayProps<
                      DefinedSectionKey,
                      DefinedSectionData,
                      FirstDefinedViewState
                    >
                  >
                ]
              >
            : never
          : never
        : never
      : never
    : never
  : ResultSectionsConfig;

export type GetFirstDefinedViewState<CurrentViewSectionsConfig> =
  CurrentViewSectionsConfig extends [
    {
      SectionDisplay: FunctionComponent<
        SectionDisplayProps<
          irrelevantAny,
          irrelevantAny,
          infer FirstDefinedViewState
        >
      >;
    },
    ...Array<irrelevantAny>
  ]
    ? FirstDefinedViewState
    : never;
