import { useEffect, useState } from "npm/preact/hooks";
import { BuildStewConfig } from "../../shared/types/StewConfig.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
}

export function StewApp(props: StewAppProps) {
  const { stewConfig } = props;
  const [segmentKeyState, setSegmentKeyState] = useState(
    stewConfig.stewSegments[0].segmentKey
  );
  const [segmentModuleState, setSegmentModuleState] = useState<any>({
    fetchStatus: "loading",
  });
  useEffect(() => {
    fetch(`/public/modules/${segmentKeyState}.js`)
      .then((getModuleIifeScript) => getModuleIifeScript.text())
      .then((someModuleIifeScript) => {
        setSegmentModuleState({
          fetchStatus: "success",
          segmentModule: new Function(
            `${someModuleIifeScript}return segmentModuleResult.default`
          )(),
        });
      });
  }, [segmentKeyState]);
  const [segmentDatasetState, setSegmentDatasetState] = useState<any>({
    fetchStatus: "loading",
  });
  useEffect(() => {
    fetch(`/public/datasets/${segmentKeyState}.json`)
      .then((getDatasetJson) => getDatasetJson.json())
      .then((someDatasetJson) => {
        setSegmentDatasetState({
          fetchStatus: "success",
          segmentDataset: someDatasetJson,
        });
      });
  }, [segmentKeyState]);
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
              setSegmentKeyState(someSegmentConfig.segmentKey);
            }}
          >
            {someSegmentConfig.segmentKey}
          </div>
        ))}
      </div>
      <div style={{ padding: 8, fontWeight: 300 }}>{segmentKeyState}</div>
      <div>
        {segmentDatasetState.fetchStatus === "success" &&
        segmentModuleState.fetchStatus === "success" ? (
          <segmentModuleState.segmentModule.SegmentItemDisplay
            someSegmentItem={segmentDatasetState.segmentDataset[0]}
          />
        ) : null}
      </div>
    </div>
  );
}
