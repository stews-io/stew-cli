import {
  BadgeList,
  BadgeListItem,
  DisplayContainer,
  LinkButton,
  TextBadge,
} from "stew/components/mod.ts";
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
    ariaLabel: string;
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
          {itemLinks.map((someItemLink) => (
            <div className={cssModule.itemLinkContainer}>
              <LinkButton
                className={cssModule.itemLinkButton}
                ariaLabel={someItemLink.ariaLabel}
                ariaDescription={someItemLink.ariaDescription}
                href={someItemLink.linkHref}
                target={"_blank"}
              >
                {someItemLink.linkLabel.toLocaleLowerCase()}
              </LinkButton>
            </div>
          ))}
        </div>
      </div>
      <div className={cssModule.itemInfoContainer}>
        {itemLabelLists.map((someLabelList) => (
          <BadgeList ariaLabel={someLabelList.ariaLabel}>
            {someLabelList.listLabels.map((someListLabel) => (
              <BadgeListItem>
                <TextBadge badgeLabel={someListLabel.toLowerCase()} />
              </BadgeListItem>
            ))}
          </BadgeList>
        ))}
      </div>
    </DisplayContainer>
  );
}
