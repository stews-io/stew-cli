import {
  MutableRef,
  StateUpdater,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "../../../shared/deps/preact/hooks.ts";
import { Fragment } from "../../../shared/deps/preact/mod.ts";
import { throwInvalidPathError } from "../../../shared/general/throwInvalidPathError.ts";
import {
  BuildSegmentItem,
  SegmentDataset,
} from "../../../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../../../shared/types/SegmentModule.ts";
import { SegmentViewsMap } from "../../../shared/types/SegmentViewsMap.ts";
import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";
import { StewState } from "./StewState.ts";
import { fetchSegmentComponents } from "./fetchSegmentComponents.ts";
import { findMapItem } from "./findMapItem.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialStewState: StewState;
}

export function StewApp(props: StewAppProps) {
  const { initialStewState, stewConfig, stewResourceMap } = props;
  const segmentSwitchCountRef = useRef(0);
  const [stewState, setStewState] = useState<StewState>(initialStewState);
  useEffect(() => {
    const nextUrlSearchParams = new URLSearchParams();
    nextUrlSearchParams.set("sort", `${stewState.segmentSortOptionKey}`);
    if (stewState.viewSearchQuery.length > 0) {
      nextUrlSearchParams.set("search", stewState.viewSearchQuery);
    }
    window.history.replaceState(
      null,
      "noop",
      `/${stewState.segmentKey}/${
        stewState.segmentViewKey
      }?${nextUrlSearchParams.toString()}`
    );
  }, [
    stewState.segmentKey,
    stewState.segmentViewKey,
    stewState.segmentSortOptionKey,
    stewState.viewSearchQuery,
  ]);
  useEffect(() => {
    if (stewState.segmentStatus === "loadingSegment") {
      loadSegment({
        stewResourceMap,
        stewState,
        setStewState,
        segmentSwitchCountRef,
        correspondingSwitchCount: segmentSwitchCountRef.current,
      });
    }
  }, [stewState.segmentKey]);
  const { searchedAndSortedViewItems } = useMemo(() => {
    const currentViewSearchQuery = stewState.viewSearchQuery;
    return {
      searchedAndSortedViewItems:
        stewState.segmentStatus === "segmentLoaded"
          ? stewState.segmentViewsMap[stewState.segmentViewKey]
              .reduce<Array<BuildSegmentItem>>(
                (searchedAndSortedViewItemsResult, someSegmentItemIndex) => {
                  const currentSegmentViewItem =
                    stewState.segmentDataset[someSegmentItemIndex];
                  if (
                    currentSegmentViewItem.__segment_item_search_space.includes(
                      currentViewSearchQuery
                    )
                  ) {
                    searchedAndSortedViewItemsResult.push(
                      currentSegmentViewItem
                    );
                  }
                  return searchedAndSortedViewItemsResult;
                },
                []
              )
              .sort(
                stewState.segmentModule.segmentSortOptions[
                  stewConfig.stewSegments[stewState.segmentKey]
                    .segmentSortOptions[stewState.segmentSortOptionKey]
                    .sortOptionIndex
                ].getSortOrder
              )
          : [],
    };
  }, [
    stewState.segmentKey,
    stewState.segmentStatus,
    stewState.segmentViewKey,
    stewState.viewSearchQuery,
    stewState.segmentSortOptionKey,
  ]);
  const { viewPageCount, viewPageItems } = useMemo(() => {
    const pageItemSize = 6;
    const viewPageCount =
      Math.ceil(searchedAndSortedViewItems.length / pageItemSize) || 1;
    const pageIndexStart = pageItemSize * stewState.viewPageIndex;
    const viewPageItems = searchedAndSortedViewItems.slice(
      pageIndexStart,
      pageIndexStart + pageItemSize
    );
    return {
      viewPageCount,
      viewPageItems,
    };
  }, [searchedAndSortedViewItems, stewState.viewPageIndex]);
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
                  stewState.segmentKey === someSegmentConfig.segmentKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (stewState.segmentKey !== someSegmentConfig.segmentKey) {
                  segmentSwitchCountRef.current += 1;
                  setStewState({
                    segmentStatus: "loadingSegment",
                    viewPageIndex: 0,
                    viewSearchQuery: "",
                    segmentKey: someSegmentConfig.segmentKey,
                    segmentViewKey: (
                      findMapItem({
                        itemTargetValue: 0,
                        itemSearchKey: "viewIndex",
                        someMap:
                          stewConfig.stewSegments[someSegmentConfig.segmentKey]
                            .segmentViews,
                      }) ??
                      throwInvalidPathError("nextStewState.segmentViewKey")
                    ).viewKey,
                    segmentSortOptionKey: (
                      findMapItem({
                        itemTargetValue: 0,
                        itemSearchKey: "sortOptionIndex",
                        someMap:
                          stewConfig.stewSegments[someSegmentConfig.segmentKey]
                            .segmentSortOptions,
                      }) ??
                      throwInvalidPathError(
                        "nextStewState.segmentSortOptionKey"
                      )
                    ).sortOptionKey,
                  });
                }
              }}
            >
              {someSegmentConfig.segmentLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(
          stewConfig.stewSegments[stewState.segmentKey].segmentViews
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
                  stewState.segmentViewKey === someViewConfig.viewKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (stewState.segmentViewKey !== someViewConfig.viewKey) {
                  setStewState((currentStewState) => ({
                    ...currentStewState,
                    viewPageIndex: 0,
                    segmentViewKey: someViewConfig.viewKey,
                  }));
                }
              }}
            >
              {someViewConfig.viewLabel}
            </div>
          ))}
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        {Object.values(
          stewConfig.stewSegments[stewState.segmentKey].segmentSortOptions
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
                  stewState.segmentSortOptionKey ===
                  someSortOptionConfig.sortOptionKey
                    ? "underline"
                    : "none",
              }}
              onClick={() => {
                if (
                  stewState.segmentSortOptionKey !==
                  someSortOptionConfig.sortOptionKey
                ) {
                  setStewState((currentStewState) => ({
                    ...currentStewState,
                    viewPageIndex: 0,
                    segmentSortOptionKey: someSortOptionConfig.sortOptionKey,
                  }));
                }
              }}
            >
              {someSortOptionConfig.sortOptionLabel}
            </div>
          ))}
      </div>
      <div style={{ padding: 8 }}>
        <input
          value={stewState.viewSearchQuery}
          onInput={(someInputEvent) => {
            const nextViewSearchQuery = someInputEvent.currentTarget.value;
            setStewState((currentStewState) => ({
              ...currentStewState,
              viewPageIndex: 0,
              viewSearchQuery: nextViewSearchQuery,
            }));
          }}
        />
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
            if (stewState.viewPageIndex > 0) {
              setStewState((currentStewState) => ({
                ...currentStewState,
                viewPageIndex: currentStewState.viewPageIndex - 1,
              }));
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
            if (stewState.viewPageIndex < viewPageCount - 1) {
              setStewState((currentStewState) => ({
                ...currentStewState,
                viewPageIndex: currentStewState.viewPageIndex + 1,
              }));
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
        >{`${stewState.viewPageIndex + 1} / ${viewPageCount}`}</div>
      </div>
      {stewState.segmentStatus === "segmentLoaded" ? (
        <Fragment>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 8,
              paddingTop: 12,
            }}
          >
            {viewPageItems.map((someViewItem) => (
              <div style={{ paddingBottom: 8 }}>
                <stewState.segmentModule.SegmentItemDisplay
                  someSegmentItem={someViewItem}
                />
              </div>
            ))}
          </div>
          <style>{stewState.segmentCss}</style>
        </Fragment>
      ) : null}
    </div>
  );
}

interface LoadSegmentApi extends Pick<StewAppProps, "stewResourceMap"> {
  correspondingSwitchCount: number;
  segmentSwitchCountRef: MutableRef<number>;
  stewState: StewState;
  setStewState: StateUpdater<StewState>;
}

async function loadSegment(api: LoadSegmentApi) {
  const {
    correspondingSwitchCount,
    segmentSwitchCountRef,
    stewResourceMap,
    stewState,
    setStewState,
  } = api;
  const [
    nextSegmentDataset,
    nextSegmentModule,
    nextSegmentViewsMap,
    nextSegmentCss,
  ] = await fetchSegmentComponents({
    stewResourceMap,
    someSegmentKey: stewState.segmentKey,
  });
  // guard against updating stewState with stale data
  if (correspondingSwitchCount === segmentSwitchCountRef.current) {
    setStewState((currentStewState) => ({
      ...currentStewState,
      segmentStatus: "segmentLoaded",
      segmentDataset: nextSegmentDataset as SegmentDataset<BuildSegmentItem>,
      segmentModule: nextSegmentModule as SegmentModule<BuildSegmentItem>,
      segmentViewsMap: nextSegmentViewsMap as SegmentViewsMap,
      segmentCss: nextSegmentCss,
    }));
  }
}
