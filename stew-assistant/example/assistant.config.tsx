import {
  ComponentProps,
  FunctionComponent,
  createElement,
  Fragment,
} from "stew/deps/preact/mod.ts";
import {
  SectionConfig,
  SectionDisplayProps,
  ViewConfig,
  assistantConfig,
} from "../library/config/AssistantConfig.ts";
import { VerifiedAssistantConfig } from "../library/config/VerifiedAssistantConfig.ts";
import { irrelevantNever } from "../library/utilities/types.ts";

const exampleConfig = assistantConfig([
  {
    viewKey: "fooView",
    viewSections: [
      {
        SectionDisplay: AaaSectionDisplay,
        sectionKey: "aaaSection",
        sectionData: {
          aaaThing: 2,
        },
      },
    ],
    getInitialViewState: () => ({
      fooThang: "",
    }),
  },
  formViewConfig({
    viewKey: "bazView",
    formHeader: {
      HeaderDisplay: BazHeaderDisplay,
      headerKey: "bazHeader",
      headerData: {
        headerTing: 7,
      },
    },
    formFooter: {
      FooterDisplay: BazFooterDisplay,
      footerKey: "bazFooter",
      footerData: {
        footerThang: 5,
      },
    },
    formFields: [
      {
        FieldDisplay: AaaBazFieldDisplay,
        fieldKey: "aaaBazField",
        fieldData: {},
      },
    ],
  }),
]);

const verifiedExampleConfig: VerifiedAssistantConfig<typeof exampleConfig> =
  exampleConfig;

export default verifiedExampleConfig;

interface FooViewState {
  fooThang: string;
}

interface AaaSectionData {
  aaaThing: number;
}

interface AaaSectionDisplayProps
  extends SectionDisplayProps<"aaaSection", AaaSectionData, FooViewState> {}

function AaaSectionDisplay(props: AaaSectionDisplayProps) {
  const {} = props;
  return null;
}

interface BazFormViewState {
  bazTing: string;
}

interface BazHeaderData {
  headerTing: number;
}

interface BazHeaderDisplayProps
  extends HeaderDisplayProps<"bazHeader", BazHeaderData, BazFormViewState> {}

function BazHeaderDisplay(props: BazHeaderDisplayProps) {
  props.headerKey;
  props.headerData.headerTing;
  props.viewState.bazTing;
  return null;
}

interface BazFooterData {
  footerThang: number;
}

interface BazFooterDisplayProps
  extends FooterDisplayProps<"bazFooter", BazFooterData, BazFormViewState> {}

function BazFooterDisplay(props: BazFooterDisplayProps) {
  return null;
}

interface AaaBazFieldData {}

interface AaaBazFieldDisplayProps
  extends FieldDisplayProps<"aaaBazField", AaaBazFieldData, BazFormViewState> {}

function AaaBazFieldDisplay(props: AaaBazFieldDisplayProps) {
  return null;
}

///
///

interface FormViewConfigApi<
  ThisViewKey,
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>,
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>,
  ThisFormFieldsConfig extends [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
  ]
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
    Pick<__FormFooterData<ThisFooterDisplayProps>, "formFooter">,
    Pick<__FormBodyData<ThisFormFieldsConfig>, "formFields"> {}

function formViewConfig<
  ThisViewKey,
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>,
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>,
  ThisFormFieldsConfig extends [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
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

interface FormViewConfig<
  ThisViewKey,
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>,
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>,
  ThisFormFieldsConfig extends [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
  ]
> extends ViewConfig<
    ThisViewKey,
    [
      SectionConfig<__FormHeaderDisplayProps<ThisHeaderDisplayProps>>,
      SectionConfig<__FormBodyDisplayProps<ThisFormFieldsConfig>>,
      SectionConfig<__FormFooterDisplayProps<ThisFooterDisplayProps>>
    ]
  > {}

interface HeaderDisplayProps<ThisHeaderKey, ThisHeaderData, ThisViewState> {
  headerKey: ThisHeaderKey;
  headerData: ThisHeaderData;
  viewState: ThisViewState;
}

interface FormHeaderConfig<
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>
> extends Pick<ThisHeaderDisplayProps, "headerKey" | "headerData"> {
  HeaderDisplay: FunctionComponent<ThisHeaderDisplayProps>;
}

interface __FormHeaderData<
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>
> {
  formHeader: FormHeaderConfig<
    HeaderDisplayProps<
      ThisHeaderDisplayProps["headerKey"],
      ThisHeaderDisplayProps["headerData"],
      ThisHeaderDisplayProps["viewState"]
    >
  >;
}

interface __FormHeaderDisplayProps<
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>
> extends SectionDisplayProps<
    "__formHeader",
    __FormHeaderData<ThisHeaderDisplayProps>,
    GetFormSectionViewState<ThisHeaderDisplayProps>
  > {}

function __FormHeaderDisplay<
  ThisHeaderDisplayProps extends HeaderDisplayProps<any, any, any>
>(props: __FormHeaderDisplayProps<ThisHeaderDisplayProps>) {
  const { sectionData, viewState } = props;
  return createElement(sectionData.formHeader.HeaderDisplay, {
    viewState,
    key: sectionData.formHeader.headerKey,
    headerKey: sectionData.formHeader.headerKey,
    headerData: sectionData.formHeader.headerData,
  });
}

interface FieldDisplayProps<ThisFieldKey, ThisFieldData, ThisViewState> {
  fieldKey: ThisFieldKey;
  fieldData: ThisFieldData;
  viewState: ThisViewState;
}

interface FormFieldConfig<
  ThisFieldDisplayProps extends FieldDisplayProps<any, any, any>
> extends Pick<ThisFieldDisplayProps, "fieldKey" | "fieldData"> {
  FieldDisplay: FunctionComponent<
    FieldDisplayProps<
      ThisFieldDisplayProps["fieldKey"],
      ThisFieldDisplayProps["fieldData"],
      ThisFieldDisplayProps["viewState"]
    >
  >;
}

interface __FormBodyData<
  ThisFormFieldsConfig extends [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
  ]
> {
  formFields: ThisFormFieldsConfig;
}

interface __FormBodyDisplayProps<
  ThisFormFieldsConfig extends [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
  ]
> extends SectionDisplayProps<
    "__formBody",
    __FormBodyData<ThisFormFieldsConfig>,
    GetFormSectionViewState<
      ComponentProps<ThisFormFieldsConfig[0]["FieldDisplay"]>
    >
  > {}

function __FormBodyDisplay<
  ThisFormFieldsConfig extends [
    FormFieldConfig<FieldDisplayProps<any, any, any>>,
    ...Array<FormFieldConfig<FieldDisplayProps<any, any, any>>>
  ]
>(props: __FormBodyDisplayProps<ThisFormFieldsConfig>) {
  const { sectionData, viewState } = props;
  return (
    <Fragment>
      {sectionData.formFields.map((someFieldConfig) =>
        createElement(someFieldConfig.FieldDisplay, {
          viewState,
          key: someFieldConfig.fieldKey,
          fieldKey: someFieldConfig.fieldKey,
          fieldData: someFieldConfig.fieldData,
        })
      )}
    </Fragment>
  );
}

interface FooterDisplayProps<ThisFooterKey, ThisFooterData, ThisViewState> {
  footerKey: ThisFooterKey;
  footerData: ThisFooterData;
  viewState: ThisViewState;
}

interface FormFooterConfig<
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>
> extends Pick<ThisFooterDisplayProps, "footerKey" | "footerData"> {
  FooterDisplay: FunctionComponent<ThisFooterDisplayProps>;
}

interface __FormFooterData<
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>
> {
  formFooter: FormFooterConfig<
    FooterDisplayProps<
      ThisFooterDisplayProps["footerKey"],
      ThisFooterDisplayProps["footerData"],
      ThisFooterDisplayProps["viewState"]
    >
  >;
}

interface __FormFooterDisplayProps<
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>
> extends SectionDisplayProps<
    "__formFooter",
    __FormFooterData<ThisFooterDisplayProps>,
    GetFormSectionViewState<ThisFooterDisplayProps>
  > {}

function __FormFooterDisplay<
  ThisFooterDisplayProps extends FooterDisplayProps<any, any, any>
>(props: __FormFooterDisplayProps<ThisFooterDisplayProps>) {
  const { sectionData, viewState } = props;
  return createElement(sectionData.formFooter.FooterDisplay, {
    viewState,
    key: sectionData.formFooter.footerKey,
    footerKey: sectionData.formFooter.footerKey,
    footerData: sectionData.formFooter.footerData,
  });
}

type GetFormSectionViewState<ThisDefinedFormSectionDisplayProps> =
  ThisDefinedFormSectionDisplayProps extends {
    viewState: infer ThisDefinedViewState;
  }
    ? ThisDefinedViewState
    : never;
