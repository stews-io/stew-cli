import { SourceStewConfig } from "../source/shared/data/StewConfig.ts";

export default {
  stewInfo: {
    stewName: "hello-stew",
    stewStatus: "just stewin",
    stewDescription: "an assortment of awesome stuff",
    stewExternalLinks: [],
  },
  stewSegments: [
    {
      segmentModulePath: "./segments/music/music.module.tsx",
      segmentDatasetPath: "./segments/music/music.dataset.ts",
      segmentKey: "music",
      segmentSearchLabel: "music",
      segmentViews: [],
    },
    {
      segmentModulePath: "./segments/spots/spots.module.tsx",
      segmentDatasetPath: "./segments/spots/spots.dataset.ts",
      segmentKey: "spots",
      segmentSearchLabel: "spots",
      segmentViews: [],
    },
  ],
} satisfies SourceStewConfig;
