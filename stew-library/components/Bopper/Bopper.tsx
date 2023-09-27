import { Fragment, FunctionComponent } from "preact";
import { useRef, useState } from "preact/hooks";
import { CoreAriaOrnamentsData } from "../../hooks/mod.ts";
import { CoreAnchorButtonProps, Popover, PopoverProps } from "../mod.ts";

export interface BopperProps<
  CustomSomeAnchorButtonProps,
  CustomPopoverContentProps
> extends Pick<
    PopoverProps<CustomPopoverContentProps>,
    | "PopoverContent"
    | "getPopoverLayoutTop"
    | "customPopoverContentProps"
    | "popoverAriaRole"
  > {
  anchorAriaLabel: CoreAriaOrnamentsData["ariaLabel"];
  anchorAriaDescription: CoreAriaOrnamentsData["ariaDescription"];
  customSomeAnchorButtonProps: CustomSomeAnchorButtonProps;
  SomeAnchorButton: FunctionComponent<
    SomeAnchorButtonProps<CustomSomeAnchorButtonProps>
  >;
}

type SomeAnchorButtonProps<CustomAnchorButtonProps> = CoreAnchorButtonProps &
  CustomAnchorButtonProps;

export function Bopper<CustomSomeAnchorButtonProps, CustomPopoverContentProps>(
  props: BopperProps<CustomSomeAnchorButtonProps, CustomPopoverContentProps>
) {
  const {
    SomeAnchorButton,
    anchorAriaLabel,
    anchorAriaDescription,
    popoverAriaRole,
    customSomeAnchorButtonProps,
    PopoverContent,
    getPopoverLayoutTop,
    customPopoverContentProps,
  } = props;
  const anchorElementRef = useRef<HTMLDivElement>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  return (
    <Fragment>
      {/* Popover seems to need to be placed before SomeAnchorButton or else anchorElementRef.current is null within Popover but not SomeAnchorButton  */}
      <Popover
        popoverAriaRole={popoverAriaRole}
        PopoverContent={PopoverContent}
        getPopoverLayoutTop={getPopoverLayoutTop}
        anchorElementRef={anchorElementRef}
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
        customPopoverContentProps={customPopoverContentProps}
      />
      <SomeAnchorButton
        ariaLabel={anchorAriaLabel}
        ariaDescription={anchorAriaDescription}
        popoverAriaRole={popoverAriaRole}
        anchorElementRef={anchorElementRef}
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
        {...customSomeAnchorButtonProps}
      />
    </Fragment>
  );
}
