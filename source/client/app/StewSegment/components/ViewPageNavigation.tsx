import { Button, ButtonProps } from "../../components/Button/Button.tsx";
import { getCssClass } from "../../general/getCssClass.ts";
import {
  CoreAriaOrnamentsData,
  useInteractiveAria,
} from "../../hooks/useInteractiveAria.ts";
import { ViewPageSegmentContentProps } from "./SegmentContent.tsx";
// @deno-types="CssModule"
import cssModule from "./ViewPageNavigation.module.scss";

export interface ViewPageNavigationProps
  extends Pick<
    ViewPageSegmentContentProps,
    | "stewSegmentState"
    | "viewPageItems"
    | "viewPagesCount"
    | "gotoPreviousViewPage"
    | "gotoNextViewPage"
  > {}

export function ViewPageNavigation(props: ViewPageNavigationProps) {
  const {
    stewSegmentState,
    viewPagesCount,
    gotoPreviousViewPage,
    gotoNextViewPage,
  } = props;
  const displayViewPageIndex = stewSegmentState.viewPageIndex + 1;
  const { ariaElementRef } = useInteractiveAria({
    ariaOrnaments: {
      ariaRole: "meter",
      ariaLabel: "view pagination meter",
      ariaDescription: "pagination meter for filtered and sorted view items",
      ariaValueMin: `${1}`,
      ariaValueNow: `${displayViewPageIndex}`,
      ariaValueMax: `${viewPagesCount}`,
    },
    setCustomAriaAttributes: (ariaElement, ariaOrnaments) => {
      ariaElement.setAttribute("aria-valuemin", ariaOrnaments.ariaValueMin);
      ariaElement.setAttribute("aria-valuenow", ariaOrnaments.ariaValueNow);
      ariaElement.setAttribute("aria-valuemax", ariaOrnaments.ariaValueMax);
    },
  });
  return (
    <div className={cssModule.navigationContainer}>
      <ViewPageButton
        buttonLabel={"prev"}
        ariaLabel={"previous page"}
        ariaDescription={
          "a button that displays the previous page of filtered and sorted view items"
        }
        buttonEnabled={stewSegmentState.viewPageIndex > 0}
        onSelect={() => {
          gotoPreviousViewPage();
        }}
      />
      <div className={cssModule.navigationMeterContainer} ref={ariaElementRef}>
        <div className={cssModule.navigationMeter}>
          {`${displayViewPageIndex} / ${viewPagesCount}`}
        </div>
      </div>
      <ViewPageButton
        buttonLabel={"next"}
        ariaLabel={"next page"}
        ariaDescription={
          "a button that displays the next page of filtered and sorted view items"
        }
        buttonEnabled={stewSegmentState.viewPageIndex < viewPagesCount - 1}
        onSelect={() => {
          gotoNextViewPage();
        }}
      />
    </div>
  );
}

interface ViewPageButtonProps
  extends CoreAriaOrnamentsData,
    Pick<ButtonProps, "onSelect"> {
  buttonEnabled: boolean;
  buttonLabel: string;
}

function ViewPageButton(props: ViewPageButtonProps) {
  const { ariaLabel, ariaDescription, buttonEnabled, onSelect, buttonLabel } =
    props;
  const buttonDisabled = !buttonEnabled;
  return (
    <Button
      ariaLabel={ariaLabel}
      ariaDescription={ariaDescription}
      tabIndex={buttonEnabled ? 0 : -1}
      disabled={buttonDisabled}
      className={getCssClass(cssModule.viewPageButton, [
        cssModule.disabledViewPageButtonOverride,
        buttonDisabled,
      ])}
      onSelect={onSelect}
    >
      {buttonLabel}
    </Button>
  );
}
