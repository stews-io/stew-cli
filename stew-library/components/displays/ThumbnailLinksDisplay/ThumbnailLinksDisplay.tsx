import { DisplayContainer, LinkButton } from "stew/components/mod.ts";
// @deno-types="CssModule"
import cssModule from "./ThumbnailLinksDisplay.module.scss";

export interface ThumbnailLinksDisplayProps {
  itemTitle: string;
  itemThumbnailHref: string;
  itemLinks: Array<{
    linkLabel: string;
    linkHref: string;
    ariaLabel: string;
    ariaDescription: string;
  }>;
  itemLabelLists: Array<{
    accessibilityLabel: string;
    listLabels: Array<string>;
  }>;
}

export function ThumbnailLinksDisplay(props: ThumbnailLinksDisplayProps) {
  const { itemTitle, itemThumbnailHref, itemLinks, itemLabelLists } = props;
  return (
    <DisplayContainer>
      <div className={cssModule.topContainer}>
        <img
          className={cssModule.itemThumbnail}
          alt={`${itemTitle}: thumbnail`}
          src={itemThumbnailHref}
        />
        <div className={cssModule.itemLinks}>
          {itemLinks.map((someItemLink) => {
            return (
              <div className={cssModule.itemLinkContainer}>
                <LinkButton
                  className={cssModule.itemLinkButton}
                  ariaLabel={someItemLink.ariaLabel}
                  ariaDescription={someItemLink.ariaDescription}
                  href={someItemLink.linkHref}
                  target={"_blank"}
                >
                  {someItemLink.linkLabel}
                </LinkButton>
              </div>
            );
          })}
        </div>
      </div>
      <div className={cssModule.itemInfoContainer}>
        {itemLabelLists.map((someLabelList) => (
          <ItemLabelList
            accessibilityLabel={someLabelList.accessibilityLabel}
            listLabels={someLabelList.listLabels}
          />
        ))}
      </div>
    </DisplayContainer>
  );
}

interface ItemLabelListProps {
  accessibilityLabel: string;
  listLabels: Array<string>;
}

function ItemLabelList(props: ItemLabelListProps) {
  const { accessibilityLabel, listLabels } = props;
  return (
    <div
      className={cssModule.itemLabelListContainer}
      aria-label={accessibilityLabel}
    >
      <div
        role={"list"}
        className={cssModule.itemLabelList}
        aria-label={accessibilityLabel}
      >
        {listLabels.map((someListLabel) => (
          <div
            role={"listitem"}
            className={cssModule.itemLabel}
            key={someListLabel}
          >
            {someListLabel.toLowerCase()}
          </div>
        ))}
      </div>
    </div>
  );
}
