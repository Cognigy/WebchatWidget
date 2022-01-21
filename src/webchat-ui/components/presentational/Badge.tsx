import React, { ComponentProps } from "react";
import { styled } from "../../style";

const BadgeBase = styled.span(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "-10%",
  right: "-5%",
  fontSize: (theme.unitSize * 3) / 2,
  fontWeight: 700,
  width: theme.unitSize * 3,
  height: theme.unitSize * 3,
  borderRadius: "50%",
  backgroundColor: "rgb(235, 15, 0)",
  color: "white",
  fontFamily: "sans-serif",
}));

interface IBadgeProps extends ComponentProps<typeof BadgeBase> {
  content: number;
}

const Badge = (props: IBadgeProps) => {
  const { content, ...badgeBaseProps } = props;

  if (content === 0) return null;

  return <BadgeBase {...badgeBaseProps}>{content}</BadgeBase>;
};

export default Badge;
