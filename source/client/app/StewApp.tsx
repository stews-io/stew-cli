import { Fragment } from "../../deps/preact/mod.ts";
import { StateUpdater, useEffect, useState } from "../../deps/preact/hooks.ts";
import {
  SegmentDataset,
  SegmentItem,
} from "../../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../../shared/types/SegmentModule.ts";
import { BuildStewConfig } from "../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
}

export function StewApp(props: StewAppProps) {
  const { stewConfig, stewResourceMap } = props;
  const [segmentState, setSegmentState] = useState<SegmentState>({
    loadingStatus: "loading",
    segmentKey: stewConfig.stewSegments[0].segmentKey,
  });
  useEffect(() => {
    loadSegment({
      stewResourceMap,
      segmentState,
      setSegmentState,
    });
  }, [segmentState.segmentKey]);
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
              setSegmentState({
                loadingStatus: "loading",
                segmentKey: someSegmentConfig.segmentKey,
              });
            }}
          >
            {someSegmentConfig.segmentKey}
          </div>
        ))}
      </div>
      <div style={{ padding: 8, fontWeight: 300 }}>
        {segmentState.segmentKey}
      </div>
      {segmentState.loadingStatus === "success" ? (
        <Fragment>
          <segmentState.segmentModule.SegmentItemDisplay
            someSegmentItem={segmentState.segmentDataset[0]}
          />
          <style>{segmentState.segmentCss}</style>
        </Fragment>
      ) : null}
    </div>
  );
}

type SegmentState =
  | SuccessSegmentState
  | LoadingSegmentState
  | ErrorSegmentState;

interface SuccessSegmentState extends SegmentStateBase<"success"> {
  segmentDataset: SegmentDataset<SegmentItem>;
  segmentModule: SegmentModule<SegmentItem>;
  segmentCss: string;
}

interface LoadingSegmentState extends SegmentStateBase<"loading"> {}

interface ErrorSegmentState extends SegmentStateBase<"error"> {}

interface SegmentStateBase<LoadingStatus extends string> {
  loadingStatus: LoadingStatus;
  segmentKey: string;
}

interface LoadSegmentApi extends Pick<StewAppProps, "stewResourceMap"> {
  segmentState: SegmentState;
  setSegmentState: StateUpdater<SegmentState>;
}

async function loadSegment(api: LoadSegmentApi) {
  const { stewResourceMap, segmentState, setSegmentState } = api;
  const [nextSegmentDataset, nextSegmentModule, nextSegmentCss] =
    await Promise.all([
      fetch(
        `${stewResourceMap.datasetsDirectoryPath}/${segmentState.segmentKey}.json`
      ).then((getSegmentDataset) => getSegmentDataset.json()),
      fetch(
        `${stewResourceMap.modulesDirectoryPath}/${segmentState.segmentKey}.js`
      )
        .then((getSegmentModuleScript) => getSegmentModuleScript.text())
        .then((nextSegmentModuleScript) =>
          new Function(
            `${nextSegmentModuleScript}return segmentModuleResult.default`
          )()
        ),
      fetch(
        `${stewResourceMap.stylesDirectoryPath}/${segmentState.segmentKey}.css`
      ).then((getSegmentCss) => getSegmentCss.text()),
    ]);
  setSegmentState({
    loadingStatus: "success",
    segmentKey: segmentState.segmentKey,
    segmentDataset: nextSegmentDataset as SegmentDataset<SegmentItem>,
    segmentModule: nextSegmentModule as SegmentModule<SegmentItem>,
    segmentCss: nextSegmentCss,
  });
}
