import {
  ComponentProps,
  Fragment,
  FunctionComponent,
  createElement,
} from "../../../stew-library/deps/preact/mod.ts";
import { Narrow, irrelevantNever } from "../utilities/types.ts";
import {
  InitialViewConfig,
  SectionConfig,
  SectionDisplayProps,
  ViewApi,
  ViewConfig,
} from "./AssistantConfig.ts";

export interface InitialFormViewConfigApi<
  ThisViewState,
  ThisViewKey,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  ThisFormFieldsConfig
> extends FormViewConfigApi<
      ThisViewKey,
      ThisHeaderDisplayProps,
      ThisFooterDisplayProps,
      ThisFormFieldsConfig
    >,
    Pick<
      InitialFormViewConfig<
        ThisViewState,
        irrelevantNever,
        irrelevantNever,
        irrelevantNever,
        irrelevantNever
      >,
      "getInitialViewState"
    > {}

export function initialFormViewConfig<
  ThisViewState,
  ThisViewKey extends string,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  SomeFieldKey extends string,
  ThisFormFieldsConfig extends [
    { fieldKey: SomeFieldKey },
    ...Array<{ fieldKey: SomeFieldKey }>
  ]
>(
  api: InitialFormViewConfigApi<
    ThisViewState,
    ThisViewKey,
    ThisHeaderDisplayProps,
    ThisFooterDisplayProps,
    ThisFormFieldsConfig
  >
): InitialFormViewConfig<
  ThisViewState,
  ThisViewKey,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  ThisFormFieldsConfig
> {
  const { getInitialViewState, ...formViewConfigApi } = api;
  return {
    getInitialViewState,
    ...formViewConfig(formViewConfigApi),
  };
}

export interface FormViewConfigApi<
  ThisViewKey,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  ThisFormFieldsConfig
> extends Pick<
      FormViewConfig<
        ThisViewKey,
        irrelevantNever,
        irrelevantNever,
        irrelevantNever
      >,
      "viewKey"
    >,
    Pick<__FormHeaderData<ThisHeaderDisplayProps>, "formHeader">,
    Pick<__FormBodyData<ThisFormFieldsConfig>, "formFields">,
    Pick<__FormFooterData<ThisFooterDisplayProps>, "formFooter"> {}

export function formViewConfig<
  ThisViewKey extends string,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  SomeFieldKey extends string,
  ThisFormFieldsConfig extends [
    { fieldKey: SomeFieldKey },
    ...Array<{ fieldKey: SomeFieldKey }>
  ]
>(
  api: FormViewConfigApi<
    ThisViewKey,
    ThisHeaderDisplayProps,
    ThisFooterDisplayProps,
    ThisFormFieldsConfig
  >
): FormViewConfig<
  ThisViewKey,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  ThisFormFieldsConfig
> {
  const { viewKey, formHeader, formFields, formFooter } = api;
  return {
    viewKey,
    viewSections: [
      {
        SectionDisplay: __FormHeaderDisplay,
        sectionKey: "__formHeader",
        sectionData: {
          formHeader,
        },
      },
      {
        SectionDisplay: __FormBodyDisplay,
        sectionKey: "__formBody",
        sectionData: {
          formFields,
        },
      },
      {
        SectionDisplay: __FormFooterDisplay,
        sectionKey: "__formFooter",
        sectionData: {
          formFooter,
        },
      },
    ],
  };
}

interface InitialFormViewConfig<
  ThisViewState,
  ThisViewKey,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  ThisFormFieldsConfig
> extends FormViewConfig<
      ThisViewKey,
      ThisHeaderDisplayProps,
      ThisFooterDisplayProps,
      ThisFormFieldsConfig
    >,
    Pick<
      InitialViewConfig<irrelevantNever, irrelevantNever, ThisViewState>,
      "getInitialViewState"
    > {}

interface FormViewConfig<
  ThisViewKey,
  ThisHeaderDisplayProps,
  ThisFooterDisplayProps,
  ThisFormFieldsConfig
> extends ViewConfig<
    ThisViewKey,
    [
      SectionConfig<__FormHeaderDisplayProps<ThisHeaderDisplayProps>>,
      SectionConfig<__FormBodyDisplayProps<ThisFormFieldsConfig>>,
      SectionConfig<__FormFooterDisplayProps<ThisFooterDisplayProps>>
    ]
  > {}

export interface HeaderDisplayProps<
  ThisHeaderKey,
  ThisHeaderData,
  ThisViewState
> extends Pick<
    SectionDisplayProps<irrelevantNever, irrelevantNever, ThisViewState>,
    "viewState" | "viewApi"
  > {
  headerKey: ThisHeaderKey;
  headerData: ThisHeaderData;
}

interface FormHeaderConfig<ThisHeaderDisplayProps>
  extends Pick<
    NarrowHeaderDisplayProps<ThisHeaderDisplayProps>,
    "headerKey" | "headerData"
  > {
  HeaderDisplay: FunctionComponent<ThisHeaderDisplayProps>;
}

interface __FormHeaderData<ThisHeaderDisplayProps> {
  formHeader: FormHeaderConfig<ThisHeaderDisplayProps>;
}

interface __FormHeaderDisplayProps<ThisHeaderDisplayProps>
  extends SectionDisplayProps<
    "__formHeader",
    __FormHeaderData<ThisHeaderDisplayProps>,
    GetFormViewState<ThisHeaderDisplayProps>
  > {}

function __FormHeaderDisplay<ThisHeaderDisplayProps>(
  props: __FormHeaderDisplayProps<ThisHeaderDisplayProps>
) {
  const { sectionData, viewApi, viewState } = props;
  const unknownFormHeader =
    sectionData.formHeader as unknown as FormHeaderConfig<
      HeaderDisplayProps<unknown, unknown, unknown>
    >;
  const unknownViewApi = viewApi as ViewApi<unknown>;
  return createElement(unknownFormHeader.HeaderDisplay, {
    viewState,
    viewApi: unknownViewApi,
    key: unknownFormHeader.headerKey,
    headerKey: unknownFormHeader.headerKey,
    headerData: unknownFormHeader.headerData,
  });
}

type NarrowHeaderDisplayProps<ThisHeaderDisplayProps> = Narrow<
  HeaderDisplayProps<any, any, any>,
  ThisHeaderDisplayProps
>;

export interface FieldDisplayProps<ThisFieldKey, ThisFieldData, ThisViewState>
  extends Pick<
    SectionDisplayProps<irrelevantNever, irrelevantNever, ThisViewState>,
    "viewState" | "viewApi"
  > {
  fieldKey: ThisFieldKey;
  fieldData: ThisFieldData;
}

interface FormFieldConfig<ThisFieldDisplayProps>
  extends Pick<
    NarrowFieldDisplayProps<ThisFieldDisplayProps>,
    "fieldKey" | "fieldData"
  > {
  FieldDisplay: FunctionComponent<ThisFieldDisplayProps>;
}

interface __FormBodyData<ThisFormFieldsConfig> {
  formFields: ThisFormFieldsConfig;
}

interface __FormBodyDisplayProps<ThisFormFieldsConfig>
  extends SectionDisplayProps<
    "__formBody",
    __FormBodyData<ThisFormFieldsConfig>,
    GetFormViewState<
      ComponentProps<
        NarrowFormFieldsConfig<ThisFormFieldsConfig>[0]["FieldDisplay"]
      >
    >
  > {}

function __FormBodyDisplay<ThisFormFieldsConfig>(
  props: __FormBodyDisplayProps<ThisFormFieldsConfig>
) {
  const { sectionData, viewApi, viewState } = props;
  const unknownFormFields = sectionData.formFields as Array<
    FormFieldConfig<FieldDisplayProps<unknown, unknown, unknown>>
  >;
  const unknownViewApi = viewApi as ViewApi<unknown>;
  return (
    <Fragment>
      {unknownFormFields.map((someFieldConfig) =>
        createElement(someFieldConfig.FieldDisplay, {
          viewState,
          viewApi: unknownViewApi,
          key: someFieldConfig.fieldKey,
          fieldKey: someFieldConfig.fieldKey,
          fieldData: someFieldConfig.fieldData,
        })
      )}
    </Fragment>
  );
}

type NarrowFormFieldsConfig<ThisFormFieldsConfig> = Narrow<
  [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
  ],
  ThisFormFieldsConfig
>;

type NarrowFieldDisplayProps<ThisFieldDisplayProps> = Narrow<
  FieldDisplayProps<any, any, any>,
  ThisFieldDisplayProps
>;

export interface FooterDisplayProps<
  ThisFooterKey,
  ThisFooterData,
  ThisViewState
> extends Pick<
    SectionDisplayProps<irrelevantNever, irrelevantNever, ThisViewState>,
    "viewState" | "viewApi"
  > {
  footerKey: ThisFooterKey;
  footerData: ThisFooterData;
}

interface FormFooterConfig<ThisFooterDisplayProps>
  extends Pick<
    NarrowFooterDisplayProps<ThisFooterDisplayProps>,
    "footerKey" | "footerData"
  > {
  FooterDisplay: FunctionComponent<ThisFooterDisplayProps>;
}

interface __FormFooterData<ThisFooterDisplayProps> {
  formFooter: FormFooterConfig<ThisFooterDisplayProps>;
}

interface __FormFooterDisplayProps<ThisFooterDisplayProps>
  extends SectionDisplayProps<
    "__formFooter",
    __FormFooterData<ThisFooterDisplayProps>,
    GetFormViewState<ThisFooterDisplayProps>
  > {}

function __FormFooterDisplay<ThisFooterDisplayProps>(
  props: __FormFooterDisplayProps<ThisFooterDisplayProps>
) {
  const { sectionData, viewApi, viewState } = props;
  const unknownFormHeader =
    sectionData.formFooter as unknown as FormFooterConfig<
      FooterDisplayProps<unknown, unknown, unknown>
    >;
  const unknownViewApi = viewApi as ViewApi<unknown>;
  return createElement(unknownFormHeader.FooterDisplay, {
    viewState,
    viewApi: unknownViewApi,
    key: unknownFormHeader.footerKey,
    footerKey: unknownFormHeader.footerKey,
    footerData: unknownFormHeader.footerData,
  });
}

type NarrowFooterDisplayProps<ThisFooterDisplayProps> = Narrow<
  FooterDisplayProps<any, any, any>,
  ThisFooterDisplayProps
>;

type GetFormViewState<ThisDefinedFormItemDisplayProps> =
  ThisDefinedFormItemDisplayProps extends {
    viewState: infer ThisDefinedViewState;
  }
    ? ThisDefinedViewState
    : never;
