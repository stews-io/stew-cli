import {
  BasicSelect,
  BasicSelectProps,
  CustomAnchorButtonProps,
} from "../../../stew-library/components/mod.ts";
import { useMemo } from "../../../stew-library/deps/preact/hooks.ts";
import { FieldContainer } from "./FieldContainer.tsx";
// @deno-types="CssModule"
import cssModule from "./SelectField.module.scss";

export interface SelectFieldProps
  extends Pick<
    BasicSelectProps<
      { optionLabel: string; optionValue: string },
      "optionLabel",
      CustomAnchorButtonProps
    >,
    "optionTypeLabel" | "optionList"
  > {
  optionPlaceholder: string;
  someFieldConfig: any;
  formState: any;
  formApi: any;
}

export function SelectField(props: SelectFieldProps) {
  const {
    formState,
    someFieldConfig,
    formApi,
    optionList,
    optionPlaceholder,
    optionTypeLabel,
  } = props;
  const { fieldSelectOption, fieldSelectedOption } = useMemo(
    () => ({
      fieldSelectOption: (nextFieldOption: any) => {
        if (
          nextFieldOption.optionValue !==
          formState.fieldValues[someFieldConfig.fieldKey]
        ) {
          formApi.setFieldValue(
            someFieldConfig.fieldKey,
            nextFieldOption.optionValue
          );
        }
      },
      fieldSelectedOption: optionList.find(
        (someFieldOption) =>
          someFieldOption.optionValue ===
          formState.fieldValues[someFieldConfig.fieldKey]
      ) ?? {
        optionLabel: optionPlaceholder,
        optionValue: null,
      },
    }),
    [formState.fieldValues[someFieldConfig.fieldKey]]
  );
  return (
    <FieldContainer>
      <BasicSelect
        anchorBorderClassName={cssModule.selectFieldBorder}
        anchorAriaLabel={`todo`}
        anchorAriaDescription={`todo`}
        optionLabelKey={"optionLabel"}
        optionList={optionList}
        optionTypeLabel={optionTypeLabel}
        selectOption={fieldSelectOption}
        selectedOption={fieldSelectedOption}
      />
    </FieldContainer>
  );
}
