import * as Zod from "deno/x/zod/mod.ts";
import { SegmentItem, SegmentSortOption } from "./StewSegmentModule.ts";

export interface SourceStewConfig
  extends StewConfigBase<SourceStewSegmentConfig> {}

export function SourceStewConfigSchema(): Zod.ZodType<SourceStewConfig> {
  return StewConfigBaseSchema(
    StewSegmentConfigBaseSchema().extend({
      segmentModuleUrl: Zod.string(),
    })
  );
}

interface SourceStewSegmentConfig extends StewSegmentConfigBase {
  segmentModuleUrl: string;
}

export interface BuildStewConfig
  extends StewConfigBase<BuildStewSegmentConfig> {
  stewBuildId: string;
}

export function BuildStewConfigSchema(): Zod.ZodType<BuildStewConfig> {
  return StewConfigBaseSchema(
    StewSegmentConfigBaseSchema().extend({
      segmentSortOptions: Zod.array(
        Zod.object({
          sortOptionKey: Zod.string(),
          sortOptionLabel: Zod.string(),
        })
      ),
    })
  ).extend({
    stewBuildId: Zod.string(),
  });
}

interface BuildStewSegmentConfig extends StewSegmentConfigBase {
  segmentSortOptions: Array<BuildStewSegmentSortOptionConfig>;
}

interface BuildStewSegmentSortOptionConfig
  extends Pick<
    SegmentSortOption<SegmentItem>,
    "sortOptionKey" | "sortOptionLabel"
  > {}

interface StewConfigBase<StegSegment extends StewSegmentConfigBase> {
  stewInfo: StewInfo;
  stewSegments: Array<StegSegment>;
}

function StewConfigBaseSchema<SegmentConfigSchema extends Zod.ZodTypeAny>(
  someSegmentConfigSchema: SegmentConfigSchema
) {
  return Zod.object({
    stewInfo: StewInfoSchema(),
    stewSegments: Zod.array(someSegmentConfigSchema),
  });
}

interface StewInfo {
  stewName: string;
  stewStatus: string;
  stewDescription: string;
  stewExternalLinks: Array<StewExternalLink>;
}

function StewInfoSchema() {
  return Zod.object({
    stewName: Zod.string(),
    stewStatus: Zod.string(),
    stewDescription: Zod.string(),
    stewExternalLinks: Zod.array(StewExternalLinkSchema()),
  });
}

interface StewExternalLink {
  linkLabel: string;
  linkHref: string;
}

function StewExternalLinkSchema() {
  return Zod.object({
    linkLabel: Zod.string(),
    linkHref: Zod.string(),
  });
}

interface StewSegmentConfigBase {
  segmentKey: string;
  segmentSearchLabel: string;
  segmentViews: Array<StewSegmentViewConfig>;
}

function StewSegmentConfigBaseSchema() {
  return Zod.object({
    segmentKey: Zod.string(),
    segmentSearchLabel: Zod.string(),
    segmentViews: Zod.array(StewSegmentViewConfigSchema()),
  });
}

interface StewSegmentViewConfig {
  viewKey: string;
  viewLabel: string;
  viewItemIds: Array<number>;
}

function StewSegmentViewConfigSchema() {
  return Zod.object({
    viewKey: Zod.string(),
    viewLabel: Zod.string(),
    viewItemIds: Zod.array(Zod.number().int()),
  });
}
