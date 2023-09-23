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
      // not necessary in a mechanical sense, but improves mutation visbility
      getUpdateSegmentComponents: ({ stewSegmentMutations }) =>
        stewSegmentMutations.updateSegmentComponents,
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
