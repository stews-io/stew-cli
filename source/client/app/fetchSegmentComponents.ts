import {
  SegmentDataset,
  SegmentItem,
} from "../../../shared/types/SegmentDataset.ts";
import { SegmentModule } from "../../../shared/types/SegmentModule.ts";
import { StewResourceMap } from "../../shared/types/StewResourceMap.ts";

export interface FetchSegmentComponentsApi {
  stewResourceMap: StewResourceMap;
  someSegmentKey: string;
}

export function fetchSegmentComponents(
  api: FetchSegmentComponentsApi
): Promise<
  [
    segmentDataset: SegmentDataset<SegmentItem>,
    segmentModule: SegmentModule<SegmentItem>,
    segmentCss: string
  ]
> {
  const { stewResourceMap, someSegmentKey } = api;
  return Promise.all([
    fetch(
      `${stewResourceMap.datasetsDirectoryPath}/${someSegmentKey}.json`
    ).then((getSegmentDataset) => getSegmentDataset.json()),
    fetch(`${stewResourceMap.modulesDirectoryPath}/${someSegmentKey}.js`)
      .then((getSegmentModuleScript) => getSegmentModuleScript.text())
      .then((nextSegmentModuleScript) =>
        new Function(
          `${nextSegmentModuleScript}return __moduleIifeResult.default`
        )()
      ),
    fetch(`${stewResourceMap.stylesDirectoryPath}/${someSegmentKey}.css`).then(
      (getSegmentCss) => getSegmentCss.text()
    ),
  ]);
}
