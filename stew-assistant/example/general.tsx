import { useEffect, useMemo } from "stew/deps/preact/hooks.ts";
import { ComponentChildren } from "stew/deps/preact/mod.ts";
import {
  BasicSelect,
  BasicSelectProps,
  CustomAnchorButtonProps,
} from "stew/components/mod.ts";
// @deno-types="CssModule"
import cssModule from "./general.module.scss";

export interface SelectFieldProps
  extends Pick<
    BasicSelectProps<
      { optionLabel: string; optionValue: string },
      "optionLabel",
      CustomAnchorButtonProps
    >,
    "optionTypeLabel" | "optionList"
  > {
  someFieldConfig: any;
  formState: any;
  formApi: any;
}

export function SelectField(props: SelectFieldProps) {
  const { formState, someFieldConfig, formApi, optionList, optionTypeLabel } =
    props;
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
        optionLabel: "select item type",
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

export interface UseFieldEventsApi {
  someFieldConfig: any;
  formState: any;
  formApi: any;
}

export function useFieldEvents(api: UseFieldEventsApi) {
  const { someFieldConfig, formState, formApi } = api;
  useEffect(() => {
    if (someFieldConfig.fieldOnChange) {
      someFieldConfig.fieldOnChange({
        formState,
        formApi,
      });
    }
  }, [formState.fieldValues[someFieldConfig.fieldKey]]);
}

export interface FieldContainerProps {
  children: ComponentChildren;
}

export function FieldContainer(props: FieldContainerProps) {
  const { children } = props;
  return <div className={cssModule.fieldContainer}>{children}</div>;
}
