import { Page } from "../../components/Page/Page.tsx";
import { StewSegmentProps } from "../StewSegment.tsx";
import {
  StewSegmentMutations,
  UseStewSegmentResult,
} from "../hooks/useStewSegment.ts";
import { useStickyPageHeaderWorkaround } from "../hooks/useStickyPageHeaderWorkaround.ts";
import { SegmentViewSelect } from "./SegmentViewSelect.tsx";
import { StewInfoBopper } from "./StewInfoBopper.tsx";
import { ViewSearchInput } from "./ViewSearchInput.tsx";
import { ViewSortSelect } from "./ViewSortSelect.tsx";
// @deno-types="CssModule"
import cssModule from "./StewSegmentDisplay.module.scss";

export interface StewSegmentDisplayProps
  extends Pick<StewSegmentProps, "stewConfig">,
    Pick<UseStewSegmentResult, "stewSegmentState" | "stewSegmentData">,
    Pick<
      StewSegmentMutations,
      | "selectStewSegment"
      | "selectSegmentView"
      | "selectSegmentSortOption"
      | "updateSegmentViewSearch"
      | "clearSegmentViewSearch"
      | "gotoPreviousViewPage"
      | "gotoNextViewPage"
    > {}

export function StewSegmentDisplay(props: StewSegmentDisplayProps) {
  const {
    stewConfig,
    stewSegmentState,
    selectSegmentView,
    selectStewSegment,
    selectSegmentSortOption,
    updateSegmentViewSearch,
    clearSegmentViewSearch,
    gotoPreviousViewPage,
    gotoNextViewPage,
    stewSegmentData,
  } = props;
  const { pageHeaderContainerRef } = useStickyPageHeaderWorkaround({
    stickyPageHeaderWorkaroundClassname: cssModule.stickyPageHeaderWorkaround,
  });
  return (
    <Page
      pageAriaHeader={`${stewConfig.stewInfo.stewName}: ${
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel
      } segment`}
    >
      <div
        ref={pageHeaderContainerRef}
        className={cssModule.pageHeaderContainer}
      >
        <div className={cssModule.pageHeader}>
          <div className={cssModule.viewSelectContainer}>
            <SegmentViewSelect
              stewConfig={stewConfig}
              stewSegmentState={stewSegmentState}
              selectSegmentView={selectSegmentView}
            />
          </div>
          <div className={cssModule.infoBopperContainer}>
            <StewInfoBopper
              stewConfig={stewConfig}
              stewSegmentState={stewSegmentState}
              selectStewSegment={selectStewSegment}
            />
          </div>
        </div>
      </div>
      <div className={cssModule.viewHeaderContainer}>
        <div className={cssModule.viewSortSelectContainer}>
          <ViewSortSelect
            stewConfig={stewConfig}
            stewSegmentState={stewSegmentState}
            selectSegmentSortOption={selectSegmentSortOption}
          />
        </div>
        <div className={cssModule.viewSearchInputContainer}>
          <ViewSearchInput
            stewConfig={stewConfig}
            stewSegmentState={stewSegmentState}
            updateSegmentViewSearch={updateSegmentViewSearch}
            clearSegmentViewSearch={clearSegmentViewSearch}
          />
        </div>
      </div>
    </Page>
  );
}
