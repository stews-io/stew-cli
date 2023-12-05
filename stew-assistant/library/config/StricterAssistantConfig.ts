import { FunctionComponent } from "../../../stew-library/deps/preact/mod.ts";
import {
  InitialViewItem,
  SecondaryViewItem,
  SourceAssistantConfig,
} from "./AssistantConfig.ts";
import {
  EmptyTuple,
  ExactKeys,
  FirstDefinedViewState,
  StrictViewSections,
  UniqueViewKey,
} from "./StrictAssistantConfig.ts";
import {
  FieldDisplayProps,
  FormFieldConfigItem,
  FormViewConfigItem,
  InitialFormViewConfigItem,
} from "./FormViewConfigItem.tsx";

export type StricterAssistantConfig<ThisAssistantConfig> =
  ThisAssistantConfig extends SourceAssistantConfig<infer ThisAssistantViews>
    ? SourceAssistantConfig<StricterAssistantViews<ThisAssistantViews>>
    : never;

type StricterAssistantViews<
  RemainingViewItems,
  ResultViewItems extends Array<any> = []
> = RemainingViewItems extends [
  infer CurrentViewItem,
  ...infer NextRemainingViewItems
]
  ? UniqueViewKey<CurrentViewItem, ResultViewItems> extends true
    ? EmptyTuple<ResultViewItems> extends true
      ? MoarStricterAssistantViews<
          InitialViewItem<unknown, unknown, unknown>,
          NextRemainingViewItems,
          ResultViewItems,
          CurrentViewItem,
          StricterInitialViewItem<CurrentViewItem>
        >
      : MoarStricterAssistantViews<
          SecondaryViewItem<unknown, unknown>,
          NextRemainingViewItems,
          ResultViewItems,
          CurrentViewItem,
          StricterSecondaryViewItem<CurrentViewItem>
        >
    : never
  : ResultViewItems;

type MoarStricterAssistantViews<
  DefinedViewItem,
  NextRemainingViewItems,
  ResultViewItems extends Array<any>,
  ProvidedViewItem,
  StrictProvidedViewItem
> = ExactKeys<DefinedViewItem, ProvidedViewItem> extends true
  ? StricterAssistantViews<
      NextRemainingViewItems,
      [...ResultViewItems, StrictProvidedViewItem]
    >
  : [never];

type StricterInitialViewItem<CurrentViewItem> =
  CurrentViewItem extends InitialFormViewConfigItem<
    infer ThisFormViewKey,
    infer ThisFormViewState,
    infer ThisFormFields
  >
    ? FirstDefinedFormViewState<ThisFormFields> extends infer ThisFirstDefinedFormViewState
      ? InitialFormViewConfigItem<
          ThisFormViewKey,
          ThisFirstDefinedFormViewState,
          StrictFormFields<ThisFirstDefinedFormViewState, ThisFormFields>
        >
      : never
    : CurrentViewItem extends InitialViewItem<
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

type StricterSecondaryViewItem<CurrentViewItem> =
  CurrentViewItem extends FormViewConfigItem<
    infer ThisFormViewKey,
    infer ThisFormViewState,
    infer ThisFormFields
  >
    ? FirstDefinedFormViewState<ThisFormFields> extends infer ThisFirstDefinedFormViewState
      ? FormViewConfigItem<
          ThisFormViewKey,
          ThisFirstDefinedFormViewState,
          StrictFormFields<ThisFirstDefinedFormViewState, ThisFormFields>
        >
      : never
    : CurrentViewItem extends SecondaryViewItem<
        infer ThisViewKey,
        infer ThisViewSections
      >
    ? FirstDefinedViewState<ThisViewSections> extends infer ThisFirstDefinedViewState
      ? SecondaryViewItem<
          ThisViewKey,
          StrictViewSections<ThisFirstDefinedViewState, ThisViewSections>
        >
      : never
    : never;

type FirstDefinedFormViewState<ThisFormFields> = ThisFormFields extends [
  {
    FieldDisplay: FunctionComponent<
      FieldDisplayProps<infer ThisFirstDefinedFormViewState, any, any>
    >;
  },
  ...Array<any>
]
  ? ThisFirstDefinedFormViewState
  : never;

type StrictFormFields<
  ThisFirstDefinedViewState,
  RemainingFieldItems,
  ResultFieldItems extends Array<any> = []
> = RemainingFieldItems extends [
  infer CurrentFieldItem,
  ...infer NextRemainingFieldItems
]
  ? UniqueFieldKey<CurrentFieldItem, ResultFieldItems> extends true
    ? ExactKeys<
        FormFieldConfigItem<unknown, unknown, unknown, unknown>,
        CurrentFieldItem
      > extends true
      ? CurrentFieldItem extends {
          FieldDisplay: FunctionComponent<infer ThisDefinedFieldDisplayProps>;
          fieldConfig: infer ThisProvidedFieldConfig;
        }
        ? ThisDefinedFieldDisplayProps extends FieldDisplayProps<
            infer ThisDefinedViewState,
            infer ThisDefinedFieldKey,
            infer ThisDefinedFieldConfig
          >
          ? ExactKeys<
              ThisDefinedFieldConfig,
              ThisProvidedFieldConfig
            > extends true
            ? StrictFormFields<
                ThisFirstDefinedViewState,
                NextRemainingFieldItems,
                [
                  ...ResultFieldItems,
                  FormFieldConfigItem<
                    ThisFirstDefinedViewState,
                    ThisDefinedFieldKey,
                    ThisDefinedFieldConfig,
                    FieldDisplayProps<
                      ThisFirstDefinedViewState,
                      ThisDefinedFieldKey,
                      ThisDefinedFieldConfig
                    >
                  >
                ]
              >
            : never
          : never
        : never
      : never
    : never
  : ResultFieldItems;

type UniqueFieldKey<CurrentFieldItem, ResultFieldItems> =
  CurrentFieldItem extends {
    fieldKey: infer CurrentFieldKey;
  }
    ? EmptyTuple<ResultFieldItems> extends true
      ? true
      : ResultFieldItems extends Array<{
          fieldKey: infer SomeResultFieldKey;
        }>
      ? CurrentFieldKey extends SomeResultFieldKey
        ? false
        : true
      : never
    : never;
