import * as React from "react";
import TypingIndicatorDots from "./TypingIndicatorDots";
import MessageBubble from "./MessageBubble";
import { styled } from "../../style";

const TypingIndicatorBubbleRoot = styled(MessageBubble)(({ theme }) => ({
  marginBottom: -theme.unitSize,
  padding: theme.unitSize * 1.5,

  transform: `translateX(-${theme.unitSize * 4}px)`,
  opacity: 0,

  transition: "opacity .3s ease-out, transform .3s ease-out",

  "&.active": {
    transform: "translateX(0)",
    opacity: 1,
  },
}));

export default ({
  className,
  ...restProps
}: React.ComponentProps<typeof TypingIndicatorBubbleRoot>) => (
  <TypingIndicatorBubbleRoot
    align="left"
    color="primary"
    {...restProps}
    className={`webchat-typing-indicator ${className || ""}`}
  >
    <TypingIndicatorDots />
  </TypingIndicatorBubbleRoot>
);
