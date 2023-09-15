import { Zod } from "../deps/zod/mod.ts";
import { SegmentItem } from "./SegmentDataset.ts";
import { SegmentSortOption } from "./SegmentModule.ts";

export interface SourceStewConfig extends StewConfigBase<SourceSegmentConfig> {}

export function SourceStewConfigSchema(): Zod.ZodType<SourceStewConfig> {
  return StewConfigBaseSchema(
    SegmentConfigBaseSchema().extend({
      segmentModulePath: Zod.string(),
      segmentDatasetPath: Zod.string(),
    })
  );
}

export interface SourceSegmentConfig extends SegmentConfigBase {
  segmentModulePath: string;
  segmentDatasetPath: string;
}

export interface BuildStewConfig extends StewConfigBase<BuildSegmentConfig> {
  stewBuildId: string;
}

export function BuildStewConfigSchema(): Zod.ZodType<BuildStewConfig> {
  return StewConfigBaseSchema(
    SegmentConfigBaseSchema().extend({
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

interface BuildSegmentConfig extends SegmentConfigBase {
  segmentSortOptions: Array<BuildSortOptionConfig>;
}

interface BuildSortOptionConfig
  extends Pick<
    SegmentSortOption<SegmentItem>,
    "sortOptionKey" | "sortOptionLabel"
  > {}

interface StewConfigBase<StegSegment extends SegmentConfigBase> {
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
  stewTagline: string;
  stewMessage: string;
  stewExternalLinks: Array<StewExternalLink>;
}

function StewInfoSchema() {
  return Zod.object({
    stewName: Zod.string(),
    stewTagline: Zod.string(),
    stewMessage: Zod.string(),
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

interface SegmentConfigBase {
  segmentKey: string;
  segmentSearchLabel: string;
  segmentViews: Array<SegmentViewConfig>;
}

function SegmentConfigBaseSchema() {
  return Zod.object({
    segmentKey: Zod.string(),
    segmentSearchLabel: Zod.string(),
    segmentViews: Zod.array(SegmentViewConfigSchema()),
  });
}

interface SegmentViewConfig {
  viewKey: string;
  viewLabel: string;
  viewItemIds: Array<number>;
}

function SegmentViewConfigSchema() {
  return Zod.object({
    viewKey: Zod.string(),
    viewLabel: Zod.string(),
    viewItemIds: Zod.array(Zod.number().int()),
  });
}
