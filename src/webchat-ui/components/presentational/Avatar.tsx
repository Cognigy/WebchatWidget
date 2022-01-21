import React from "react";
import { styled } from "../../style";
import { CSSProperties } from "react";
import { getBackgroundImage } from "../../../plugins/messenger/MessengerPreview/lib/css";

interface IAvatarProps {
  src: string;
}

export default styled.div<IAvatarProps>(({ theme, src }) => ({
  borderRadius: 20,
  height: theme.unitSize * 3,
  width: theme.unitSize * 3,
  border: `1px solid ${theme.greyWeakColor}`,
  backgroundImage: getBackgroundImage(src),
  backgroundSize: "cover",
  backgroundPosition: "center center",
  backgroundRepeat: "no-repeat",
}));
