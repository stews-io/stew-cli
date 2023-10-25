import { ComponentProps, JSX } from "stew/deps/preact/mod.ts";

export function assistantConfig<
  AssistantForms extends [
    EntryAssistantFormConfig<any>,
    ...Array<AssistantFormConfig<any>>
  ]
>(
  someAssistantConfig: SourceAssistantConfig<AssistantForms>
): SourceAssistantConfig<AssistantForms> {
  return someAssistantConfig;
}

export interface SourceAssistantConfig<
  AssistantForms extends [
    EntryAssistantFormConfig<any>,
    ...Array<AssistantFormConfig<any>>
  ]
> extends AssistantConfigBase<AssistantForms> {}

export interface BuildAssistantConfig
  extends AssistantConfigBase<
    Record<
      string,
      AssistantFormConfig<Record<string, AssistantFormField<unknown>>>
    >
  > {
  assistantEntryFormConfig: EntryAssistantFormConfig<
    Record<string, AssistantFormField<unknown>>
  >;
}

interface AssistantConfigBase<AssistantForms> {
  assistantForms: AssistantForms;
}

export interface EntryAssistantFormConfig<
  AssistantFormFields extends Record<string, AssistantFormField<any>>
> extends AssistantFormConfig<AssistantFormFields> {
  getInitialFormFields: () => ComponentProps<
    AssistantFormConfig<AssistantFormFields>["FormComponent"]
  >["formFields"];
}

interface AssistantFormConfig<
  AssistantFormFields extends Record<string, AssistantFormField<any>>
> {
  formKey: string;
  formLabel: string;
  FormComponent: AssistantFormComponent<AssistantFormFields>;
}

// type StringPermutation<SomeString extends string> = {
//   [SomeStringValue in SomeString]: [
//     SomeStringValue,
//     ...(Exclude<SomeString, SomeStringValue> extends never
//       ? []
//       : StringPermutation<Exclude<SomeString, SomeStringValue>>)
//   ];
// }[SomeString];

export type AssistantFormComponent<
  AssistantFormFields extends Record<string, AssistantFormField<any>>
> = (props: AssistantFormProps<AssistantFormFields>) => JSX.Element;

export interface AssistantFormProps<
  FormFields extends Record<string, AssistantFormField<any>>
> {
  formFields: FormFields;
  formApi: AssistantFormApi<FormFields>;
}

interface AssistantFormApi<
  FormFields extends Record<string, AssistantFormField<any>>
> {
  replaceForm: (
    formKey: string,
    initialFormFields: Record<string, AssistantFormField<any>>
  ) => void;
  setField: <FieldKey extends keyof FormFields>(
    fieldKey: keyof FormFields,
    nextField: FormFields[FieldKey]
  ) => void;
}

export type AssistantFormField<FieldValue> =
  | NormalFormField<FieldValue>
  | FetchingFormField<FieldValue>
  | ErrorFormField<FieldValue>;

interface NormalFormField<FieldValue>
  extends AssistantFormFieldBase<"normal", FieldValue> {}

interface FetchingFormField<FieldValue>
  extends AssistantFormFieldBase<"fetching", FieldValue> {
  fieldWorker: Promise<void>;
}

interface ErrorFormField<FieldValue>
  extends AssistantFormFieldBase<"error", FieldValue> {
  fieldError: string;
}

interface AssistantFormFieldBase<FieldStatus, FieldValue> {
  fieldStatus: FieldStatus;
  fieldKey: string;
  fieldValue: FieldValue;
}
