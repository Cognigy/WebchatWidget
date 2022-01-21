import * as React from "react";
import { styled } from "../../style";
import { interactionCss } from "../../utils/css";
import { getBackgroundImage } from "../../../plugins/messenger/MessengerPreview/lib/css";

interface ILogoProps {
  src: string;
}

export default styled.div<ILogoProps>(({ src }) => ({
  ...interactionCss,
  backgroundImage: getBackgroundImage(src),
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
}));
