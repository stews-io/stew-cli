import { StewConfig } from "../source/library/data/StewConfig.ts";

export default {
  stewInfo: {
    stewName: "hello-stew",
    stewStatus: "just stewin",
    stewDescription: "an assortment of awesome stuff",
    stewExternalLinks: [],
  },
  stewSegments: [
    {
      segmentModuleUrl: "./segments/music/index.tsx",
      segmentKey: "music",
      segmentSearchLabel: "music",
      segmentViews: [],
    },
    {
      segmentModuleUrl: "./segments/spots/index.tsx",
      segmentKey: "spots",
      segmentSearchLabel: "spots",
      segmentViews: [],
    },
  ],
} satisfies StewConfig;
