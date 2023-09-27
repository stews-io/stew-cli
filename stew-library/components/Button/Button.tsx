import { CoreAriaOrnaments, CoreAriaOrnamentsData } from "stew-library/hooks";
import { ButtonBase, ButtonBaseProps } from "./ButtonBase.tsx";

export interface ButtonProps extends CoreButtonProps, CustomButtonProps {}

interface CoreButtonProps extends CoreAriaOrnamentsData {}

interface CustomButtonProps
  extends Omit<
    ButtonBaseProps<ButtonAriaOrnaments>,
    "ariaOrnaments" | "setCustomAriaAttributes"
  > {}

interface ButtonAriaOrnaments extends CoreAriaOrnaments<"button"> {}

export function Button(props: ButtonProps) {
  const { ariaLabel, ariaDescription, ...unadjustedProps } = props;
  return (
    <ButtonBase<ButtonAriaOrnaments>
      setCustomAriaAttributes={() => {}}
      ariaOrnaments={{
        ariaRole: "button",
        ariaLabel,
        ariaDescription,
      }}
      {...unadjustedProps}
    />
  );
}
