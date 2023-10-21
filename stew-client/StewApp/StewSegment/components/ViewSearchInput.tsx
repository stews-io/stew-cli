import { useMemo, useRef } from "../../../../stew-library/deps/preact/hooks.ts";
import { Input } from "../../../../stew-library/components/mod.ts";
import { throwInvalidPathError } from "../../../../stew-library/utilities/mod.ts";
import { SegmentPageProps } from "./SegmentPage.tsx";

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
      inputRef={searchInputRef}
      value={stewSegmentState.viewSearchQuery}
      placeholder={`search ${
        stewConfig.stewSegments[stewSegmentState.segmentKey].segmentLabel
      }`}
      onFocus={scrollInputIntoFocus}
      onInput={(someInputEvent) => {
        updateSegmentViewSearch(someInputEvent.currentTarget.value);
      }}
      clearButtonProps={{
        ariaLabel: "clear search",
        ariaDescription:
          "a button that clears the current segment view search query",
        onFocus: scrollInputIntoFocus,
        onSelect: () => {
          clearSegmentViewSearch();
        },
      }}
    />
  );
}
