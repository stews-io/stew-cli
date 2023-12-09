import { FunctionComponent } from "stew/deps/preact/mod.ts";

const exampleConfig = formConfig({
  formKey: "fooForm",
  formHeader: {
    HeaderDisplay: FooHeader,
    headerKey: "fooHeader",
    headerConfig: {
      headerThang: "Asdf" as const,
    },
  },
  formFooter: {
    FooterDisplay: FooFooter,
    footerKey: "fooFooter",
    footerConfig: {
      footerThang: 3,
    },
  },
  formFields: [
    {
      FieldDisplay: AaaField,
      fieldKey: "aaaField",
      fieldConfig: {},
    },
    {
      FieldDisplay: BbbField,
      fieldKey: "bbbField",
      fieldConfig: {},
    },
  ],
});

const strictExampleConfig: VerifyFormConfig<typeof exampleConfig> =
  exampleConfig;
const strictExampleFieldsConfig: VerifyFieldsConfig<
  (typeof exampleConfig)["formFields"]
> = exampleConfig.formFields;

strictExampleConfig.formHeader;
strictExampleConfig.formHeader.headerKey;
strictExampleConfig.formHeader.HeaderDisplay;
strictExampleConfig.formHeader.headerConfig.headerThang;
strictExampleConfig.formFields;
strictExampleConfig.formFields[0].fieldKey;
strictExampleConfig.formFields[0].fieldConfig;

///
///

interface FooFieldValues {
  aaaField: string;
  bbbField: number;
}

interface FooFormState extends FormState<FooFieldValues> {
  fooThingy: number;
}

interface FooHeaderConfig {
  headerThang: string;
}

interface FooHeaderProps
  extends HeaderDisplayProps<"fooHeader", FooHeaderConfig, FooFormState> {}

function FooHeader(props: FooHeaderProps) {
  return null;
}

interface FooFooterConfig {
  footerThang: number;
}

interface FooFooterProps
  extends FooterDisplayProps<"fooFooter", FooFooterConfig, FooFormState> {}

function FooFooter(props: FooFooterProps) {
  return null;
}

interface AaaFieldConfig {}

interface AaaFieldProps
  extends FieldDisplayProps<"aaaField", AaaFieldConfig, FooFormState> {}

function AaaField(props: AaaFieldProps) {
  return null;
}

interface BbbFieldConfig {}

interface BbbFieldProps
  extends FieldDisplayProps<"bbbField", BbbFieldConfig, FooFormState> {}

function BbbField(props: BbbFieldProps) {
  return null;
}

///
///

type VerifyFormConfig<ThisProvidedFormConfig> =
  ThisProvidedFormConfig extends InternalFormConfig<
    infer ThisProvidedFormKey,
    infer ThisProvidedFormHeader,
    infer ThisProvidedFormFooter,
    infer ThisProvidedFormFields
  >
    ? ThisProvidedFormHeader extends {
        HeaderDisplay: FunctionComponent<
          HeaderDisplayProps<
            infer ThisDefinedHeaderKey,
            infer ThisDefinedHeaderConfig,
            infer ThisDefinedHeaderFormState
          >
        >;
      }
      ? ThisProvidedFormFooter extends {
          FooterDisplay: FunctionComponent<
            FooterDisplayProps<
              infer ThisDefinedFooterKey,
              infer ThisDefinedFooterConfig,
              irrelevant
            >
          >;
        }
        ? FormConfig<
            ThisProvidedFormKey,
            ThisDefinedHeaderFormState,
            FormHeader<ThisDefinedHeaderKey, ThisDefinedHeaderConfig>,
            FormFooter<ThisDefinedFooterKey, ThisDefinedFooterConfig>,
            VerifyFieldsConfig<ThisProvidedFormFields>
          >
        : never
      : never
    : never;

interface InternalFormConfig<
  ThisFormKey,
  ThisFormHeader,
  ThisFormFooter,
  ThisFormFields
> {
  formKey: ThisFormKey;
  formHeader: ThisFormHeader;
  formFooter: ThisFormFooter;
  formFields: ThisFormFields;
}

type VerifyFieldsConfig<
  RemainingFormFields,
  ResultFormFields extends Array<any> = []
> = RemainingFormFields extends [
  infer CurrentFormField,
  ...infer NextRemainingFormFields
]
  ? CurrentFormField extends {
      FieldDisplay: FunctionComponent<
        FieldDisplayProps<
          infer ThisDefinedFieldKey,
          infer ThisDefinedFieldConfig,
          irrelevant
        >
      >;
    }
    ? VerifyFieldsConfig<
        NextRemainingFormFields,
        [
          ...ResultFormFields,
          FormField<ThisDefinedFieldKey, ThisDefinedFieldConfig>
        ]
      >
    : never
  : ResultFormFields;

function formConfig<
  SomeKey extends string,
  ThisFormConfig extends {
    formKey: SomeKey;
    formHeader: {
      headerKey: SomeKey;
    };
    formFooter: {
      footerKey: SomeKey;
    };
    formFields: [{ fieldKey: SomeKey }, ...Array<{ fieldKey: SomeKey }>];
  }
>(thisFormConfig: ThisFormConfig) {
  return thisFormConfig;
}

interface FormConfig<
  ThisFormKey,
  ThisFormState,
  ThisFormHeader,
  ThisFormFooter,
  ThisFormFields
> {
  formKey: ThisFormKey;
  formHeader: FormHeaderConfig<ThisFormState, ThisFormHeader>;
  formFooter: FormFooterConfig<ThisFormState, ThisFormFooter>;
  formFields: GetFormFieldsConfig<ThisFormState, ThisFormFields>;
}

interface HeaderDisplayProps<ThisHeaderKey, ThisHeaderConfig, ThisFormState> {
  headerKey: ThisHeaderKey;
  headerConfig: ThisHeaderConfig;
  formState: ThisFormState;
}

interface FormHeaderConfig<ThisFormState, ThisFormHeader>
  extends Pick<
    HeaderDisplayProps<
      GetHeaderKey<ThisFormHeader>,
      GetHeaderConfig<ThisFormHeader>,
      irrelevant
    >,
    "headerKey" | "headerConfig"
  > {
  HeaderDisplay: FunctionComponent<
    HeaderDisplayProps<this["headerKey"], this["headerConfig"], ThisFormState>
  >;
}

interface FormHeader<ThisHeaderKey, ThisHeaderConfig>
  extends Pick<
    FormHeaderConfig<never, FormHeader<ThisHeaderKey, ThisHeaderConfig>>,
    "headerKey" | "headerConfig"
  > {}

type GetHeaderKey<ThisFormHeader> = ThisFormHeader extends FormHeader<
  infer ThisDefinedHeaderKey,
  irrelevant
>
  ? ThisDefinedHeaderKey
  : never;

type GetHeaderConfig<ThisFormHeader> = ThisFormHeader extends FormHeader<
  irrelevant,
  infer ThisDefinedHeaderConfig
>
  ? ThisDefinedHeaderConfig
  : never;

interface FooterDisplayProps<ThisFooterKey, ThisFooterConfig, ThisFormState> {
  footerKey: ThisFooterKey;
  footerConfig: ThisFooterConfig;
  formState: ThisFormState;
}

interface FormFooterConfig<ThisFormState, ThisFormFooter>
  extends Pick<
    FooterDisplayProps<
      GetFooterKey<ThisFormFooter>,
      GetFooterConfig<ThisFormFooter>,
      irrelevant
    >,
    "footerKey" | "footerConfig"
  > {
  FooterDisplay: FunctionComponent<
    FooterDisplayProps<this["footerKey"], this["footerConfig"], ThisFormState>
  >;
}

interface FormFooter<ThisFooterKey, ThisFooterConfig>
  extends Pick<
    FormFooterConfig<never, FormFooter<ThisFooterKey, ThisFooterConfig>>,
    "footerKey" | "footerConfig"
  > {}

type GetFooterKey<ThisFormFooter> = ThisFormFooter extends FormFooter<
  infer ThisDefinedFooterKey,
  irrelevant
>
  ? ThisDefinedFooterKey
  : irrelevant;

type GetFooterConfig<ThisFormFooter> = ThisFormFooter extends FormFooter<
  irrelevant,
  infer ThisDefinedFooterConfig
>
  ? ThisDefinedFooterConfig
  : never;

type GetFormFieldsConfig<
  ThisFormState,
  RemainingFormFields,
  ResultFormFields extends Array<any> = []
> = RemainingFormFields extends [
  infer CurrentFormField,
  ...infer NextRemainingFormFields
]
  ? CurrentFormField extends FormField<
      infer ThisDefinedFieldKey,
      infer ThisDefinedFieldConfig
    >
    ? GetFormFieldsConfig<
        ThisFormState,
        NextRemainingFormFields,
        [
          ...ResultFormFields,
          FormFieldConfig<
            ThisDefinedFieldKey,
            ThisDefinedFieldConfig,
            ThisFormState
          >
        ]
      >
    : never
  : ResultFormFields;

interface FieldDisplayProps<ThisFieldKey, ThisFieldConfig, ThisFormState> {
  fieldKey: ThisFieldKey;
  fieldConfig: ThisFieldConfig;
  formState: ThisFormState;
}

interface FormFieldConfig<ThisFieldKey, ThisFieldConfig, ThisFormState>
  extends Pick<
    FieldDisplayProps<ThisFieldKey, ThisFieldConfig, irrelevant>,
    "fieldKey" | "fieldConfig"
  > {
  FieldDisplay: FunctionComponent<
    FieldDisplayProps<this["fieldKey"], this["fieldConfig"], ThisFormState>
  >;
}

interface FormField<ThisFieldKey, ThisFieldConfig> {
  fieldKey: ThisFieldKey;
  fieldConfig: ThisFieldConfig;
  FieldDisplay: unknown;
}

interface FormState<ThisFieldValues> {
  fieldValues: ThisFieldValues;
  fieldErrors: Partial<Record<keyof this["fieldValues"], string>>;
}

type irrelevant = never;
