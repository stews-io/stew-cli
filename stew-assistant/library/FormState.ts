export type FormState<SomeFormFields> =
  | NormalFormState<SomeFormFields>
  | SubmittingFormState<SomeFormFields>
  | ErrorFormState<SomeFormFields>;

interface NormalFormState<SomeFormFields>
  extends FormStateBase<"normal", SomeFormFields> {}

interface SubmittingFormState<SomeFormFields>
  extends FormStateBase<"submitting", SomeFormFields> {}

interface ErrorFormState<SomeFormFields>
  extends FormStateBase<"error", SomeFormFields> {}

interface FormStateBase<FormStatus, SomeFormFields> {
  formStatus: FormStatus;
  formFields: SomeFormFields;
}

export type FormField<FieldValue> =
  | NormalFormField<FieldValue>
  | FetchingFormField<FieldValue>
  | ErrorFormField<FieldValue>;

interface NormalFormField<FieldValue>
  extends FormFieldBase<"normal", FieldValue> {}

interface FetchingFormField<FieldValue>
  extends FormFieldBase<"fetching", FieldValue> {
  fieldWorker: Promise<void>;
}

interface ErrorFormField<FieldValue>
  extends FormFieldBase<"error", FieldValue> {
  fieldError: string;
}

interface FormFieldBase<FieldStatus, FieldValue> {
  fieldStatus: FieldStatus;
  fieldKey: string;
  fieldValue: FieldValue;
}
