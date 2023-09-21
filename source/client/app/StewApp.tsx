import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";
import { StewSegment } from "./StewSegment/StewSegment.tsx";
import { StewSegmentState } from "./StewSegment/StewSegmentState.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialSegmentViewState: StewSegmentState;
}

export function StewApp(props: StewAppProps) {
  const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
  return (
    <StewSegment
      stewConfig={stewConfig}
      stewResourceMap={stewResourceMap}
      initialSegmentViewState={initialSegmentViewState}
    />
  );
}
