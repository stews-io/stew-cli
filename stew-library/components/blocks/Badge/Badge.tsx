import {
  ComponentChildren,
  FunctionComponent,
} from "../../../../stew-library/deps/preact/mod.ts";
import { getCssClass } from "../../../../stew-library/utilities/mod.ts";
import { CoreAriaOrnaments } from "../../../hooks/mod.ts";
import { LinkButton, LinkButtonProps } from "../../mod.ts";
// @deno-types="CssModule"
import cssModule from "./Badge.module.scss";

export interface TextBadgeProps extends BadgeBaseDataProps {}

export function TextBadge(props: TextBadgeProps) {
  const { badgeClassname, badgeLabel } = props;
  return (
    <BadgeBase
      BadgeIcon={NullIcon}
      badgeClassname={badgeClassname}
      badgeLabel={badgeLabel}
    />
  );
}

function NullIcon() {
  return null;
}

export interface LinkBadgeProps
  extends BadgeBaseDataProps,
    Pick<LinkButtonProps, "ariaLabel" | "ariaDescription"> {
  badgeHref: LinkButtonProps["href"];
}

export function LinkBadge(props: LinkBadgeProps) {
  const { badgeHref, ariaLabel, ariaDescription, badgeClassname, badgeLabel } =
    props;
  return (
    <LinkButton
      className={cssModule.badgeLinkButton}
      href={badgeHref}
      ariaLabel={ariaLabel}
      ariaDescription={ariaDescription}
      target={"_blank"}
    >
      <BadgeBase
        BadgeIcon={LinkBadgeIcon}
        badgeClassname={badgeClassname}
        badgeLabel={badgeLabel}
      />
    </LinkButton>
  );
}

function LinkBadgeIcon() {
  return (
    <svg className={cssModule.badgeLinkIcon} viewBox={"0 0 24 24"}>
      <path
        d={
          "M18 19H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h5c.55 0 1-.45 1-1s-.45-1-1-1H5c-1.11 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-.55-.45-1-1-1s-1 .45-1 1v5c0 .55-.45 1-1 1zM14 4c0 .55.45 1 1 1h2.59l-9.13 9.13c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L19 6.41V9c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1h-5c-.55 0-1 .45-1 1z"
        }
      />
    </svg>
  );
}

interface BadgeBaseProps extends BadgeBaseDataProps, BadgeBaseConfigProps {}

interface BadgeBaseDataProps {
  badgeLabel: string;
  badgeClassname?: string;
}

interface BadgeBaseConfigProps {
  BadgeIcon: FunctionComponent;
}

function BadgeBase(props: BadgeBaseProps) {
  const { badgeLabel, badgeClassname, BadgeIcon } = props;
  return (
    <div
      className={getCssClass(cssModule.badgeBase, [
        badgeClassname,
        Boolean(badgeClassname),
      ])}
    >
      <div className={cssModule.badgeLabel}>{badgeLabel}</div>
      <BadgeIcon />
    </div>
  );
}

export interface BadgeListProps
  extends Pick<CoreAriaOrnaments<"list">, "ariaLabel"> {
  children: ComponentChildren;
}

export function BadgeList(props: BadgeListProps) {
  const { children, ariaLabel } = props;
  return (
    <div className={cssModule.badgeListContainer}>
      <div className={cssModule.badgeList} role={"list"} aria-label={ariaLabel}>
        {children}
      </div>
    </div>
  );
}

export interface BadgeListItemProps {
  children: ComponentChildren;
}

export function BadgeListItem(props: BadgeListItemProps) {
  const { children } = props;
  return (
    <div className={cssModule.badgeListItem} role={"listitem"}>
      {children}
    </div>
  );
}
