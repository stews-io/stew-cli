import { SourceStewConfig } from "../source/shared/types/StewConfig.ts";

export default {
  stewInfo: {
    stewName: "hello-stew",
    stewTagline: "just stewin",
    stewMessage: "an assortment of awesome stuff",
    stewExternalLinks: [],
  },
  stewSegments: [
    {
      segmentModulePath: "./music/music.module.tsx",
      segmentDatasetPath: "./music/music.dataset.ts",
      segmentKey: "music",
      segmentSearchLabel: "music",
      segmentViews: [],
    },
    {
      segmentModulePath: "./spots/spots.module.tsx",
      segmentDatasetPath: "./spots/spots.dataset.ts",
      segmentKey: "spots",
      segmentSearchLabel: "spots",
      segmentViews: [],
    },
  ],
} satisfies SourceStewConfig;
