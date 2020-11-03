import * as React from "react";
import { IMessage } from "../../../../../common/interfaces/message";
import {
  MessagePlugin,
  MessageComponentProps
} from "../../../../../common/interfaces/message-plugin";
import MessageBubble from "../../../presentational/MessageBubble";

const RegularMessage = ({
  message: { text, source }
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

  return (
    <MessageBubble
      color={color}
      align={align}
      dangerouslySetInnerHTML={{ __html: text || "" }}
      className={className}
    />
  );
};

const regularMessagePlugin: MessagePlugin = {
  match: ({ text }) => !!text,
  component: RegularMessage
};

export default regularMessagePlugin;
