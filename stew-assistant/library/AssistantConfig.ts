// not mutually exclusive. a combination of the below can be used
// with each being able to perform their own unique validation
type FieldValidationStrategy =
  | "onChange"
  | "onChangeWhenError"
  // implementing onBlur is extremely difficult
  // | "onBlur"
  // | "onBlurWhenError" // rare, but possible / valuable ???
  | "onSubmit"
  | "onSubmitWhenError" // rare, but possible / valuable ???
  | "manual"
  | "none";

type ErrorDisplayStrategy =
  | "dismissAfterChange"
  | "dismissAfterValid"
  | "manual"
  | "none";
