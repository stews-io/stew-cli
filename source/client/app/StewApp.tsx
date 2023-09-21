import { BuildStewConfig } from "../../../shared/types/StewConfig.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";
import { StewSegment } from "./StewSegment/StewSegment.tsx";
import { StewSegmentState } from "./StewSegment/StewSegmentState.ts";
import "../shared/styles/global.css";
import { Fragment } from "stewcli_preact/jsx-runtime";

export interface StewAppProps {
  stewConfig: BuildStewConfig;
  stewResourceMap: StewResourceMap;
  stewAppCss: string;
  initialSegmentViewState: StewSegmentState;
}

export function StewApp(props: StewAppProps) {
  const { stewAppCss, stewConfig, stewResourceMap, initialSegmentViewState } =
    props;
  return (
    <Fragment>
      <style>{stewAppCss}</style>
      <StewSegment
        stewConfig={stewConfig}
        stewResourceMap={stewResourceMap}
        initialSegmentViewState={initialSegmentViewState}
      />
    </Fragment>
  );
}
