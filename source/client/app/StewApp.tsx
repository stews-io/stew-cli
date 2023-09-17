import { Fragment } from "../../../shared/deps/preact/mod.ts";
import {
  useState,
  useEffect,
  StateUpdater,
} from "../../../shared/deps/preact/hooks.ts";
import {
  SegmentDataset,
  SegmentItem,
} from "../../../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../../../shared/types/SegmentModule.ts";
import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";
import { fetchSegmentComponents } from "./fetchSegmentComponents.ts";
import { StewState } from "./StewState.ts";
import { SegmentViewsMap } from "../../../shared/types/SegmentViewsMap.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialStewState: StewState;
}

export function StewApp(props: StewAppProps) {
  const { initialStewState, stewConfig, stewResourceMap } = props;
  const [stewState, setStewState] = useState<StewState>(initialStewState);
  useEffect(() => {
    const nextUrlSearchParams = new URLSearchParams();
    nextUrlSearchParams.set("sort", `${stewState.segmentSortKey}`);
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
  }, [stewState]);
  useEffect(() => {
    if (stewState.segmentStatus === "loadingSegment") {
      loadSegment({
        stewResourceMap,
        stewState,
        setStewState,
      });
    }
  }, [stewState.segmentKey]);
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
                setStewState({
                  ...stewState,
                  segmentStatus: "loadingSegment",
                  segmentKey: someSegmentConfig.segmentKey,
                });
              }}
            >
              {someSegmentConfig.segmentKey}
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
                setStewState({
                  ...stewState,
                  segmentViewKey: someViewConfig.viewKey,
                });
              }}
            >
              {someViewConfig.viewKey}
            </div>
          ))}
      </div>
      {stewState.segmentStatus === "segmentLoaded" ? (
        <Fragment>
          <stewState.segmentModule.SegmentItemDisplay
            someSegmentItem={stewState.segmentDataset[0]}
          />
          <style>{stewState.segmentCss}</style>
        </Fragment>
      ) : null}
    </div>
  );
}

interface LoadSegmentApi extends Pick<StewAppProps, "stewResourceMap"> {
  stewState: StewState;
  setStewState: StateUpdater<StewState>;
}

async function loadSegment(api: LoadSegmentApi) {
  const { stewResourceMap, stewState, setStewState } = api;
  const [
    nextSegmentDataset,
    nextSegmentModule,
    nextSegmentViewsMap,
    nextSegmentCss,
  ] = await fetchSegmentComponents({
    stewResourceMap,
    someSegmentKey: stewState.segmentKey,
  });
  setStewState({
    ...stewState,
    segmentStatus: "segmentLoaded",
    segmentDataset: nextSegmentDataset as SegmentDataset<SegmentItem>,
    segmentModule: nextSegmentModule as SegmentModule<SegmentItem>,
    segmentViewsMap: nextSegmentViewsMap as SegmentViewsMap,
    segmentCss: nextSegmentCss,
  });
}
