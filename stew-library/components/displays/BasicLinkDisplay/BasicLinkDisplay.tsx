import {
  BadgeList,
  BadgeListItem,
  DisplayContainer,
  LinkBadge,
  LinkButton,
  TextBadge,
} from "../../mod.ts";
// @deno-types="CssModule"
import cssModule from "./BasicLinkDisplay.module.scss";

export interface BasicLinkDisplayProps {
  itemTitle: string;
  itemHref: string;
  itemLabels: Array<string>;
  itemSecondaryLinks: Array<{
    linkLabel: string;
    linkHref: string;
  }>;
}

export function BasicLinkDisplay(props: BasicLinkDisplayProps) {
  const { itemHref, itemTitle, itemLabels, itemSecondaryLinks } = props;
  return (
    <DisplayContainer>
      <div className={cssModule.itemTitleContainer}>
        <LinkButton
          className={cssModule.itemTitleButton}
          href={itemHref}
          target={"_blank"}
          ariaLabel={`open "${itemTitle}"`}
          ariaDescription={`a button that opens up a new tab and navigates to ${itemHref}`}
        >
          {itemTitle.toLocaleLowerCase()}
        </LinkButton>
      </div>
      <BadgeList ariaLabel={"link badges"}>
        {itemLabels.map((someItemLabel) => (
          <BadgeListItem>
            <TextBadge badgeLabel={someItemLabel.toLocaleLowerCase()} />
          </BadgeListItem>
        ))}
        {itemSecondaryLinks.map((someSecondaryLink) => (
          <BadgeListItem>
            <LinkBadge
              badgeLabel={someSecondaryLink.linkLabel.toLocaleLowerCase()}
              badgeHref={someSecondaryLink.linkHref}
              ariaLabel={`open "${someSecondaryLink.linkLabel}" link for "${itemTitle}"`}
              ariaDescription={`a button that opens up a new tab and navigates to ${someSecondaryLink.linkHref}`}
            />
          </BadgeListItem>
        ))}
      </BadgeList>
    </DisplayContainer>
  );
}
