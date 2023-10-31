import { useMemo } from "../../../../stew-library/deps/preact/hooks.ts";
import { ComponentProps } from "../../../../stew-library/deps/preact/mod.ts";
import { CustomAnchorButtonProps } from "../Button/AnchorButton.tsx";
import {
  SelectBase,
  SelectBaseConfigProps,
  SelectBaseDataProps,
  VerifiedOptionLabelKey,
} from "./SelectBase.tsx";
import { SelectMenuBase } from "./components/SelectMenuBase.tsx";

export interface BasicSelectProps<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>,
  CustomSelectAnchorButtonProps extends CustomAnchorButtonProps
> extends SelectBaseDataProps<MenuOption>,
    Pick<
      SelectBaseConfigProps<
        MenuOption,
        OptionLabelKey,
        CustomSelectAnchorButtonProps,
        Record<string, unknown>,
        Record<string, unknown>
      >,
      | "anchorAriaDescription"
      | "anchorAriaLabel"
      | "anchorBorderClassName"
      | "fontSizeClassName"
      | "optionLabelKey"
      | "optionTypeLabel"
      | "selectIconClassName"
    > {
  customSelectAnchorButtonProps?: CustomSelectAnchorButtonProps;
}

export function BasicSelect<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>,
  CustomSelectAnchorButtonProps extends CustomAnchorButtonProps
>(
  props: BasicSelectProps<
    MenuOption,
    OptionLabelKey,
    CustomSelectAnchorButtonProps
  >
) {
  const __staticObjectProp = useMemo(() => ({}), []);
  return (
    <SelectBase
      popoverAriaRole={"listbox"}
      SelectMenu={BasicViewSelectMenu<MenuOption, OptionLabelKey>}
      customOptionActionItemProps={__staticObjectProp}
      customMenuFooterProps={__staticObjectProp}
      customSelectAnchorButtonProps={__staticObjectProp}
      {...props}
    />
  );
}

interface BasicViewSelectMenuProps<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>
> extends ComponentProps<
    SelectBaseConfigProps<
      MenuOption,
      OptionLabelKey,
      Omit<CustomAnchorButtonProps, keyof CustomAnchorButtonProps>,
      Record<string, unknown>,
      Record<string, unknown>
    >["SelectMenu"]
  > {}

function BasicViewSelectMenu<
  MenuOption extends object,
  OptionLabelKey extends VerifiedOptionLabelKey<MenuOption>
>(props: BasicViewSelectMenuProps<MenuOption, OptionLabelKey>) {
  return (
    <SelectMenuBase
      OptionActionItem={EmptyOptionActionItem}
      MenuFooter={EmptyMenuFooter}
      {...props}
    />
  );
}

function EmptyOptionActionItem() {
  return null;
}

function EmptyMenuFooter() {
  return null;
}
