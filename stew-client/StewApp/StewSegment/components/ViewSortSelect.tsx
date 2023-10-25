import { BasicSelect } from "../../../../stew-library/components/mod.ts";
import { useMemo } from "../../../../stew-library/deps/preact/hooks.ts";
import { SegmentPageProps } from "./SegmentPage.tsx";
// @deno-types="CssModule"
import cssModule from "./ViewSortSelect.module.scss";

export interface ViewSortSelectProps
  extends Pick<
    SegmentPageProps,
    "stewConfig" | "stewSegmentState" | "selectSegmentSortOption"
  > {}

export function ViewSortSelect(props: ViewSortSelectProps) {
  const { stewConfig, stewSegmentState, selectSegmentSortOption } = props;
  const { sortedSegmentSortOptions } = useMemo(() => {
    return {
      sortedSegmentSortOptions: Object.values(
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions
      ).sort(
        (configA, configB) => configA.sortOptionIndex - configB.sortOptionIndex
      ),
    };
  }, [stewConfig, stewSegmentState]);
  return (
    <BasicSelect
      anchorBorderClassName={cssModule.viewSortSelectAnchorBorder}
      fontSizeClassName={cssModule.viewSortSelectFontSize}
      selectIconClassName={cssModule.viewSortSelectIcon}
      popoverAriaRole={"listbox"}
      anchorAriaLabel={"select view sort order"}
      anchorAriaDescription={`a button that displays a popover with the view sort order options`}
      optionTypeLabel={"view sort order"}
      optionLabelKey={"sortOptionLabel"}
      optionList={sortedSegmentSortOptions}
      selectedOption={
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentSortOptions[
          stewSegmentState.segmentSortOptionKey
        ]
      }
      selectOption={(nextSortOptionConfig) => {
        selectSegmentSortOption(nextSortOptionConfig.sortOptionKey);
      }}
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
