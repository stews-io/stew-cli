import { FunctionComponent } from "../../../../stew-library/deps/preact/mod.ts";
import {
  Bopper,
  BopperProps,
  CustomAnchorButtonProps,
  SelectMenuBaseDataProps,
  SelectButton,
} from "../../mod.ts";

interface SelectBaseProps<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>,
  CustomSelectAnchorButtonProps extends CustomAnchorButtonProps,
  CustomOptionActionItemProps extends Record<string, unknown>,
  CustomMenuFooterProps extends Record<string, unknown>
> extends SelectBaseDataProps<MenuOption>,
    SelectBaseConfigProps<
      MenuOption,
      OptionLabelKey,
      CustomSelectAnchorButtonProps,
      CustomOptionActionItemProps,
      CustomMenuFooterProps
    > {}

export interface SelectBaseDataProps<MenuOption extends object> {
  optionList: Array<MenuOption>;
  selectedOption: MenuOption;
  selectOption: (nextSelectedOption: MenuOption) => void;
}

export interface SelectBaseConfigProps<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>,
  CustomSelectAnchorButtonProps extends CustomAnchorButtonProps,
  CustomOptionActionItemProps extends Record<string, unknown>,
  CustomMenuFooterProps extends Record<string, unknown>
> extends Pick<
    BopperProps<unknown, unknown>,
    "popoverAriaRole" | "anchorAriaLabel" | "anchorAriaDescription"
  > {
  anchorBorderClassName?: string;
  fontSizeClassName?: string;
  selectIconClassName?: string;
  optionTypeLabel: string;
  optionLabelKey: OptionLabelKey;
  customSelectAnchorButtonProps: CustomSelectAnchorButtonProps;
  customOptionActionItemProps: CustomOptionActionItemProps;
  customMenuFooterProps: CustomMenuFooterProps;
  SelectMenu: FunctionComponent<
    SelectMenuBaseDataProps<
      MenuOption,
      OptionLabelKey,
      CustomOptionActionItemProps,
      CustomMenuFooterProps
    >
  >;
}

export type VerifiedOptionLabelKey<MenuOption extends object> = {
  [SomeMenuOptionKey in keyof MenuOption]: MenuOption[SomeMenuOptionKey] extends string
    ? SomeMenuOptionKey
    : never;
}[keyof MenuOption];

export function SelectBase<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>,
  CustomSelectAnchorButtonProps extends CustomAnchorButtonProps,
  CustomOptionActionItemProps extends Record<string, unknown>,
  CustomMenuFooterProps extends Record<string, unknown>
>(
  props: SelectBaseProps<
    MenuOption,
    OptionLabelKey,
    CustomSelectAnchorButtonProps,
    CustomOptionActionItemProps,
    CustomMenuFooterProps
  >
) {
  const {
    SelectMenu,
    popoverAriaRole,
    anchorAriaLabel,
    anchorAriaDescription,
    customSelectAnchorButtonProps,
    anchorBorderClassName,
    fontSizeClassName,
    selectIconClassName,
    selectedOption,
    optionLabelKey,
    optionTypeLabel,
    selectOption,
    optionList,
    customOptionActionItemProps,
    customMenuFooterProps,
  } = props;
  return (
    <Bopper
      SomeAnchorButton={SelectButton}
      PopoverContent={SelectMenu}
      getPopoverLayoutTop={({ anchorElement }) =>
        anchorElement.offsetTop + anchorElement.offsetHeight + 4
      }
      popoverAriaRole={popoverAriaRole}
      anchorAriaLabel={anchorAriaLabel}
      anchorAriaDescription={anchorAriaDescription}
      customSomeAnchorButtonProps={{
        customSelectAnchorButtonProps,
        anchorBorderClassName,
        fontSizeClassName,
        selectIconClassName,
        selectedOption,
        optionLabelKey,
      }}
      customPopoverContentProps={{
        fontSizeClassName,
        selectedOption,
        optionLabelKey,
        optionTypeLabel,
        selectOption,
        optionList,
        customOptionActionItemProps,
        customMenuFooterProps,
      }}
    />
  );
}
