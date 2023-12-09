import {
  Fragment,
  FunctionComponent,
  JSX,
  createElement,
} from "../../../stew-library/deps/preact/mod.ts";
import { irrelevant } from "../utilities/types.ts";
import {
  InitialViewItem,
  SectionDisplayProps,
  SectionItem,
  ViewItemBase,
} from "./AssistantConfig.ts";

export interface FormViewConfigApi<ThisViewKey, ThisViewState, ThisFormFields>
  extends Pick<FormViewConfigItem<ThisViewKey, unknown, unknown>, "viewKey">,
    Pick<__FormHeaderConfig<ThisViewState>, "FormHeader">,
    Pick<__FormBodyConfig<ThisFormFields>, "formFields">,
    Pick<__FormFooterConfig<ThisViewState>, "FormFooter"> {}

export function formViewConfig<
  ThisViewKey extends string,
  ThisViewState,
  SomeFieldKey extends string,
  ThisFormFields extends [
    FormFieldConfigItem<ThisViewState, SomeFieldKey, any, any>,
    ...Array<FormFieldConfigItem<ThisViewState, SomeFieldKey, any, any>>
  ]
>(
  api: FormViewConfigApi<ThisViewKey, ThisViewState, ThisFormFields>
): FormViewConfigItem<ThisViewKey, ThisViewState, ThisFormFields> {
  const { viewKey, FormHeader, formFields, FormFooter } = api;
  return {
    viewKey,
    viewSections: [
      {
        sectionKey: "__formHeader",
        SectionDisplay: __FormHeader,
        sectionConfig: {
          FormHeader,
        },
      },
      {
        sectionKey: "__formBody",
        SectionDisplay: __FormBody,
        sectionConfig: {
          formFields,
        },
      },
      {
        sectionKey: "__formFooter",
        SectionDisplay: __FormFooter,
        sectionConfig: {
          FormFooter,
        },
      },
    ],
  };
}

export interface InitialFormViewConfigApi<
  ThisViewKey,
  ThisViewState,
  ThisFormFields
> extends FormViewConfigApi<ThisViewKey, ThisViewState, ThisFormFields>,
    Pick<
      InitialFormViewConfigItem<ThisViewKey, ThisViewState, ThisFormFields>,
      "getInitialViewState"
    > {}

export function initialFormViewConfig<
  ThisViewKey extends string,
  ThisViewState,
  SomeFieldKey extends string,
  ThisFormFields extends [
    FormFieldConfigItem<ThisViewState, SomeFieldKey, any, any>,
    ...Array<FormFieldConfigItem<ThisViewState, SomeFieldKey, any, any>>
  ]
>(
  api: InitialFormViewConfigApi<ThisViewKey, ThisViewState, ThisFormFields>
): InitialFormViewConfigItem<ThisViewKey, ThisViewState, ThisFormFields> {
  const { getInitialViewState, viewKey, FormHeader, FormFooter, formFields } =
    api;
  return {
    getInitialViewState,
    ...formViewConfig({
      viewKey,
      FormHeader,
      FormFooter,
      formFields,
    }),
  };
}

export interface FormViewConfigItem<ThisViewKey, ThisViewState, ThisFormFields>
  extends ViewItemBase<
    ThisViewKey,
    [
      SectionItem<
        "__formHeader",
        __FormHeaderConfig<ThisViewState>,
        __FormHeaderProps<ThisViewState>
      >,
      SectionItem<
        "__formBody",
        __FormBodyConfig<ThisFormFields>,
        __FormBodyProps<ThisViewState, ThisFormFields>
      >,
      SectionItem<
        "__formFooter",
        __FormFooterConfig<ThisViewState>,
        __FormFooterProps<ThisViewState>
      >
    ]
  > {}

export interface InitialFormViewConfigItem<
  ThisViewKey,
  ThisViewState,
  ThisFormFields
> extends FormViewConfigItem<ThisViewKey, ThisViewState, ThisFormFields>,
    Pick<
      InitialViewItem<irrelevant, unknown, ThisViewState>,
      "getInitialViewState"
    > {}

export interface FormFieldConfigItem<
  ThisViewState,
  ThisFieldKey,
  ThisFieldConfig,
  ThisFieldDisplayProps
> extends Pick<
    FieldDisplayProps<ThisViewState, ThisFieldKey, ThisFieldConfig>,
    "fieldKey" | "fieldConfig"
  > {
  FieldDisplay: (props: ThisFieldDisplayProps) => JSX.Element;
}

export interface FieldDisplayProps<ThisViewState, ThisFieldKey, ThisFieldConfig>
  extends Pick<
    __FormBodyProps<ThisViewState, unknown>,
    "viewState" | "viewApi"
  > {
  fieldKey: ThisFieldKey;
  fieldConfig: ThisFieldConfig;
}

interface __FormHeaderConfig<ThisViewState> {
  FormHeader: FunctionComponent<FormHeaderProps<ThisViewState>>;
}

export interface FormHeaderProps<ThisViewState>
  extends Pick<
    SectionDisplayProps<unknown, unknown, ThisViewState>,
    "viewState" | "viewApi"
  > {}

interface __FormHeaderProps<ThisViewState>
  extends SectionDisplayProps<
    "__formHeader",
    __FormHeaderConfig<ThisViewState>,
    ThisViewState
  > {}

function __FormHeader<ThisViewState>(props: __FormHeaderProps<ThisViewState>) {
  const { sectionConfig, viewState, viewApi } = props;
  return createElement(sectionConfig.FormHeader, {
    viewState,
    viewApi,
  });
}

interface __FormBodyConfig<ThisFormFields> {
  formFields: ThisFormFields;
}

interface __FormBodyProps<ThisViewState, ThisFormFields>
  extends SectionDisplayProps<
    "__formBody",
    __FormBodyConfig<ThisFormFields>,
    ThisViewState
  > {}

function __FormBody<
  ThisViewState,
  ThisFormFields extends [
    FormFieldConfigItem<
      ThisViewState,
      string,
      unknown,
      FieldDisplayProps<ThisViewState, string, unknown>
    >,
    ...Array<
      FormFieldConfigItem<
        ThisViewState,
        string,
        unknown,
        FieldDisplayProps<ThisViewState, string, unknown>
      >
    >
  ]
>(props: __FormBodyProps<ThisViewState, ThisFormFields>) {
  const { sectionConfig, viewState, viewApi } = props;
  return (
    <Fragment>
      {sectionConfig.formFields.map((someFieldItem) =>
        createElement(someFieldItem.FieldDisplay, {
          key: someFieldItem.fieldKey,
          fieldKey: someFieldItem.fieldKey,
          fieldConfig: someFieldItem.fieldConfig,
          viewState,
          viewApi,
        })
      )}
    </Fragment>
  );
}

interface __FormFooterConfig<ThisViewState> {
  FormFooter: FunctionComponent<FormFooterProps<ThisViewState>>;
}

export interface FormFooterProps<ThisViewState>
  extends Pick<
    SectionDisplayProps<unknown, unknown, ThisViewState>,
    "viewState" | "viewApi"
  > {}

interface __FormFooterProps<ThisViewState>
  extends SectionDisplayProps<
    "__formFooter",
    __FormFooterConfig<ThisViewState>,
    ThisViewState
  > {}

function __FormFooter<ThisViewState>(props: __FormFooterProps<ThisViewState>) {
  const { sectionConfig, viewState, viewApi } = props;
  return createElement(sectionConfig.FormFooter, {
    viewState,
    viewApi,
  });
}
