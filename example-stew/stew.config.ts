import { SourceStewConfig } from "../shared/types/StewConfig.ts";
import musicDataset from "./music/music.dataset.ts";
import spotsDataset from "./spots/spots.dataset.ts";

export default getHelloStewConfig();

async function getHelloStewConfig() {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 500);
  });
  return {
    stewInfo: {
      stewName: "hello-stew",
      stewTagline: "just stewin",
      stewMessage: "an assortment of awesome stuff",
      stewExternalLinks: [],
    },
    stewSegments: [
      {
        segmentDataset: musicDataset,
        segmentModulePath: "./music/music.module.tsx",
        segmentKey: "music",
        segmentLabel: "music",
        segmentViews: [
          {
            viewKey: "all",
            viewLabel: "all",
            viewItemIds: musicDataset.map(
              (someMusicItem) => someMusicItem.itemId
            ),
          },
        ],
      },
      {
        segmentDataset: spotsDataset,
        segmentModulePath: "./spots/spots.module.tsx",
        segmentKey: "spots",
        segmentLabel: "spots",
        segmentViews: [
          {
            viewKey: "all",
            viewLabel: "all",
            viewItemIds: spotsDataset.map(
              (someSpotItem) => someSpotItem.itemId
            ),
          },
        ],
      },
    ],
  } satisfies SourceStewConfig;
}
