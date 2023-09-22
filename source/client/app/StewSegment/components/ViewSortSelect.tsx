import { ComponentProps } from "../../../../../shared/deps/preact/mod.ts";
import { CustomAnchorButtonProps } from "../../components/Button/AnchorButton.tsx";
import {
  SelectBase,
  SelectBaseConfigProps,
} from "../../components/Select/SelectBase.tsx";
import { SelectMenuBase } from "../../components/Select/components/SelectMenuBase.tsx";
import { StewSegmentDisplayProps } from "../StewSegment.tsx";
// @deno-types="CssModule"
import cssModule from "./ViewSortSelect.module.scss";

export interface ViewSortSelectProps
  extends Pick<
    StewSegmentDisplayProps,
    "stewConfig" | "stewSegmentState" | "selectSegmentSortOption"
  > {}

export function ViewSortSelect(props: ViewSortSelectProps) {
  const { stewConfig, stewSegmentState, selectSegmentSortOption } = props;
  return (
    <SelectBase
      popoverAriaRole={"listbox"}
      anchorAriaLabel={"select view sort order"}
      anchorAriaDescription={`a button that displays a popover with the view sort order options`}
      optionTypeLabel={"view sort order"}
      optionLabelKey={"sortOptionLabel"}
      SelectMenu={ViewSortSelectMenu}
      anchorBorderClassName={cssModule.viewSortSelectAnchorBorder}
      fontSizeClassName={cssModule.viewSortSelectFontSize}
      selectIconClassName={cssModule.viewSortSelectIcon}
      optionList={Object.values(
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions
      ).sort(
        (configA, configB) => configA.sortOptionIndex - configB.sortOptionIndex
      )}
      selectedOption={
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions[
          stewSegmentState.segmentSortOptionKey
        ]
      }
      selectOption={(nextSortOptionConfig) => {
        selectSegmentSortOption(nextSortOptionConfig.sortOptionKey);
      }}
      customOptionActionItemProps={{}}
      customMenuFooterProps={{}}
      customSelectAnchorButtonProps={{
        onFocus: (someFocusEvent) => {
          const approximateViewSortSelectDocumentTop = 59;
          if (
            !someFocusEvent.currentTarget.hasAttribute("data-pointer-focus") &&
            someFocusEvent.currentTarget.getBoundingClientRect().top <
              approximateViewSortSelectDocumentTop
          ) {
            window.scrollTo({
              behavior: "smooth",
              top: 0,
            });
          }
        },
      }}
    />
  );
}

interface ViewSortSelectMenuProps
  extends ComponentProps<
    SelectBaseConfigProps<
      ViewSortSelectProps["stewConfig"]["stewSegments"][string]["segmentSortOptions"][string],
      "sortOptionLabel",
      CustomAnchorButtonProps,
      Record<string, unknown>,
      Record<string, unknown>
    >["SelectMenu"]
  > {}

function ViewSortSelectMenu(props: ViewSortSelectMenuProps) {
  return (
    <SelectMenuBase
      OptionActionItem={() => null}
      MenuFooter={() => null}
      {...props}
    />
  );
}
