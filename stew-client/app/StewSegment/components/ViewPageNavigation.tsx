import {
  Button,
  ButtonProps,
} from "../../../../stew-library/components/mod.ts";
import {
  CoreAriaOrnamentsData,
  useInteractiveAria,
} from "../../../../stew-library/hooks/mod.ts";
import { getCssClass } from "../../../../stew-library/utilities/mod.ts";
// @deno-types="CssModule"
import cssModule from "./ViewPageNavigation.module.scss";

export interface ViewPageNavigationProps {
  displayViewPageIndex: number;
  displayViewPagesCount: number;
  previousViewPageButtonEnabled: ViewPageButtonProps["buttonEnabled"];
  nextViewPageButtonEnabled: ViewPageButtonProps["buttonEnabled"];
  onSelectPreviousViewPage: ViewPageButtonProps["onSelect"];
  onSelectNextViewPage: ViewPageButtonProps["onSelect"];
}

export function ViewPageNavigation(props: ViewPageNavigationProps) {
  const {
    displayViewPageIndex,
    displayViewPagesCount,
    previousViewPageButtonEnabled,
    onSelectPreviousViewPage,
    nextViewPageButtonEnabled,
    onSelectNextViewPage,
  } = props;
  const { ariaElementRef } = useInteractiveAria({
    ariaOrnaments: {
      ariaRole: "meter",
      ariaLabel: "view pagination meter",
      ariaDescription: "pagination meter for filtered and sorted view items",
      ariaValueMin: `${1}`,
      ariaValueNow: `${displayViewPageIndex}`,
      ariaValueMax: `${displayViewPagesCount}`,
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
        buttonEnabled={previousViewPageButtonEnabled}
        onSelect={onSelectPreviousViewPage}
      />
      <div className={cssModule.navigationMeterContainer} ref={ariaElementRef}>
        <div className={cssModule.navigationMeter}>
          {`${displayViewPageIndex} / ${displayViewPagesCount}`}
        </div>
      </div>
      <ViewPageButton
        buttonLabel={"next"}
        ariaLabel={"next page"}
        ariaDescription={
          "a button that displays the next page of filtered and sorted view items"
        }
        buttonEnabled={nextViewPageButtonEnabled}
        onSelect={onSelectNextViewPage}
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
