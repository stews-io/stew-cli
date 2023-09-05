import * as Zod from "deno/x/zod/mod.ts";

export interface StewConfig {
  stewInfo: StewInfo;
  stewSegments: Array<StewSegment>;
}

export interface StewInfo {
  stewName: string;
  stewStatus: string;
  stewDescription: string;
  stewExternalLinks: Array<StewExternalLink>;
}

export interface StewExternalLink {
  linkLabel: string;
  linkHref: string;
}

export interface StewSegment {
  segmentKey: string;
  segmentSearchLabel: string;
  segmentModuleUrl: string;
  segmentViews: Array<StewSegmentView>;
}

export interface StewSegmentView {
  viewKey: string;
  viewLabel: string;
  viewFilter: string;
}

export const StewExternalLinkSchema = Zod.object({
  linkLabel: Zod.string(),
  linkHref: Zod.string(),
});

export const StewInfoConfigSchema = Zod.object({
  stewName: Zod.string(),
  stewStatus: Zod.string(),
  stewDescription: Zod.string(),
  stewExternalLinks: Zod.array(StewExternalLinkSchema),
});

export const StewSegmentViewSchema = Zod.object({
  viewKey: Zod.string(),
  viewLabel: Zod.string(),
  viewFilter: Zod.string(),
});

export const StewSegmentSchema = Zod.object({
  segmentKey: Zod.string(),
  segmentSearchLabel: Zod.string(),
  segmentModuleUrl: Zod.string(),
  segmentViews: Zod.array(StewSegmentViewSchema),
});

export const StewConfigSchema = Zod.object({
  stewInfo: StewInfoConfigSchema,
  stewSegments: Zod.array(StewSegmentSchema),
});
