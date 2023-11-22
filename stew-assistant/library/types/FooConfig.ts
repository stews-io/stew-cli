const exampleConfig = fooConfig([
  sectionConfig({
    SectionDisplay: AaaDisplay,
    sectionKey: "aaa",
    aaaThing: "asdf",
  }),
  sectionConfig({
    SectionDisplay: BbbDisplay,
    sectionKey: "bbb",
    bbbThing: 2,
  }),
  {
    // SectionDisplay: BbbDisplay,
    // sectionKey: "bbb",
    bbbThing: 2,
  },
]);

function AaaDisplay(api: AaaDisplayApi) {}

interface AaaDisplayApi extends SectionDisplayApi<AaaSectionDataConfig> {}

interface AaaSectionDataConfig extends SectionDataConfig<"aaa"> {
  aaaThing: string;
}

function BbbDisplay(api: BbbDisplayApi) {}

interface BbbDisplayApi extends SectionDisplayApi<BbbSectionDataConfig> {}

interface BbbSectionDataConfig extends SectionDataConfig<"bbb"> {
  bbbThing: number;
}

function fooConfig<ThisFooConfig extends [any, ...Array<any>]>(
  thisFooConfig: ThisFooConfig
) {
  return thisFooConfig;
}

function sectionConfig<ThisSectionDataConfig extends SectionDataConfig<string>>(
  thisSectionConfig: SectionConfig<ThisSectionDataConfig>
) {
  return thisSectionConfig;
}

type SectionConfig<ThisSectionDataConfig extends SectionDataConfig<any>> =
  ThisSectionDataConfig & {
    SectionDisplay: (api: SectionDisplayApi<ThisSectionDataConfig>) => void;
  };

interface SectionDisplayApi<ThisSectionDataConfig> {
  sectionConfig: ThisSectionDataConfig;
}

interface SectionDataConfig<SectionKey> {
  sectionKey: SectionKey;
}
