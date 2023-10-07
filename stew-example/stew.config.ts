import { SourceStewConfig } from "stew/config/mod.ts";
import {
  getGithubIconSvg,
  getWebsiteIconSvg,
} from "stew/config/helpers/mod.ts";
import musicDataset from "./music/music.dataset.ts";
import spotsDataset from "./spots/spots.dataset.ts";

export default getHelloStewConfig();

function getHelloStewConfig(): SourceStewConfig {
  return {
    stewInfo: {
      stewName: "hello-stew",
      stewTagline: "just stewin",
      stewMessage: "an assortment of awesome stuff",
      stewExternalLinks: [
        {
          linkLabel: "website",
          linkHref: "https://clumsycomputer.com",
          linkIconSvg: getWebsiteIconSvg(),
        },
        {
          linkLabel: "github",
          linkHref: "https://github.com/stews-io",
          linkIconSvg: getGithubIconSvg(),
        },
      ],
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
  };
}
