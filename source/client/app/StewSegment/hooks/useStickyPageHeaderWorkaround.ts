import {
  useLayoutEffect,
  useRef,
} from "../../../../../shared/deps/preact/hooks.ts";
import { throwInvalidPathError } from "../../../../../shared/general/throwInvalidPathError.ts";

export interface UseStickyPageHeaderWorkaroundApi {
  stickyPageHeaderWorkaroundClassname: string;
}

export function useStickyPageHeaderWorkaround(
  api: UseStickyPageHeaderWorkaroundApi
) {
  const { stickyPageHeaderWorkaroundClassname } = api;
  const pageHeaderContainerRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const pageHeaderContainerElement =
      pageHeaderContainerRef.current ??
      throwInvalidPathError(
        "useStickyPageHeaderWorkaround.pageHeaderContainerElement"
      );
    const pageHeaderContainerObserver = new ResizeObserver(
      (observedElementEntries) => {
        const pageHeaderContainerEntry = observedElementEntries.at(0);
        if (pageHeaderContainerEntry instanceof ResizeObserverEntry) {
          pageHeaderContainerElement.style.setProperty(
            "--page-header-width",
            `${pageHeaderContainerEntry.contentRect.width}px`
          );
          pageHeaderContainerElement.classList.add(
            stickyPageHeaderWorkaroundClassname ??
              throwInvalidPathError(
                "useStickyPageHeaderWorkaround.cssModule.stickyPageHeaderWorkaround"
              )
          );
        } else {
          throwInvalidPathError(
            "useStickyPageHeaderWorkaround.pageHeaderContainerEntry"
          );
        }
      }
    );
    pageHeaderContainerObserver.observe(pageHeaderContainerElement);
  }, []);
  return { pageHeaderContainerRef };
}
