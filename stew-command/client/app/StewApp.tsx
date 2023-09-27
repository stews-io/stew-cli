import "../styles/globalReset.scss";
import { Fragment } from "preact";
import { BuildStewConfig } from "stew/config";
import { StewResourceMap } from "stew/internal";
import { StewSegment } from "./StewSegment/StewSegment.tsx";
import { StewSegmentState } from "./StewSegment/types/StewSegmentState.ts";

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
