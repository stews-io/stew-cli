import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";
import { SegmentView } from "./SegmentView/SegmentView.tsx";
import { SegmentViewState } from "./SegmentView/SegmentViewState.ts";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  initialSegmentViewState: SegmentViewState;
}

export function StewApp(props: StewAppProps) {
  const { stewConfig, stewResourceMap, initialSegmentViewState } = props;
  return (
    <SegmentView
      stewConfig={stewConfig}
      stewResourceMap={stewResourceMap}
      initialSegmentViewState={initialSegmentViewState}
    />
  );
}
