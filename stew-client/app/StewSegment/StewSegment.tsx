import { StewAppProps } from "../StewApp.tsx";
import { SegmentPage } from "./components/SegmentPage.tsx";
import { useStewSegment } from "./hooks/useStewSegment.ts";

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
      routeUpdateSegmentComponentsMutation: ({ stewSegmentMutations }) =>
        stewSegmentMutations.updateSegmentComponents,
      routeGotoViewPageMutations: ({ stewSegmentMutations }) => ({
        gotoPreviousViewPage: stewSegmentMutations.gotoPreviousViewPage,
        gotoNextViewPage: stewSegmentMutations.gotoNextViewPage,
      }),
    });
  return (
    <SegmentPage
      stewConfig={stewConfig}
      stewSegmentState={stewSegmentState}
      stewSegmentData={stewSegmentData}
      selectStewSegment={stewSegmentMutations.selectStewSegment}
      selectSegmentView={stewSegmentMutations.selectSegmentView}
      selectSegmentSortOption={stewSegmentMutations.selectSegmentSortOption}
      updateSegmentViewSearch={stewSegmentMutations.updateSegmentViewSearch}
      clearSegmentViewSearch={stewSegmentMutations.clearSegmentViewSearch}
    />
  );
}
