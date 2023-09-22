import { StewAppProps } from "../StewApp.tsx";
import {
  StewSegmentMutations,
  UseStewSegmentResult,
  useStewSegment,
} from "./useSegmentView.ts";
import { Page } from "../components/Page/Page.tsx";
import { SegmentViewSelect } from "./components/SegmentViewSelect.tsx";
import { StewInfoBopper } from "./components/StewInfoBopper.tsx";
// @deno-types="CssModule"
import cssModule from "./StewSegment.module.scss";
import { ViewSortSelect } from "./components/ViewSortSelect.tsx";
import { ViewSearchInput } from "./components/ViewSearchInput.tsx";

export interface StewSegmentProps
  extends Pick<
    StewAppProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {}

export function StewSegment(props: StewSegmentProps) {
  const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
  const { stewSegmentState, stewSegmentData, stewSegmentMutations } =
    useStewSegment({
      stewConfig,
      stewResourceMap,
      initialSegmentViewState,
    });
  return (
    <StewSegmentDisplay
      stewConfig={stewConfig}
      stewSegmentState={stewSegmentState}
      stewSegmentData={stewSegmentData}
      selectStewSegment={stewSegmentMutations.selectStewSegment}
      selectSegmentView={stewSegmentMutations.selectSegmentView}
      selectSegmentSortOption={stewSegmentMutations.selectSegmentSortOption}
      updateSegmentViewSearch={stewSegmentMutations.updateSegmentViewSearch}
      clearSegmentViewSearch={stewSegmentMutations.clearSegmentViewSearch}
      gotoPreviousViewPage={stewSegmentMutations.gotoPreviousViewPage}
      gotoNextViewPage={stewSegmentMutations.gotoNextViewPage}
    />
  );
}

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

function StewSegmentDisplay(props: StewSegmentDisplayProps) {
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
  return (
    <Page
      pageAriaHeader={`${stewConfig.stewInfo.stewName}: ${
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel
      } segment`}
    >
      <div className={cssModule.pageHeaderContainer}>
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
