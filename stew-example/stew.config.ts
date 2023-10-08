import { SourceStewConfig } from "stew/config/mod.ts";
import {
  getGithubIconSvg,
  getWebsiteIconSvg,
} from "stew/config/helpers/mod.ts";
import { musicDataset } from "./music/music.dataset.ts";
import { linksDataset } from "./links/links.dataset.ts";

export default getStewExampleConfig();

function getStewExampleConfig(): SourceStewConfig {
  return {
    stewInfo: {
      stewName: "stew-example",
      stewTagline: "just stewin",
      stewMessage: "a brief example showing off the things",
      stewLinks: [
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
        segmentDataset: linksDataset,
        segmentModulePath: "./links/links.module.ts",
        segmentKey: "links",
        segmentLabel: "links",
        segmentViews: [
          {
            viewKey: "all",
            viewLabel: "all",
            viewItemIds: linksDataset.map(
              (someLinkItem) => someLinkItem.itemId
            ),
          },
        ],
      },
    ],
  };
}
