import { BasicSelect } from "../../../../stew-library/components/mod.ts";
import { useMemo } from "../../../../stew-library/deps/preact/hooks.ts";
import { Fragment } from "../../../../stew-library/deps/preact/mod.ts";
import { SegmentPageProps } from "./SegmentPage.tsx";
// @deno-types="CssModule"
import cssModule from "./SegmentViewSelect.module.scss";

export interface SegmentViewSelectProps
  extends Pick<
    SegmentPageProps,
    "stewConfig" | "stewSegmentState" | "selectSegmentView"
  > {}

export function SegmentViewSelect(props: SegmentViewSelectProps) {
  const { stewConfig, stewSegmentState, selectSegmentView } = props;
  const { activeSegmentConfig, selectedViewOption, activeSegmentViewOptions } =
    useMemo(() => {
      const activeSegmentConfigResult =
        stewConfig.stewSegments[stewSegmentState.segmentKey];
      return {
        activeSegmentConfig: activeSegmentConfigResult,
        selectedViewOption:
          activeSegmentConfigResult.segmentViews[
            stewSegmentState.segmentViewKey
          ],
        activeSegmentViewOptions: Object.values(
          activeSegmentConfigResult.segmentViews
        ).sort((optionA, optionB) => optionA.viewIndex - optionB.viewIndex),
      };
    }, [stewConfig, stewSegmentState]);
  return (
    <Fragment>
      <h2
        style={{ display: "none" }}
      >{`${activeSegmentConfig.segmentLabel} view: ${selectedViewOption.viewLabel}`}</h2>
      <BasicSelect
        anchorBorderClassName={cssModule.viewSelectAnchorBorder}
        fontSizeClassName={cssModule.viewSelectFontSize}
        optionTypeLabel={"view"}
        optionLabelKey={"viewLabel"}
        popoverAriaRole={"listbox"}
        anchorAriaLabel={`select ${activeSegmentConfig.segmentLabel} view`}
        anchorAriaDescription={`${activeSegmentConfig.segmentLabel} view`}
        optionList={activeSegmentViewOptions}
        selectedOption={selectedViewOption}
        selectOption={(nextSegmentViewOption) => {
          selectSegmentView(nextSegmentViewOption.viewKey);
        }}
      />
    </Fragment>
  );
}
