import { useMemo } from "../../../../stew-library/deps/preact/hooks.ts";
import {
  AnchorButton,
  Bopper,
  Button,
  CoreAnchorButtonProps,
  CorePopoverContentProps,
  LinkButton,
} from "../../../../stew-library/components/mod.ts";
import {
  getCssClass,
  throwInvalidPathError,
} from "../../../../stew-library/utilities/mod.ts";
import { SegmentPageProps } from "./SegmentPage.tsx";
// @deno-types="CssModule"
import cssModule from "./StewInfoBopper.module.scss";

interface StewInfoBopperProps
  extends Pick<
    SegmentPageProps,
    "stewConfig" | "stewSegmentState" | "selectStewSegment"
  > {}

export function StewInfoBopper(props: StewInfoBopperProps) {
  const { stewConfig, stewSegmentState, selectStewSegment } = props;
  return (
    <Bopper
      popoverAriaRole={"dialog"}
      anchorAriaLabel={
        "show info and segment navigation controls for this stew"
      }
      anchorAriaDescription={
        "a button that displays a popover with info and segment navigation controls for this stew"
      }
      SomeAnchorButton={StewInfoAnchorButton}
      PopoverContent={StewInfoPopoverContent}
      customSomeAnchorButtonProps={null}
      getPopoverLayoutTop={({ anchorElement }) => anchorElement.offsetTop - 2}
      customPopoverContentProps={{
        stewConfig,
        stewSegmentState,
        selectStewSegment,
      }}
    />
  );
}

interface StewInfoAnchorButtonProps extends CoreAnchorButtonProps {}

function StewInfoAnchorButton(props: StewInfoAnchorButtonProps) {
  const {
    ariaLabel,
    ariaDescription,
    popoverAriaRole,
    anchorElementRef,
    setPopoverOpen,
    popoverOpen,
  } = props;
  return (
    <AnchorButton
      ariaLabel={ariaLabel}
      ariaDescription={ariaDescription}
      popoverAriaRole={popoverAriaRole}
      anchorElementRef={anchorElementRef}
      setPopoverOpen={setPopoverOpen}
      popoverOpen={popoverOpen}
    >
      <svg className={cssModule.stewInfoIcon} viewBox={"-5 -5 34 34"}>
        <circle
          className={cssModule.iconOutlineCircle}
          cx={12}
          cy={12}
          r={14}
        />
        <g transform={"scale(0.95) translate(0.5,1.5)"}>
          <circle cx={"12"} cy={"3.75"} r={"2"} />
          <path
            d={
              "M15.89,8.11C15.5,7.72,14.83,7,13.53,7c-0.21,0-1.42,0-2.54,0C8.53,6.99,6.48,5.2,6.07,2.85C5.99,2.36,5.58,2,5.09,2h0 c-0.61,0-1.09,0.54-1,1.14C4.53,5.8,6.47,7.95,9,8.71V21c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-5h2v5c0,0.55,0.45,1,1,1h0 c0.55,0,1-0.45,1-1V10.05l3.24,3.24c0.39,0.39,1.02,0.39,1.41,0v0c0.39-0.39,0.39-1.02,0-1.41L15.89,8.11z"
            }
          />
        </g>
      </svg>
    </AnchorButton>
  );
}

interface StewInfoPopoverContentProps
  extends CorePopoverContentProps,
    Pick<
      StewInfoBopperProps,
      "stewConfig" | "stewSegmentState" | "selectStewSegment"
    > {}

function StewInfoPopoverContent(props: StewInfoPopoverContentProps) {
  const {
    stewConfig,
    stewSegmentState,
    selectStewSegment,
    anchorElementRef,
    initialFocusElementRef,
    popoverNavigationItemBlurHandler,
  } = props;
  const { sortedSegmentOptions } = useMemo(() => {
    return {
      sortedSegmentOptions: Object.values(stewConfig.stewSegments).sort(
        (configA, configB) => configA.segmentIndex - configB.segmentIndex
      ),
    };
  }, [stewConfig]);
  return (
    <div className={cssModule.contentContainer}>
      <div className={cssModule.contentHeader}>
        <div className={cssModule.stewNameText}>
          {stewConfig.stewInfo.stewName}
        </div>
        <div className={cssModule.closeButtonContainer}>
          <Button
            className={cssModule.closeButton}
            ariaLabel={"close popover"}
            ariaDescription={"a button that closes the stew info popover"}
            elementRef={initialFocusElementRef}
            onBlur={popoverNavigationItemBlurHandler}
            onSelect={() => {
              anchorElementRef.current instanceof HTMLDivElement
                ? anchorElementRef.current.focus()
                : throwInvalidPathError(
                    "StewInfoPopoverContent.CloseButton.onSelect"
                  );
            }}
            onClick={() => {
              anchorElementRef.current instanceof HTMLDivElement
                ? anchorElementRef.current.setAttribute(
                    "data-pointer-focus",
                    "true"
                  )
                : throwInvalidPathError(
                    "StewInfoPopoverContent.CloseButton.onClick"
                  );
            }}
          >
            <svg className={cssModule.closeIcon} viewBox={"0 0 24 24"}>
              <path
                className={cssModule.closeIconOutlineCircle}
                d={
                  "M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10 S17.53 2 12 2z"
                }
              />
              <path
                d={
                  "M12 2m4.3 14.3c-.39.39-1.02.39-1.41 0L12 13.41 9.11 16.3c-.39.39-1.02.39-1.41 0-.39-.39-.39-1.02 0-1.41L10.59 12 7.7 9.11c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L12 10.59l2.89-2.89c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41L13.41 12l2.89 2.89c.38.38.38 1.02 0 1.41z"
                }
              />
            </svg>
          </Button>
        </div>
      </div>
      <div className={cssModule.stewTaglineText}>
        {stewConfig.stewInfo.stewTagline}
      </div>
      <div className={cssModule.stewMessageText}>
        {stewConfig.stewInfo.stewMessage}
      </div>
      <div className={cssModule.segmentLinks}>
        {sortedSegmentOptions.map((someSegmentConfig) => (
          <div
            key={someSegmentConfig.segmentKey}
            className={cssModule.segmentLinkContainer}
          >
            <Button
              ariaLabel={`view ${someSegmentConfig.segmentLabel} segment`}
              ariaDescription={`a button that navigates to the ${someSegmentConfig.segmentLabel} segment`}
              className={getCssClass(cssModule.segmentLinkButton, [
                cssModule.activeSegment,
                someSegmentConfig.segmentKey === stewSegmentState.segmentKey,
              ])}
              onBlur={popoverNavigationItemBlurHandler}
              onSelect={() => {
                if (
                  someSegmentConfig.segmentKey !== stewSegmentState.segmentKey
                ) {
                  selectStewSegment(someSegmentConfig.segmentKey);
                }
                anchorElementRef.current instanceof HTMLDivElement
                  ? anchorElementRef.current.focus()
                  : throwInvalidPathError(
                      "StewInfoPopoverContent.CloseButton.onSelect"
                    );
              }}
              onClick={() => {
                anchorElementRef.current instanceof HTMLDivElement
                  ? anchorElementRef.current.setAttribute(
                      "data-pointer-focus",
                      "true"
                    )
                  : throwInvalidPathError(
                      "StewInfoPopoverContent.CloseButton.onClick"
                    );
              }}
            >
              {someSegmentConfig.segmentLabel}
            </Button>
          </div>
        ))}
      </div>
      <div className={cssModule.contentNavigationFooter}>
        {stewConfig.stewInfo.stewLinks.map((someExternalLink, linkIndex) => (
          <div key={linkIndex} className={cssModule.externalLinkContainer}>
            <LinkButton
              target={"_blank"}
              ariaLabel={`go to ${stewConfig.stewInfo.stewName}'s ${someExternalLink.linkLabel}`}
              ariaDescription={`a button that opens a new tab and navigates to ${stewConfig.stewInfo.stewName}'s ${someExternalLink.linkLabel}`}
              className={cssModule.externalLinkButton}
              onBlur={popoverNavigationItemBlurHandler}
              href={someExternalLink.linkHref}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: someExternalLink.linkIconSvg,
                }}
              />
            </LinkButton>
          </div>
        ))}
      </div>
    </div>
  );
}
