import { useMemo, useRef } from "../../../../stew-library/deps/preact/hooks.ts";
import {
  Button,
  ButtonProps,
  Input,
} from "../../../../stew-library/components/mod.ts";
import { throwInvalidPathError } from "../../../../stew-library/utilities/mod.ts";
import { SegmentPageProps } from "./SegmentPage.tsx";
// @deno-types="CssModule"
import cssModule from "./ViewSearchInput.module.scss";

export interface ViewSearchInputProps
  extends Pick<
    SegmentPageProps,
    | "stewConfig"
    | "stewSegmentState"
    | "updateSegmentViewSearch"
    | "clearSegmentViewSearch"
  > {}

export function ViewSearchInput(props: ViewSearchInputProps) {
  const {
    stewConfig,
    stewSegmentState,
    updateSegmentViewSearch,
    clearSegmentViewSearch,
  } = props;
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollInputIntoFocus = useMemo(
    () => () => {
      const approximateViewSearchDocumentTop = 64;
      const searchInputElement =
        searchInputRef.current ??
        throwInvalidPathError("ViewSearchInput.searchInputRef");
      if (
        searchInputElement.getBoundingClientRect().top <
        approximateViewSearchDocumentTop
      ) {
        window.scrollTo({
          behavior: "smooth",
          top: 0,
        });
      }
    },
    []
  );
  return (
    <Input
      inputContainerClassname={cssModule.searchInputContainer}
      inputRef={searchInputRef}
      value={stewSegmentState.viewSearchQuery}
      placeholder={`search ${
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel
      }`}
      onFocus={scrollInputIntoFocus}
      onInput={(someInputEvent) => {
        updateSegmentViewSearch(someInputEvent.currentTarget.value);
      }}
      InputDecorator={ClearInputButton}
      inputDecoratorProps={{
        onFocus: scrollInputIntoFocus,
        onSelect: () => {
          clearSegmentViewSearch();
        },
      }}
    />
  );
}

interface ClearInputButtonProps
  extends Pick<ButtonProps, "onFocus" | "onSelect"> {}

function ClearInputButton(props: ClearInputButtonProps) {
  const { onFocus, onSelect } = props;
  return (
    <Button
      onFocus={onFocus}
      onSelect={onSelect}
      ariaLabel={"clear search"}
      ariaDescription={
        "a button that clears the current segment view search query"
      }
    >
      <svg className={cssModule.clearInputIcon} viewBox={"0 0.5 23 23"}>
        <path
          className={cssModule.iconOutlineCircle}
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
  );
}
