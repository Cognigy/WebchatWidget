import * as React from "react";
import {
  MessagePlugin,
  MessageComponentProps
} from "../../../../../common/interfaces/message-plugin";
import { MarkdownMessageBubble } from "../../../presentational/MarkdownMessageBubble";
import MessageBubble from "../../../presentational/MessageBubble";
import MessageBubbleThumbs from "../../../presentational/MessageBubbleThumbs";

const RegularMessage = ({
  message: { text, source },
  config: { settings: { enableGenericHTMLStyling, displayThumbs } }
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

  const color = (() => {
    switch (source) {
      case 'user':
        return 'default';

      case 'bot':
      case 'agent':
      case 'engagement':
      default:
        return 'primary';
    }
  })();

  const align = (() => {
    switch (source) {
      case 'user':
        return 'right';

      case 'bot':
      case 'agent':
      case 'engagement':
      default:
        return 'left';
    }
  })();

  const MessageBubbleComponent = enableGenericHTMLStyling ? MarkdownMessageBubble : displayThumbs ? MessageBubbleThumbs : MessageBubble;

  return (
    <MessageBubbleComponent
      color={color}
      align={align}
      dangerouslySetInnerHTML={{ __html: text || "" }}
      className={className}
    />
  );
};

const regularMessagePlugin: MessagePlugin = {
  match: ({ text, source }, config) => {
    // do not render engagement messages unless configured!
    if (source === 'engagement' && !config.settings.showEngagementMessagesInChat) {
      return false;
    }

    const hasText = !!text;

    return hasText;
  },
  component: RegularMessage
};

export default regularMessagePlugin;
