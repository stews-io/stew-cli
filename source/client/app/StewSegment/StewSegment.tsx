import { Fragment } from "../../../../shared/deps/preact/mod.ts";
import { StewAppProps } from "../StewApp.tsx";
import { Page } from "../components/Page.tsx";
import {
  StewSegmentMutations,
  UseStewSegmentResult,
  useStewSegment,
} from "./useSegmentView.ts";

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

interface StewSegmentDisplayProps
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
    selectStewSegment,
    selectSegmentView,
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
                    stewSegmentState.segmentKey === someSegmentConfig.segmentKey
                      ? "underline"
                      : "none",
                }}
                onClick={() => {
                  if (
                    stewSegmentState.segmentKey !== someSegmentConfig.segmentKey
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
            stewConfig.stewSegments[stewSegmentState.segmentKey].segmentViews
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
                    stewSegmentState.segmentViewKey === someViewConfig.viewKey
                      ? "underline"
                      : "none",
                }}
                onClick={() => {
                  if (
                    stewSegmentState.segmentViewKey !== someViewConfig.viewKey
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
            stewConfig.stewSegments[stewSegmentState.segmentKey]
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
                    stewSegmentState.segmentSortOptionKey ===
                    someSortOptionConfig.sortOptionKey
                      ? "underline"
                      : "none",
                }}
                onClick={() => {
                  if (
                    stewSegmentState.segmentSortOptionKey !==
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
            value={stewSegmentState.viewSearchQuery}
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
              if (stewSegmentState.viewPageIndex > 0) {
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
                stewSegmentState.viewPageIndex <
                stewSegmentData.viewPagesCount - 1
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
          >{`${stewSegmentState.viewPageIndex + 1} / ${
            stewSegmentData.viewPagesCount
          }`}</div>
        </div>
        {stewSegmentState.segmentStatus === "segmentLoaded" ? (
          <Fragment>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                padding: 8,
                paddingTop: 12,
              }}
            >
              {stewSegmentData.viewPageItems.map((someViewItem) => (
                <div style={{ paddingBottom: 8 }}>
                  <stewSegmentState.segmentModule.SegmentItemDisplay
                    someSegmentItem={someViewItem}
                  />
                </div>
              ))}
            </div>
            <style>{stewSegmentState.segmentCss}</style>
          </Fragment>
        ) : null}
      </div>
    </Page>
  );
}
