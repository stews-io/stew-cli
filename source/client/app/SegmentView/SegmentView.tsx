import { Fragment } from "../../../../shared/deps/preact/mod.ts";
import { StewAppProps } from "../StewApp.tsx";
import {
  SegmentViewMutations,
  UseSegmentViewResult,
  useSegmentView,
} from "./useSegmentView.ts";

export interface SegmentViewProps
  extends Pick<
    StewAppProps,
    "stewConfig" | "stewResourceMap" | "initialSegmentViewState"
  > {}

export function SegmentView(props: SegmentViewProps) {
  const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
  const { segmentViewState, segmentViewData, segmentViewMutations } =
    useSegmentView({
      stewConfig,
      stewResourceMap,
      initialSegmentViewState,
    });
  return (
    <SegmentViewDisplay
      stewConfig={stewConfig}
      segmentViewState={segmentViewState}
      segmentViewData={segmentViewData}
      selectStewSegment={segmentViewMutations.selectStewSegment}
      selectSegmentView={segmentViewMutations.selectSegmentView}
      selectSegmentSortOption={segmentViewMutations.selectSegmentSortOption}
      updateSegmentViewSearch={segmentViewMutations.updateSegmentViewSearch}
      clearSegmentViewSearch={segmentViewMutations.clearSegmentViewSearch}
      gotoPreviousViewPage={segmentViewMutations.gotoPreviousViewPage}
      gotoNextViewPage={segmentViewMutations.gotoNextViewPage}
    />
  );
}

interface SegmentViewDisplayProps
  extends Pick<SegmentViewProps, "stewConfig">,
    Pick<UseSegmentViewResult, "segmentViewState" | "segmentViewData">,
    Pick<
      SegmentViewMutations,
      | "selectStewSegment"
      | "selectSegmentView"
      | "selectSegmentSortOption"
      | "updateSegmentViewSearch"
      | "clearSegmentViewSearch"
      | "gotoPreviousViewPage"
      | "gotoNextViewPage"
    > {}

function SegmentViewDisplay(props: SegmentViewDisplayProps) {
  const {
    stewConfig,
    segmentViewState,
    selectStewSegment,
    selectSegmentView,
    selectSegmentSortOption,
    updateSegmentViewSearch,
    clearSegmentViewSearch,
    gotoPreviousViewPage,
    gotoNextViewPage,
    segmentViewData,
  } = props;
  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(stewConfig.stewSegments)
          .sort(
            (segmentA, segmentB) =>
              segmentA.segmentIndex - segmentB.segmentIndex
          )
          .map((someSegmentConfig) => (
            <div
              style={{
                padding: 8,
                color: "purple",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration:
                  segmentViewState.segmentKey === someSegmentConfig.segmentKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  segmentViewState.segmentKey !== someSegmentConfig.segmentKey
                ) {
                  selectStewSegment(someSegmentConfig.segmentKey);
                }
              }}
            >
              {someSegmentConfig.segmentLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(
          stewConfig.stewSegments[segmentViewState.segmentKey].segmentViews
        )
          .sort((viewA, viewB) => viewA.viewIndex - viewB.viewIndex)
          .map((someViewConfig) => (
            <div
              style={{
                padding: 8,
                color: "blue",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration:
                  segmentViewState.segmentViewKey === someViewConfig.viewKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  segmentViewState.segmentViewKey !== someViewConfig.viewKey
                ) {
                  selectSegmentView(someViewConfig.viewKey);
                }
              }}
            >
              {someViewConfig.viewLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(
          stewConfig.stewSegments[segmentViewState.segmentKey]
            .segmentSortOptions
        )
          .sort(
            (sortOptionA, sortOptionB) =>
              sortOptionA.sortOptionIndex - sortOptionB.sortOptionIndex
          )
          .map((someSortOptionConfig) => (
            <div
              style={{
                padding: 8,
                color: "green",
                cursor: "pointer",
                fontWeight: 700,
                textDecoration:
                  segmentViewState.segmentSortOptionKey ===
                  someSortOptionConfig.sortOptionKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  segmentViewState.segmentSortOptionKey !==
                  someSortOptionConfig.sortOptionKey
                ) {
                  selectSegmentSortOption(someSortOptionConfig.sortOptionKey);
                }
              }}
            >
              {someSortOptionConfig.sortOptionLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row", padding: 8 }}>
        <input
          value={segmentViewState.viewSearchQuery}
          onInput={(someInputEvent) => {
            updateSegmentViewSearch(someInputEvent.currentTarget.value);
          }}
        />
        <div
          style={{
            color: "red",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => {
            clearSegmentViewSearch();
          }}
        >
          clear
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            padding: 8,
            color: "orange",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => {
            if (segmentViewState.viewPageIndex > 0) {
              gotoPreviousViewPage();
            }
          }}
        >
          prev
        </div>
        <div
          style={{
            padding: 8,
            color: "orange",
            cursor: "pointer",
            fontWeight: 700,
          }}
          onClick={() => {
            if (
              segmentViewState.viewPageIndex <
              segmentViewData.viewPagesCount - 1
            ) {
              gotoNextViewPage();
            }
          }}
        >
          next
        </div>
        <div
          style={{
            padding: 8,
            color: "black",
            cursor: "pointer",
            fontWeight: 700,
            fontStyle: "italic",
          }}
        >{`${segmentViewState.viewPageIndex + 1} / ${
          segmentViewData.viewPagesCount
        }`}</div>
      </div>
      {segmentViewState.segmentStatus === "segmentLoaded" ? (
        <Fragment>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 8,
              paddingTop: 12,
            }}
          >
            {segmentViewData.viewPageItems.map((someViewItem) => (
              <div style={{ paddingBottom: 8 }}>
                <segmentViewState.segmentModule.SegmentItemDisplay
                  someSegmentItem={someViewItem}
                />
              </div>
            ))}
          </div>
          <style>{segmentViewState.segmentCss}</style>
        </Fragment>
      ) : null}
    </div>
  );
}
