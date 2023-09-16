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

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialStewState: StewState;
}

export function StewApp(props: StewAppProps) {
  const { initialStewState, stewConfig, stewResourceMap } = props;
  const [stewState, setStewState] = useState<StewState>(initialStewState);
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
        {stewConfig.stewSegments.map((someSegmentConfig) => (
          <div
            style={{
              padding: 8,
              color: "purple",
              cursor: "pointer",
              fontWeight: 700,
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
      <div style={{ padding: 8, fontWeight: 300 }}>{stewState.segmentKey}</div>
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
  const [nextSegmentDataset, nextSegmentModule, nextSegmentCss] =
    await fetchSegmentComponents({
      stewResourceMap,
      someSegmentKey: stewState.segmentKey,
    });
  setStewState({
    ...stewState,
    segmentStatus: "segmentLoaded",
    segmentDataset: nextSegmentDataset as SegmentDataset<SegmentItem>,
    segmentModule: nextSegmentModule as SegmentModule<SegmentItem>,
    segmentCss: nextSegmentCss,
  });
}
