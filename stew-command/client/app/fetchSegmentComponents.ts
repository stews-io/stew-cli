import {
  BuildSegmentItem,
  SegmentDataset,
  SegmentModule,
  SegmentViewsMap,
} from "stew/config";
import { StewResourceMap } from "stew/internal";

export interface FetchSegmentComponentsApi {
  stewResourceMap: StewResourceMap;
  someSegmentKey: string;
}

export type FetchSegmentComponentsResult = [
  segmentDataset: SegmentDataset<BuildSegmentItem>,
  segmentModule: SegmentModule<BuildSegmentItem>,
  segmentViews: SegmentViewsMap,
  segmentCss: string
];

export function fetchSegmentComponents(
  api: FetchSegmentComponentsApi
): Promise<FetchSegmentComponentsResult> {
  const { stewResourceMap, someSegmentKey } = api;
  return Promise.all([
    fetch(
      `${stewResourceMap.datasetsDirectoryPath}/${someSegmentKey}.json`
    ).then((getSegmentDataset) => getSegmentDataset.json()),
    fetch(`${stewResourceMap.modulesDirectoryPath}/${someSegmentKey}.js`)
      .then((getSegmentModuleScript) => getSegmentModuleScript.text())
      .then((nextSegmentModuleScript) =>
        new Function(
          `${nextSegmentModuleScript}return __segmentModuleResult.default`
        )()
      ),
    fetch(`${stewResourceMap.viewsDirectoryPath}/${someSegmentKey}.json`).then(
      (getSegmentViews) => getSegmentViews.json()
    ),
    fetch(`${stewResourceMap.stylesDirectoryPath}/${someSegmentKey}.css`).then(
      (getSegmentCss) => getSegmentCss.text()
    ),
  ]);
}
