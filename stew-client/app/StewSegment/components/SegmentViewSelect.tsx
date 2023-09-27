import { ComponentProps, Fragment } from "preact";
import { useMemo } from "preact/hooks";
import {
  CustomAnchorButtonProps,
  SelectBase,
  SelectBaseConfigProps,
  SelectMenuBase,
} from "../../../../stew-library/components/mod.ts";
import { BuildStewConfig } from "../../../../stew-library/config/mod.ts";
import { SegmentPageProps } from "./SegmentPage.tsx";
// @deno-types="CssModule"
import cssModule from "./SegmentViewSelect.module.scss";

export interface SegmentViewSelectProps
  extends Pick<
    SegmentPageProps,
    "stewConfig" | "stewSegmentState" | "selectSegmentView"
  > {}

export function SegmentViewSelect(props: SegmentViewSelectProps) {
  const { stewConfig, stewSegmentState, selectSegmentView } = props;
  const __staticObjectProp = useMemo(() => ({}), []);
  const { activeSegmentConfig, selectedViewOption, activeSegmentViewOptions } =
    useMemo(() => {
      const activeSegmentConfigResult =
        stewConfig.stewSegments[stewSegmentState.segmentKey];
      return {
        activeSegmentConfig: activeSegmentConfigResult,
        selectedViewOption:
          activeSegmentConfigResult.segmentViews[
            stewSegmentState.segmentViewKey
          ],
        activeSegmentViewOptions: Object.values(
          activeSegmentConfigResult.segmentViews
        ).sort((optionA, optionB) => optionA.viewIndex - optionB.viewIndex),
      };
    }, [stewConfig, stewSegmentState]);
  return (
    <Fragment>
      <h2
        style={{ display: "none" }}
      >{`${activeSegmentConfig.segmentLabel} view: ${selectedViewOption.viewLabel}`}</h2>
      <SelectBase
        anchorBorderClassName={cssModule.viewSelectAnchorBorder}
        fontSizeClassName={cssModule.viewSelectFontSize}
        optionTypeLabel={"view"}
        optionLabelKey={"viewLabel"}
        popoverAriaRole={"listbox"}
        anchorAriaLabel={`select ${activeSegmentConfig.segmentLabel} view`}
        anchorAriaDescription={`${activeSegmentConfig.segmentLabel} view`}
        SelectMenu={SegmentViewSelectMenu}
        customOptionActionItemProps={__staticObjectProp}
        customMenuFooterProps={__staticObjectProp}
        customSelectAnchorButtonProps={__staticObjectProp}
        optionList={activeSegmentViewOptions}
        selectedOption={selectedViewOption}
        selectOption={(nextSegmentViewOption) => {
          selectSegmentView(nextSegmentViewOption.viewKey);
        }}
      />
    </Fragment>
  );
}

interface SegmentViewSelectMenuProps
  extends ComponentProps<
    SelectBaseConfigProps<
      BuildStewConfig["stewSegments"][string]["segmentViews"][string],
      "viewLabel",
      Omit<CustomAnchorButtonProps, keyof CustomAnchorButtonProps>,
      Record<string, unknown>,
      Record<string, unknown>
    >["SelectMenu"]
  > {}

function SegmentViewSelectMenu(props: SegmentViewSelectMenuProps) {
  return (
    <SelectMenuBase
      OptionActionItem={EmptyOptionActionItem}
      MenuFooter={EmptyMenuFooter}
      {...props}
    />
  );
}

function EmptyOptionActionItem() {
  return null;
}

function EmptyMenuFooter() {
  return null;
}
