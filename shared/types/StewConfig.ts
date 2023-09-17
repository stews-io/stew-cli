import { Zod } from "../deps/zod/mod.ts";
import { SegmentItem } from "./SegmentDataset.ts";
import { SegmentSortOption } from "./SegmentModule.ts";
import { ArrayOfAtLeastOne, ArrayOfOneSchema } from "./general.ts";

export interface SourceStewConfig
  extends StewConfigBase<ArrayOfAtLeastOne<SourceSegmentConfig>> {}

export function SourceStewConfigSchema(): Zod.ZodType<SourceStewConfig> {
  return StewConfigBaseSchema(ArrayOfOneSchema(SourceSegmentConfigSchema()));
}

export interface SourceSegmentConfig
  extends SegmentConfigBase<ArrayOfAtLeastOne<SourceSegmentViewConfig>> {
  segmentModulePath: string;
  segmentDatasetPath: string;
}

function SourceSegmentConfigSchema(): Zod.ZodType<SourceSegmentConfig> {
  return SegmentConfigBaseSchema(
    ArrayOfOneSchema(SourceSegmentViewConfigSchema())
  ).extend({
    segmentModulePath: Zod.string(),
    segmentDatasetPath: Zod.string(),
  });
}

export interface SourceSegmentViewConfig extends SegmentViewConfigBase {
  viewItemIds: Array<SegmentItem["itemId"]>;
}

function SourceSegmentViewConfigSchema(): Zod.ZodType<SourceSegmentViewConfig> {
  return SegmentViewConfigBaseSchema().extend({
    viewItemIds: Zod.array(Zod.number()),
  });
}

export interface BuildStewConfig
  extends StewConfigBase<Record<string, BuildSegmentConfig>> {
  stewBuildId: string;
}

export function BuildStewConfigSchema(): Zod.ZodType<BuildStewConfig> {
  return StewConfigBaseSchema(Zod.record(BuildSegmentConfigSchema())).extend({
    stewBuildId: Zod.string(),
  });
}

interface BuildSegmentConfig
  extends SegmentConfigBase<Record<string, BuildSegmentViewConfig>> {
  segmentIndex: number;
  segmentSortOptions: Array<BuildSortOptionConfig>;
}

function BuildSegmentConfigSchema(): Zod.ZodType<BuildSegmentConfig> {
  return SegmentConfigBaseSchema(
    Zod.record(BuildSegmentViewConfigSchema())
  ).extend({
    segmentIndex: Zod.number(),
    segmentSortOptions: Zod.array(
      Zod.object({
        sortOptionKey: Zod.string(),
        sortOptionLabel: Zod.string(),
      })
    ),
  });
}

interface BuildSortOptionConfig
  extends Pick<
    SegmentSortOption<SegmentItem>,
    "sortOptionKey" | "sortOptionLabel"
  > {}

interface BuildSegmentViewConfig extends SegmentViewConfigBase {
  viewIndex: number;
}

function BuildSegmentViewConfigSchema(): Zod.ZodType<BuildSegmentViewConfig> {
  return SegmentViewConfigBaseSchema().extend({
    viewIndex: Zod.number(),
  });
}

interface StewConfigBase<StewSegments> {
  stewInfo: StewInfo;
  stewSegments: StewSegments;
}

function StewConfigBaseSchema<SegmentsConfigSchema extends Zod.ZodTypeAny>(
  someSegmentsConfigSchema: SegmentsConfigSchema
) {
  return Zod.object({
    stewInfo: StewInfoSchema(),
    stewSegments: someSegmentsConfigSchema,
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

interface SegmentConfigBase<SegmentViewsConfig> {
  segmentKey: string;
  segmentSearchLabel: string;
  segmentViews: SegmentViewsConfig;
}

function SegmentConfigBaseSchema<
  SegmentViewsConfigSchema extends Zod.ZodTypeAny
>(someSegmentViewsSchema: SegmentViewsConfigSchema) {
  return Zod.object({
    segmentKey: Zod.string(),
    segmentSearchLabel: Zod.string(),
    segmentViews: someSegmentViewsSchema,
  });
}

interface SegmentViewConfigBase {
  viewKey: string;
  viewLabel: string;
}

function SegmentViewConfigBaseSchema() {
  return Zod.object({
    viewKey: Zod.string(),
    viewLabel: Zod.string(),
  });
}