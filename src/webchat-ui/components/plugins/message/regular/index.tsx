import * as React from "react";
import {
  MessagePlugin,
  MessageComponentProps,
} from "../../../../../common/interfaces/message-plugin";
import { sanitizeHTML } from "../../../../../webchat/helper/sanitize";
import { replaceUrlsWithHTMLanchorElem } from "../../../../../webchat/helper/url-links";
import { MarkdownMessageBubble } from "../../../presentational/MarkdownMessageBubble";
import MessageBubble from "../../../presentational/MessageBubble";

const RegularMessage = ({
  message: { text, source },
  config: {
    settings: {
      enableGenericHTMLStyling,
      disableHtmlContentSanitization: disableMessageTextSanitization,
      disableRenderURLsAsLinks,
    },
  },
  color,
  direction,
}: MessageComponentProps) => {
  const className = (() => {
    switch (source) {
      case "bot":
        return "regular-message bot";

      case "user":
        return "regular-message user";

      case "agent":
        return "regular-message agent";

      case "engagement":
        return "regular-message engagement";

      default:
        return "regular-message";
    }
  })();

  const bubbleColor = color === 'primary' ? 'primary' : 'default';
  const align = direction === 'outgoing' ? 'right' : 'left';

  const MessageBubbleComponent = enableGenericHTMLStyling
    ? MarkdownMessageBubble
    : MessageBubble;

  const actualText = text || "";

  const enhancedURLsText = disableRenderURLsAsLinks ? actualText : replaceUrlsWithHTMLanchorElem(actualText);

  const __html = disableMessageTextSanitization
    ? enhancedURLsText
    : sanitizeHTML(enhancedURLsText);

  return (
    <MessageBubbleComponent
      color={bubbleColor}
      align={align}
      dangerouslySetInnerHTML={{ __html }}
      className={className}
    />
  );
};

const regularMessagePlugin: MessagePlugin = {
  match: ({ text, source }, config) => {
    // do not render engagement messages unless configured!
    if (
      source === "engagement" &&
      !config.settings.showEngagementMessagesInChat
    ) {
      return false;
    }

    const hasText = !!text;

    return hasText;
  },
  component: RegularMessage,
};

export default regularMessagePlugin;
