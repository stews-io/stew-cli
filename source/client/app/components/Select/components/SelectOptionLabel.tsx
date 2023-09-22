import { Fragment } from "../../../../../../shared/deps/preact/mod.ts";
import { throwInvalidPathError } from "../../../../../../shared/general/throwInvalidPathError.ts";
import { CustomAnchorButtonProps } from "../../Button/AnchorButton.tsx";
import {
  SelectBaseConfigProps,
  VerifiedOptionLabelKey,
} from "../SelectBase.tsx";

export interface SelectMenuOptionLabelProps<
  SelectOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<SelectOption>
> extends Pick<
    SelectBaseConfigProps<
      SelectOption,
      OptionLabelKey,
      CustomAnchorButtonProps,
      Record<string, unknown>,
      Record<string, unknown>
    >,
    "optionLabelKey"
  > {
  someSelectOption: SelectOption;
}

export function SelectOptionLabel<
  SelectOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<SelectOption>
>(props: SelectMenuOptionLabelProps<SelectOption, OptionLabelKey>) {
  const { someSelectOption, optionLabelKey } = props;
  const optionLabel = someSelectOption[optionLabelKey];
  return typeof optionLabel === "string" ? (
    <Fragment>{optionLabel}</Fragment>
  ) : (
    throwInvalidPathError("SelectMenuOptionLabel")
  );
}
